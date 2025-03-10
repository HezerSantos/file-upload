const { body } = require('express-validator')


exports.validateFolder = [
    body("folderName")
        .trim()
        .escape()
]