const { validateSignUp } = require("../validation/signUpValidator")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")
const prisma = require('../prisma')
exports.getSignUp = (req, res) => {
    // console.log(prisma)
    res.render("signup")
}

exports.postSignUp = [
    validateSignUp, 
    async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).render("signup", {
                errors: errors.array()
            })
        }
        const username = req.body.username
        const password = req.body.password

        const hashedPassowrd = await bcrypt.hash(password, 10)
        try{
            await prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassowrd
                }
            
            })
            console.log("user created")
            res.redirect("/")
        } catch(e){
            // console.error(e)
            next(e)
        }
    }
]