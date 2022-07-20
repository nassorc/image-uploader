const { storage } = require('../config/firbase-config');
const { ref, getDownloadURL, uploadBytes, deleteObject } = require('firebase/storage');
const ImageModel = require('../models/image-item-model');
const uniqid = require('uniqid');

exports.uploadImageItem = async (req, res, next) => {
    const uploadFile = req.files[Object.keys(req.files)];
    const imageItemDetails = req.body;
    const imageNameId = uniqid(); 
    imageItemDetails.imageName = imageItemDetails.imageName.split('.')[0] + '-' + imageNameId + '.' + imageItemDetails.imageName.split('.')[1]
    const imageRef = ref(storage, imageItemDetails.imageName)
    uploadBytes(imageRef, uploadFile.data)
    .then(async (snapshot) => {
        try {
            let returnObject = [];
            let response = await ImageModel.saveItem(imageItemDetails);
            let userId = response[0]['insertId']
            let userData = (await ImageModel.findById(userId))[0][0];
            let url = await getImageFile(userData['image_file_name']);
            returnObject.push(createImageObject(userData, url));
            return res.status(200).json(returnObject);

        } catch (err) {
            console.log(err);
            return res.status(501).json({message: 'Error'})
        }
    });

}

exports.deleteImageItem = async (req, res, next) => {
    // delete file from firebase
    // delete database record
    const id = req.params['id'];
    try {
        const imagePath = (await ImageModel.findById(id))[0][0]['image_file_name'];
    } catch (err) {
        console.log(err);
        return res.send(500).json({message: err.message});
    }

    const imageRef = ref(storage, imagePath);
    deleteObject(imageRef).then(() => {
        ImageModel.deleteById(id)
        return res.status(200).json({message: 'okok'})
    }). catch((err) => {
        console.log(err);
        return res.status(500).json({message: 'can not delete file from firebase'})

    })
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
        const allImageDetails = [];
        const [allImages, _] = await ImageModel.findAll();

        for (let item of allImages) {
            const imageRef = ref(storage, item.image_file_name);
            let url;
            try {
                url = await getDownloadURL(imageRef);
            } catch (err) {
                continue;
            }
            allImageDetails.push(createImageObject(item, url));
        }
        res.status(200).json(allImageDetails);
    } catch(err) {
        console.log(err)
    }
}

exports.getOne = async (req,res,next) => {
    const query = req.params;
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