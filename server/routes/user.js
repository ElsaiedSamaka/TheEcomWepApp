const express = require("express");
const router = express.Router();
const csrf = require("csurf");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");
const middleware = require("../middleware");
const {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin,
} = require("../config/validator");
const csrfProtection = csrf();
router.use(csrfProtection);

// GET: display the signup form with csrf token
router.get("/signup", middleware.isNotLoggedIn, (req, res) => {
    var messages = req.flash( "error" );
    res.json( {
    pageName: "Sign Up",
    messages,
    csrfToken: req.csrfToken(),
    })
});
// POST: handle the signup logic
router.post(
  "/signup",
  [
    middleware.isNotLoggedIn,
    userSignUpValidationRules(),
    validateSignup,
    passport.authenticate("local.signup", {
    //   successRedirect: "/user/profile",
    //   failureRedirect: "/user/signup",
      failureFlash: true
    }),
  ],
   async ( req, res ) => {res.json( {pageName: "/user/profile"})
  }
);
// GET: display the signin form with csrf token
router.get("/signin", middleware.isNotLoggedIn, async (req, res) => {
    var messages = req.flash( "error" );
    res.json( {
    pageName: "user/signin",
    messages,
    csrfToken: req.csrfToken(),
    })
//   res.render("user/signin", {
//     csrfToken: req.csrfToken(),
//     messages,
//     pageName: "Sign In",
//   });
});

// POST: handle the signin logic
router.post(
  "/signin",
  [
    middleware.isNotLoggedIn,
    userSignInValidationRules(),
    validateSignin,
    passport.authenticate("local.signin", {
    //   successRedirect: "/user/profile",
    //   failureRedirect: "/user/signin",
      failureFlash: true,
    }),
  ],
    async ( req, res ) => { res.json( { pageName: "/user/profile" } ) }
);

// GET: display user's profile
router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  try {
    res.json( { orders: null, pageName: "User Profile" });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});

// GET: logout
router.get("/logout", middleware.isLoggedIn, (req, res) => {
  req.logout();
  req.session.cart = null;
    res.redirect( "/" );
    console.log("logout");  
});
module.exports = router;