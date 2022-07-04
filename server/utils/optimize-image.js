const sharp = require('sharp');

sharp('../upload/pic3.jpg').resize(300, 800).toFile("out1.jpg")