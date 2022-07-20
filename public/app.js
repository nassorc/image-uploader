const APP = {
    modalRoot: null,
    file: null,
    fileName: null,
    blob: null,
    imageData: null,
    init: async () => {
        // fetch all saved images
        const res = await APP.getAllImages();
        const images = await res.json();
        images.forEach(image => {
            APP.createImageUnit(image)

        });
        APP.modalRoot = document.getElementById('modalBackdrop');
        APP.addListeners();
    },
    addListeners: () => {
        document
            .getElementById('btnOpenModal')
            .addEventListener('click', APP.openModal);
        document
            .getElementById('modalBackdrop')
            .addEventListener('click', APP.closeModal);
        document
            .getElementById('upload-image')
            .addEventListener('change', APP.handleImageFile);
        document
            .getElementById('btn-save')
            .addEventListener('click', APP.saveImageUnit);
        document
            .querySelectorAll('.btn-remove')
            .forEach(btn => {
                btn.addEventListener('click', APP.deleteImageUnit);
            })
    },
    getAllImages: () => {
        return fetch('http://localhost:3001/images');
    },
    ///////////////////////////////////////////////////////////////////////
    openModal: (ev) => {
        APP.modalRoot.style.display = 'flex';
    },
    ///////////////////////////////////////////////////////////////////////
    closeModal: (ev) => {
        if (ev.target === APP.modalRoot) {
            APP.resetModal();
        }
    },
    ///////////////////////////////////////////////////////////////////////
    resetModal: () => {
        // hide modal
        APP.modalRoot.style.display = 'none';
        // reset input fields
        document.querySelector('#item_title').value = '';
        document.querySelector('#item_description').value = '';
        document.querySelector('#item_destination').value = '';
        document.querySelector('#item_size').value = '';
        document.querySelector('#upload-image').value ='';

        // remove image preview
        const imagePreview = document.querySelector('.section2 .item-upload');
        const imageFromPreview = document.querySelector('.section2 .item-upload img');
        const uploadImageLabel = document.querySelector('label.upload-image-label');
        if (imagePreview.style.display == 'block') {
            uploadImageLabel.style.display = 'block'
            imagePreview.style.display = 'none';
            imagePreview.removeChild(imageFromPreview);
        }
    },
    ///////////////////////////////////////////////////////////////////////
    handleImageFile: (ev) => {
        const inpImageFile = ev.target;
        APP.file = inpImageFile.files[0];
        APP.fileName = APP.file.name;
        const imgElm = document.createElement('img');

        if (APP.file.type.match(/image.*/)) {
            const reader = new FileReader();
            reader.readAsDataURL(APP.file);
            reader.addEventListener('load', (ev) => {
                APP.blob = reader.result;
                imgElm.src = APP.blob;

                document.querySelector('label.upload-image-label').style.display = 'none';
                document.querySelector('.section2 .item-upload').style.display = 'block';
                document.querySelector('.section2 .item-upload').appendChild(imgElm);
            });
        }
    },
    ///////////////////////////////////////////////////////////////////////
    saveImageUnit: async (ev) => {
        // retrieve form values
        const title = document.querySelector('#item_title').value;
        const description = document.querySelector('#item_description').value;
        const destination = document.querySelector('#item_destination').value;
        const imageSize = document.querySelector('#item_size').value;
        // validate inputs values  
        if(!title || !description || !destination || !imageSize || !APP.blob) {
            alert('Please fill in all input fields.');
            return;
        }
        APP.imageData = new FormData();
        APP.imageData.append('author', 'matthew');
        APP.imageData.append('createdOn', new Date().toISOString());
        APP.imageData.append('title', title);
        APP.imageData.append('description', description);
        APP.imageData.append('destination', destination);
        APP.imageData.append('imgBlob', APP.blob);
        APP.imageData.append('itemSize', imageSize);
        APP.imageData.append('imageName', APP.fileName);
        APP.imageData.append(APP.fileName, APP.file);
        console.log(Array.from(APP.imageData))

        APP.resetModal();
        const r = await APP.sendDataToBackend()
        APP.createImageUnit(r[0]);
    },
    ///////////////////////////////////////////////////////////////////////
    sendDataToBackend: async () => {
        const res = await fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: APP.imageData
        });
        const json = await res.json();
        return json;
    },
    ///////////////////////////////////////////////////////////////////////
    createImageUnit: (itemDetails) => {
        const imageContainer = document.querySelector('.image-container');  // container to append to
    
        const divElm = document.createElement('div');
        const imgElm = document.createElement('img');
        divElm.classList.add('item')
        divElm.classList.add(`item__${itemDetails.item_size}`)
        divElm.dataset.id = itemDetails.id
        imgElm.src = (itemDetails.imageUrl) ? itemDetails.imageUrl : `${itemDetails.img_blob}`
    
        divElm.innerHTML += `
        <div class="item-modal">
            <div class="item-header">
                <div>${itemDetails.title}</div>
                <button class="btn btn-remove">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            
        </div>
        `;
        divElm.appendChild(imgElm);
        imageContainer.appendChild(divElm)
        APP.addListeners();
    },
    ///////////////////////////////////////////////////////////////////////
    deleteImageUnit: async (ev) => {
        console.log('dletjkfljdsljflskdjl')
        const target = ev.target;
        const parent = target.closest('div.item');
        const unitId = parent.dataset.id;
        
        const res = await APP.deleteImage(unitId);
        const data = await res.json();
        console.log(data)
        parent.remove();
        
    },
    deleteImage: (id) => {
        return fetch(`/delete/${id}`, {
            method: 'DELETE',
        });
    }

}

window.addEventListener('DOMContentLoaded', APP.init);