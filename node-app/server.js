const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.get('/', async (req, res) => {
  res.render('home');
});

app.get('/secret', (req, res) => {
  if (!req.session.user) {
      return res.redirect('/login');
  }
  res.render('secret', { message: process.env.SECRET_MESSAGE });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.AUTH_USERNAME &&
        await bcrypt.compare(password, process.env.AUTH_PASSWORD)
    ) {
        req.session.user = { username };
        return res.redirect('/secret');
    }

    res.send('Invalid username or password');
});


app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Error logging out');
        res.redirect('/login');
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
