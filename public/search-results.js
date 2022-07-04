const addImagesToDom = (images) => {
    const parentContainer = document.createElement('div');
    parentContainer.classList.add('image-container');
    parentContainer.classList.add('container');
    images.forEach(image => {
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
            <button class="save-btn">Save</button>
            </div>
        </div>
        <img src="${imgSrc}" alt="${altImg}" loading="lazy"/>
        `
        parentContainer.appendChild(cardElm);
    })
    document.querySelector('.root').appendChild(parentContainer)
}

window.addEventListener('load', async (e) => {
    const params = (new URL(document.location)).searchParams
    const query = params.get('query')

    const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=40`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: '563492ad6f9170000100000152c6250c8a4b400d8d5512a49ab37f82'
        }
    });
    const data = await res.json();
    const allImages = data.photos;
    addImagesToDom(allImages)

    // create dom modal element
    const domSaveButtons = document.querySelectorAll('.save-btn')
    const modal = new Modal();
    domSaveButtons.forEach(button => {
        button.addEventListener('click', e => {
            modal.showModal();

        })
    })
    // domSaveButtons.forEach(button => {
        
    //     button.addEventListener('click', e => {
    //         const rootCard = e.target.parentElement.parentElement.parentElement;
    //         const domImageSrc = rootCard.querySelector('img').src;
    //         const imgElm = document.createElement('img')
    //         imgElm.src = domImageSrc;
    //         modal.style.display = 'flex';
    //         document.querySelector('label.upload-image-label').style.display = 'none';
    //         document.querySelector('.section2 .item-upload').style.display = 'block';
    //         document.querySelector('.section2 .item-upload').appendChild(imgElm);
    //     })

        
    // })
    
})