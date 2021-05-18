const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: 'b2fd1c5d',
                s: searchTerm
            }
        });
    
        if (response.data.Error) {
            return [];
        } // This is for if "movie not found" happens with the OMDb API
    
        return response.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteConfig, // <-- Take everything from autoCompleteConfig^^ and copy it here!
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});
createAutoComplete({ // Now, we just make another one for the right side!
    ...autoCompleteConfig, 
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'b2fd1c5d',
            i: movie.imdbID
        }
    });  

    summaryElement.innerHTML = movieTemplate(response.data);
        // Pass in the full movie details where the function below will pull from and create HTML elements for them!

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => { // ROOM for IMPROVEMENT -- add a tally and display a banner or signifier on the movie that won
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index]; // this is piggy-backing so we don't need to write another forEach for the right side
    
        const leftSideValue = parseInt(leftStat.dataset.value); // <-- use parseInt on these becasue dataset values are strings by default
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};

const movieTemplate = movieDetail => {
    // Parsing all the comparison data and turning them into numbers!
        /* IDEA for FUTURE Improvement -- try and give different values for the awards
            - Oscar win = 2 pts
            - Oscar nomination = 1 pt
            - All other nominations = 0.5 pts
        */
    const dollars = parseInt(movieDetail.BoxOffice
        .replace(/\$/g, '')
        .replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0); // Switched from forEach approach to .reduce()

    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h2>${movieDetail.Title}</h2>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article data-value="${awards}" class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDb Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDb Votes</p>
    </article>
    `;
};