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
input.addEventListener('input', (event) => {
    fetchData(event.target.value);
});