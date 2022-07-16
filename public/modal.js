// create item function
function createImageUnit(itemDetails)  {
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
            <button class="btn btn-delete btn-remove">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        
    </div>
    `;
    divElm.appendChild(imgElm);
    imageContainer.appendChild(divElm)
}

async function sendDataToBackend(userData) {
    const imageFormData = new FormData()
    
    for (const field in userData) {
        if (field === 'img_blob') continue;
        imageFormData.append(field, userData[field])
    }
    imageFormData.append(imageFile.name, imageFile)
    imageFormData.append('imageName', imageFile.name)
    const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: imageFormData
    })
    const json = await res.json()
    return json
}

function buildModal() {
    // add event listeners to modal
    const modal = document.querySelector('.modal-backdrop');
    const openBtn = document.querySelector('.add-item-btn');
    const saveImageBtn = document.querySelector('#btn-save');
    const fileInp = document.querySelector('#upload-image');
    const deleteBtn = document.querySelector('#btn-delete')
    let imageBlob; // image data url

    const resetModal = () => {
        modal.style.display = 'none';

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
    }
    

    // open modal with click event
    openBtn.addEventListener('click', (e) => {
        modal.style.display = 'flex';
    });

    // close and reset modal with click event
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            resetModal()
        }
    })

    // listen for changes on input file element - modal
    fileInp.addEventListener('change', () => {
        let file = fileInp.files[0];
        imageFile = file;
        let dataUrl= '';
        const imageType = /image.*/;
        const imgElm = document.createElement('img')

        if (file.type.match(imageType)) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', (e) => {
                dataUrl = reader.result;
                imageBlob = dataUrl;
                imgElm.src =  dataUrl;
                
                document.querySelector('label.upload-image-label').style.display = 'none';
                document.querySelector('.section2 .item-upload').style.display = 'block';
                document.querySelector('.section2 .item-upload').appendChild(imgElm);
            })
        } else {
            console.log('File reader failed')
        }
    });

    // add save image event listener
    saveImageBtn.addEventListener('click', async (e) => {
        // retrieve form values
        const title = document.querySelector('#item_title').value;
        const description = document.querySelector('#item_description').value;
        const destination = document.querySelector('#item_destination').value;
        const imageSize = document.querySelector('#item_size').value;

        // validate inputs values
        if(!title || !description || !destination || !imageSize || !imageBlob) {
            console.log([title, description, destination, imageSize, imageBlob])
            alert('Please fill in all input fields.');
            return;
        }

        // structure data
        let userData = {
            author: 'matthew',
            createOn: new Date().toISOString(),
            title: title,
            description: description,
            destination: destination,
            img_blob: imageBlob,
            item_size: imageSize,
        }

        // send post req to server
        const backendResponse = await sendDataToBackend(userData)
        userData['id'] = backendResponse['id']
        // reset modal funciton
        resetModal()
        // create item function
        createImageUnit(userData)
    })
}
const APP = {
    root: null,
    file: null,
    fileName: null,
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
    },
    ///////////////////////////////////////////////////////////////////////
    sendDataToBackend: async () => {
        const res = await fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: APP.imageData
        });
        const json = await res.json();
        console.log(json)
        // return json;
    }
}