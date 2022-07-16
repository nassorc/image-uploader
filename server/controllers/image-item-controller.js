const { storage } = require('../config/firbase-config');
const { ref, getDownloadURL, uploadBytes } = require('firebase/storage');
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
            let response = await ImageModel.saveItem(imageItemDetails);
            response = response[0]['insertId']
            return res.status(200).json({id: response});

        } catch (err) {
            console.log(err);
            return res.status(501).json({message: 'Error'})
        }
    });

}

exports.deleteImageItem = async (req, res, next) => {
    try {

    } catch (err) {
        
    }
}

exports.getAllImageItems = async (req, res, next) => {
    try {
        const allImageDetails = [];
        const [allImages, _] = await ImageModel.findAll();

        for (let item of allImages) {
            const imageRef = ref(storage, item.image_file_name);
            const url = await getDownloadURL(imageRef);
            allImageDetails.push(createImageObject(item, url));
        }
        res.status(200).json(allImageDetails);
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


















// GETALLIMAGESITEMS
// app.get('/images', async (req, res) => {
//     const databaseResults = []
//     const [allImages, _] = await db.execute('SELECT * FROM image_details')
//     console.log(allImages)
//     // create db connection
//     // await pool.getConnection(async (err, connection) => {

//     //     if (err) return res.status(500).json({message: 'Server errror: cannot connect to database'})
//     //     const sql = 'SELECT * FROM image_details'

//     //     connection.query(sql, (err, results) => {
//     //         connection.release()
//     //         if (err) return res.status(500).json({message: 'Query failed'})
//     //         for (let row of results) {
//     //             databaseResults.push(
//     //                 {
//     //                     author: row.image_author,
//     //                     createOn: row.createdOn,
//     //                     title: row.image_title,
//     //                     description: row.image_description,
//     //                     destination: row.image_destination,
//     //                     item_size: row.image_size,
//     //                     imageName: row.image_file_name,
//     //                 }
//     //             )
//     //         }
//     //         // results.forEach(row => {
//     //         //     databaseResults.push(
//     //         //         {
//     //         //             author: row.image_author,
//     //         //             createOn: row.createdOn,
//     //         //             title: row.image_title,
//     //         //             description: row.image_description,
//     //         //             destination: row.image_destination,
//     //         //             item_size: row.image_size,
//     //         //             imageName: row.image_file_name,
//     //         //         }
//     //         //     )
//     //         // })
//     //     })
//     // })
//     // console.log(r)
//     // return res.status(200).json({images: r})
//     // use reft to get individual images

//     // append to list

//     // download url

//     // return list

//     // let imageListRef = ref(storage)
//     // let imageUrlList = []
//     // let imageFileNames = []
//     // let imageReturnItems = []
//     // let returnObject;

//     // console.log(imageListRef)

//     // await listAll(imageListRef)
//     // .then(async (response) => {
//     //     for (let image of response.items) {
//     //         const fileName = image._location.path_
//     //         const url = await getDownloadURL(image)
//     //         // imageUrlList.push(url)
//     //         // imageFileNames.push(fileName)
//     //         returnObject = await createImageReturnObject(fileName, url)
//     //         console.log(returnObject)
//     //         // imageReturnItems.push(returnObject)
//     //         // console.log(imageReturnItems)
//     //     }
//     // })

//     // return res.json({imageDetails: imageReturnItems}

// })