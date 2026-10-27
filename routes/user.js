const { Router } = require('express');
const User = require('../models/user');
const router = Router();

router.get('/signin', (req, res) => {
    return res.render("signin",req);
});

router.get('/signup', (req, res) => {
    return res.render("signup",req);
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie('token', token).redirect('/');
    } catch (error) {
        return res.status(401).render('signin', {
            error: "Incorrect Email or Password"
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});


router.post('/signup', async (req, res) => {
    console.log("Signup Data:", req.body);
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).send("All fields are required");
    }
    console.log(req.body);
    await User.create({ fullName, email, password });
    return res.render("home",req);
});

module.exports = router; 
