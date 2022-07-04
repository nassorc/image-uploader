const db = require('../config/db')
class ImageItemModel {
    // contains the image detail model and database function
    constructor(imageDetails = {}) {

    }
    static saveItem (imageItemDetails) {
        const sql = `INSERT INTO image_details
        (image_author, image_title, image_description, image_destination, image_size, image_file_name, createdOn)
        VALUES ('${imageItemDetails.author}', '${imageItemDetails.title}', '${imageItemDetails.description}', '${imageItemDetails.destination}','${imageItemDetails.item_size}', '${imageItemDetails.imageName}','${imageItemDetails.item_size}');`
        const newItem = db.execute(sql);
        return newItem;
    }
    static findAll() {
        return db.execute('SELECT * FROM image_details');
    }
    static findById(id) {
        return db.execute(`SELECT * FROM image_details WHERE id = ${id}`)
    }
}

module.exports = ImageItemModel;