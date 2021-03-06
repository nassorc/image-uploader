// backup image blob data
let imageBlob;
let imageFile;

// create item function
const createItem = (itemDetails) => {
    const imageContainer = document.querySelector('.image-container');  // container to append to

    const divElm = document.createElement('div');
    const imgElm = document.createElement('img');
    divElm.classList.add('item')
    divElm.classList.add(`item__${itemDetails.item_size}`)
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
{/* <div class="item-footer">
            <a href="${itemDetails.destination}">${itemDetails.destination}</a>
            <button>${itemDetails.description}</button>
            <button>...</button>
        </div> */}
    divElm.appendChild(imgElm);
    imageContainer.appendChild(divElm)
} 

const sendFileToBackend = async (userData) => {
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

const fetchImageData = () => {
    return fetch('http://localhost:3001/images')
}

document.addEventListener('DOMContentLoaded', async (e) => {
    // load stored images
    const response = await fetchImageData()
    const data = await response.json()
    data.forEach(item => {
        createItem(item)
    })

    // load modal to DOM
    const modal = new Modal();
    const openBtn = document.querySelector('.add-item-btn');
    const saveImageBtn = document.querySelector('#btn-save');
    const fileInp = document.querySelector('#upload-image');  // holds image data

    // modal event listener
    // open modal - modal
    openBtn.addEventListener('click', (e) => {
        modal.showModal();
    });

    // save image unit - modal
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
        const userData = {
            author: 'matthew',
            createOn: new Date().toISOString(),
            title: title,
            description: description,
            destination: destination,
            img_blob: imageBlob,
            item_size: imageSize,
        }
        // send post req to server
        const backendResponse = await sendFileToBackend(userData)
        // reset modal funciton
        modal.resetModal()
        // create item function
        createItem(userData)
    });

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
                console.log(imgElm)
                // document.querySelector('label.upload-image-label').classList.remove('upload-image-label')
                document.querySelector('label.upload-image-label').style.display = 'none';
                document.querySelector('.section2 .item-upload').style.display = 'block';
                document.querySelector('.section2 .item-upload').appendChild(imgElm);
            })
        } else {
            console.log('File reader failed')
        }
    });
})