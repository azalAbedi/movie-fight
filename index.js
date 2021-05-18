const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'b2fd1c5d',
            s: searchTerm
        }
    });

    console.log(response.data);
};

const input = document.querySelector('input');

let timeoutId;
const onInput = event => {
    if (timeoutId) {
        clearTimeout(timeoutId);
            // This magic piece of code will always reset the setTimeout as a user keeps pressing their keys on the search input!
    }
    timeoutId = setTimeout(() => {
        fetchData(event.target.value);
    }, 500);
};

input.addEventListener('input', onInput);