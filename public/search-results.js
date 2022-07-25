const SEARCH = {
    params: null,
    query: null,
    images: [],
    init: async () =>  {
        SEARCH.params = (new URL(location)).searchParams;
        query = SEARCH.params.get('query');
        SEARCH.images = (await SEARCH.fetchImages()).photos;
        console.log(SEARCH.images)
        SEARCH.addImagesToDom();
    },
    fetchImages: async () => {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=40`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: '563492ad6f9170000100000152c6250c8a4b400d8d5512a49ab37f82'
            }
        });
        const data = await res.json();
        return data;
    },
    addImagesToDom: () => {
        const parentContainer = document.createElement('div');
        parentContainer.classList.add('image-container');
        parentContainer.classList.add('container');
        SEARCH.images.forEach(image => {
            const imgSrc = image.src.large;
            const altImg = image.alt
            // create a random size for the image
            const size = ['large', 'small', 'medium'][Math.floor(Math.random() * 3)];
            const cardElm = document.createElement('div');
            cardElm.classList.add('item');
            cardElm.classList.add(`item__${size}`);
            
            cardElm.innerHTML += `
            <div class="item-modal">
                <div class="item-header">
                <button class="save-btn btnOpenModal">Save</button>
                </div>
            </div>
            <img src="${imgSrc}" alt="${altImg}" loading="lazy"/>
            `
            parentContainer.appendChild(cardElm);
        })
        document.querySelector('.root').appendChild(parentContainer)
        APP.addListeners();
    }
}

window.addEventListener('DOMContentLoaded', SEARCH.init);