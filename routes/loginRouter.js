const { Router } = require("express")
const { getLogin } = require("../controllers/loginController")
const prisma = require('../prisma')
const { validateLogIn } = require("../validation/loginValidator")
const { body, validationResult } = require("express-validator");
const passport = require('../passport')
const loginRouter = Router()

loginRouter.get("/", getLogin)

loginRouter.post(
    "/", 
    validateLogIn,
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.status(400).render("login", {
                errors: errors.array()
            })
        }
        next()
    },
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.session.flashMessage = info.message || 'Login failed';
                return res.redirect('/');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/dashboard');
            });
        })(req, res, next);
    }
    

)

module.exports = loginRouter