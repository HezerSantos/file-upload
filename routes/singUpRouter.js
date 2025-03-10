const { Router } = require('express')
const { getSignUp, postSignUp } = require('../controllers/signUpController')

const signUpRouter = Router()

signUpRouter.get('/', getSignUp)

signUpRouter.post("/", postSignUp)

module.exports = signUpRouter