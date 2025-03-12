const { body } = require('express-validator')

exports.updateValidator = [
    body("newName")
        .trim()
        .notEmpty().withMessage("Name cannot be blank")
]