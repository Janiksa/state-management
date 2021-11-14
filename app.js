'use strict';
const express = require('express');
const app = express();
const port = 3000;
const username = 'foo';
const password = 'bar';

app.set('views', './views');
app.set('view engine', 'pug');

const session = require("express-session");
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));


app.get('/', (req, res) => {
  res.render('home');
});

app.get("/setCookie/:clr", (req, res) => {
  res.cookie("color", req.params.clr).send("cookies set");
});

app.get("/deleteCookie", (req,res) => {
  res.clearCookie("color").send("cookies deleted");
});

app.get("/form", (req, res) => {
  res.render("form");
})
app.get("/secret", (req, res) => {
  if (req.session.logged === true) {
    res.render("secret");
  } else {
    res.redirect("/form")
  }
})

app.post("/login", (req, res) => {

  if( req.body.username === username && req.body.password === password){
    req.session.logged = true;
    res.redirect("/secret");

  } else {
  req.session.logged = false;
  res.redirect("/form");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
