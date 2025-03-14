const { body } = require('express-validator')

exports.updateValidator = [
    body("newName")
        .trim()
        .escape()
        .notEmpty().withMessage("Name cannot be blank")
]