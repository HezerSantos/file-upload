const { body } = require('express-validator')


exports.validateFolder = [
    body("folderName")
        .trim()
        .isLength({ min: 1}).withMessage("Must be one character")
        .escape()
]