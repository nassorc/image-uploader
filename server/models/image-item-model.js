const db = require('../config/db')
class ImageItemModel {
    // contains the image detail model and database function
    constructor(imageDetails = {}) {

    }
    static saveItem (imageItemDetails) {
        const sql = `INSERT INTO image_details
        (image_author, image_title, image_description, image_destination, image_size, image_file_name, created_on, image_url)
        VALUES ('${imageItemDetails.author}', '${imageItemDetails.title}', '${imageItemDetails.description}', '${imageItemDetails.destination}','${imageItemDetails.itemSize}', '${imageItemDetails.newImageName}','${imageItemDetails.createdOn}', '${imageItemDetails.url}');`
        const newItem = db.execute(sql);
        return newItem;
    }
    static findAll() {
        return db.execute('SELECT * FROM image_details');
    }
    static findById(id) {
        return db.execute(`SELECT * FROM image_details WHERE image_id = '${id}'`)
    }
    static deleteById(id) {
        return db.execute(`DELETE FROM image_details WHERE image_id = '${id}'`);
    }
}

module.exports = ImageItemModel;