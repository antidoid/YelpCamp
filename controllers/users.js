const User = require(`../models/user`);

// To show the register form -- GET
module.exports.renderRegisterForm = (req, res) => {
    res.render(`users/register`);
}

// Getting data out of the register form and making a new user -- POST
module.exports.createNewUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash(`success`, `Welcome to Yelp Camp`);
            res.redirect(`/campgrounds`);
        });
    } catch (err) {
        req.flash(`error`, err.message);
        res.redirect(`/register`);
    }
}

// Serving a form for Login -- GET
module.exports.renderLoginForm = (req, res) => {
    res.render(`users/login`)
}

// Getting the data and logging in the user -- POSt
module.exports.login = (req, res) => {
    // If we make it to this route we can be sure that the user was authenticated successfully
    req.flash(`success`, `Welcome Back`);
    const redirectUrl = req.session.returnTo || `/campgrounds`;
    delete req.session.returnTo; // deleting it from the session so it doesn't persist to forever(kind of)
    res.redirect(redirectUrl);
}

// Loggging out an user -- GET
module.exports.logout = (req, res) => {
    req.logOut();
    req.flash(`success`, `Goodbye!`);
    res.redirect(`/campgrounds`);
}