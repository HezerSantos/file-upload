const express = require("express")
const app = express()
const path = require('path');
require('dotenv').config();

//set up
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
const assetsPath = path.join(__dirname, "public")

//secutiry
const helmet = require('helmet');
app.use(helmet());

//auth
const session = require("express-session");
const passport = require("./passport");

app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',  // Only use secure cookies in production
      httpOnly: true,  // Prevents JavaScript access to the cookie (helps prevent XSS)
      sameSite: 'strict'  // Helps prevent CSRF attacks
    }
}));

app.use(passport.initialize());
app.use(passport.session());



//log in
// app.use("/login", loginRouter)

//log out
// app.get("/log-out", (req, res, next) => {
//     req.logout((err) => {
//       if (err) {
//         return next(err);
//       }
//       if (req.user){
//         console.log("logout")
//       } else {
//         console.log("null")
//       }
//       res.redirect("/login");
//     });
//   });


app.listen(3000, () => {
    console.log('Running App')
})