const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const prisma = require('./prisma')
const { format } = require('date-fns');
passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            username: username
          }
        })
        if (!user) {
            console.log("Incorrect username or password");
          return done(null, false, { message: "Incorrect username or password *" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          // passwords do not match!
          console.log("Incorrect password");
          return done(null, false, { message: "Incorrect username or password *" })
        }


        console.log("User authenticated", format(new Date(), 'yyyy-MM-dd'));
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where : {
          id: id
        }
      });
  
      done(null, user);
    } catch(err) {
      done(err);
    }
  });

  module.exports = passport