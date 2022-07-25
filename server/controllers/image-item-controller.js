const { storage } = require('../config/firbase-config');
const { ref, getDownloadURL, uploadBytes, deleteObject } = require('firebase/storage');
const ImageModel = require('../models/image-item-model');
const uniqid = require('uniqid');

exports.uploadImageItem = async (req, res, next) => {
    // save to firebase if user uploads local file
    // save url to database otherwise
    let newImageName;
    let url;
    if (req.files) {
        const file = Object.values(req.files)[0];
        const imageBuffer = file.data;  // values return an array
        newImageName = (file.name.split('.'))[0] + '-' + uniqid() + '.' + (file.name.split('.'))[1];
        
        // firebase reference
        const imageRef = ref(storage, newImageName);
        // upload to firebase
        await uploadBytes(imageRef, imageBuffer);
        url = await getDownloadURL(imageRef);
    } else {
        newImageName = 'image';
        url = req.body.imgBlob
    }

    const {author, createdOn, title, description, destination, itemSize} = req.body;
    const data = {
        author, createdOn, title, description, destination, itemSize, newImageName, url
    }
    try {
        const response = await ImageModel.saveItem(data);
        const recordId = response[0]['insertId'];
        return res.status(200).json({url: url, id: recordId});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: err});
    }

}

exports.deleteImageItem = async (req, res, next) => {

    // delete database record
    const id = req.params['id'];
    try {
        const response = await ImageModel.deleteById(id);
        return res.status(200).json({message: 'image deleted'})

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

async function getImageFile (imagePath) {
    try {
        const imageRef = await ref(storage, imagePath);
        // console.log(imagePath)
        const url = await getDownloadURL(imageRef);
        console.log(url)
        return url;
    } catch (err) {
        console.log(err)
    }
}

exports.getAllImageFiles = async (req, res, next) => {
    try {
        const [allImages, _] = await ImageModel.findAll();
        res.status(200).json(allImages);
    } catch(err) {
        console.log(err)
    }
}

const createImageObject = (imageDetails, imageUrl) => {
    return {
        id: imageDetails.image_id,
        author: imageDetails.image_author,
        createOn: imageDetails.createdOn,
        title: imageDetails.image_title,
        description: imageDetails.image_description,
        destination: imageDetails.image_destination,
        item_size: imageDetails.image_size,
        imageName: imageDetails.image_file_name,
        imageUrl: imageUrl,
    }
}

exports.getOne = async (req,res,next) => {
    const query = req.params;
} 
