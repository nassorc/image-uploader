const searchInp = document.querySelector('#search-inp');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', async (e) => {
    const query = searchInp.value;
    // console.log(query)
    const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=10`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: '563492ad6f9170000100000152c6250c8a4b400d8d5512a49ab37f82'
        }
    });
    const data = await res.json();
})
