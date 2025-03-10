exports.getLogin = (req, res) => {
    const message = req.session.flashMessage;
    delete req.session.flashMessage;
    res.render("login", {
        message: message
    })
}