const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const users = [];

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.send('Invalid username or password');
    }
    req.session.user = { username: user.username };
    res.redirect('/secret');
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Error logging out');
        res.redirect('/auth/login');
    });
});

module.exports = router;
