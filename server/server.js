const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const app = express();
const imageItemController = require('./controllers/image-item-controller');
require('dotenv').config();

const compression = require('compression');

app.use(compression())

app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '/upload' )))

// handle incoming post request data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/login', (req, res) => {
    res.json({message: 'login'})
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
app.post('/upload', fileUpload({ createParentPath: true }), imageItemController.uploadImageItem);
app.get('/images', imageItemController.getAllImageFiles);
app.get('/search', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'search-results.html'))
})
app.delete('/delete/:id', imageItemController.deleteImageItem);
app.get('/get/:id', imageItemController.getOne);
app.listen(3001, () => {
    console.log('listening on port 3001')
})

// async now waiting before returning
// https://salesforce.stackexchange.com/questions/330523/await-does-not-wait-for-promise-to-finish