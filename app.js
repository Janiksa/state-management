'use strict';
const express = require('express');
const app = express();
const port = 3000;
const passport = require("./utils/pass");

const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/form');
    }
};

app.set('views', './views');
app.set('view engine', 'pug');

const session = require("express-session");
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000},
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('home');
});

app.get("/setCookie/:clr", (req, res) => {
    res.cookie("color", req.params.clr).send("cookies set");
});

app.get("/deleteCookie", (req, res) => {
    res.clearCookie("color").send("cookies deleted");
});

app.get("/form", (req, res) => {
    res.render("form");
})

app.get('/secret', loggedIn, (req, res) => {
    res.render('secret');
});

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
        console.log('success');
        res.redirect('/secret');
    });


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
