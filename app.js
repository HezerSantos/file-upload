const express = require("express")
const app = express()
const path = require('path');
require('dotenv').config();

//set up

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));

//secutiry
const helmet = require('helmet');
app.use(helmet());

//auth
const session = require("express-session");
const passport = require("./passport");
const loginRouter = require("./routes/loginRouter");
const signUpRouter = require("./routes/singUpRouter");
const dashboardRouter = require("./routes/dashboardRouter");

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


const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath));

// log in
app.use("/", loginRouter)
app.use("/dashboard", dashboardRouter)
app.use("/signup", signUpRouter)
//log out
app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      if (req.user){
        console.log("logout")
      } else {
        console.log("null")
      }
      res.redirect("/login");
    });
  });


app.listen(3000, () => {
    console.log('Running App')
})