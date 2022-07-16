
const Modal = {
    root: null,
    init: () => {
        Modal.addListeners();
        Modal.root = document.getElementById('modalBackdrop');
    },
    addListeners: () => {
        document
            .getElementById('btnOpenModal')
            .addEventListener('click', Modal.openModal);
        Modal
            .root
            .addEventListener('click', Modal.resetModal)
    },
    ///////////////////////////////////////////////////////////////////////
    openModal: (ev) => {
        Modal.root.style.display = 'flex';
    },
    ///////////////////////////////////////////////////////////////////////
    resetModal: (ev) => {
        
    }
}

const APP = {
    root: null,
    file: null,
    blob: null,
    imageData: null,
    init: () => {
        APP.root = document.getElementById('modalBackdrop');
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
    },
    ///////////////////////////////////////////////////////////////////////
    openModal: (ev) => {
        APP.root.style.display = 'flex';
    },
    ///////////////////////////////////////////////////////////////////////
    closeModal: (ev) => {
        if (ev.target === APP.root) {
            APP.resetModal();
        }
    },
    ///////////////////////////////////////////////////////////////////////
    resetModal: () => {
        // hide modal
        APP.root.style.display = 'none';
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
        const imgElm = document.createElement('img');
        console.log(APP.file)
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
    saveImageUnit: (ev) => {
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

        // APP.imageData = {
        //     author: 'matthew',
        //     createOn: new Date().toISOString(),
        //     title: title,
        //     description: description,
        //     destination: destination,
        //     imgBlob: APP.blob,
        //     itemSize: imageSize,
        // }
        APP.imageData = new FormData();
        APP.imageData.append('author', 'matthew');
        APP.imageData.append('createdOn', new Date().toISOString());
        APP.imageData.append('title', title);
        APP.imageData.append('description', description);
        APP.imageData.append('destination', destination);
        APP.imageData.append('imgBlob', APP.blob);
        APP.imageData.append('itemSize', imageSize);
        // APP.imageData.append('');
        // APP.imageData.append();
        console.log(APP.iamgeData)

        APP.resetModal();
    },
    ///////////////////////////////////////////////////////////////////////
}

window.addEventListener('DOMContentLoaded', APP.init())