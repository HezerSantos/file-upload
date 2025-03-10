const { body, validationResult } = require("express-validator");

exports.validateLogIn = [
    body("username").trim()
        .escape(),
    body("password").trim()
        .escape()
]