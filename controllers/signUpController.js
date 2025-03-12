const { validateSignUp } = require("../validation/signUpValidator")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")
const prisma = require('../prisma')
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
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

            const user = await prisma.user.findUnique({
                where: {
                    username: username
                },
                select: {
                    id: true
                }
            })

            const emptyFileBuffer = Buffer.from('');

            const { data, error } = await supabase
                .storage
                .from("files")
                .upload(`${user.id}/welcome.txt`,emptyFileBuffer, {
                    cacheControl: '3600',
                    upsert: false
                  })

            console.log("user directory created")
            res.redirect("/")
        } catch(e){
            // console.error(e)
            next(e)
        }
    }
]