const express = require('express');
const userRoute = require('./routes/user');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const app = express();
const imageItemController = require('./controllers/image-item-controller');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const compression = require('compression');
const { ModuleFilenameHelpers } = require('webpack');

app.use(compression())

app.use(cors());

// middleware for cookies
app.use(cookieParser());


app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '/upload' )))

// handle incoming post request data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', userRoute);

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

module.exports = app;