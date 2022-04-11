const express = require(`express`);
const router = express.Router();
const users = require(`../controllers/users`);
const catchAsync = require(`../utils/catchAsync`);
const passport = require("passport");

router.route(`/register`)
    .get(users.renderRegisterForm) // To show the register form -- GET
    .post(catchAsync(users.createNewUser)); // Getting data out of the register form and making a new user -- POST

router.route(`/login`)
    .get(users.renderLoginForm) // Serving a form for Login -- GET
    .post(passport.authenticate(`local`, { failureFlash: true, failureRedirect: `/login` }), users.login); // Getting the data and logging in the user -- POSt

// Loggging out an user -- GET
router.get(`/logout`, users.logout);

module.exports = router;