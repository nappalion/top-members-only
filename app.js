require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const pgPool = require("./db/pool");
const pgSession = require("connect-pg-simple")(session);

const sessionStore = new pgSession({
  pool: pgPool,
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: sessionStore,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

app.get("/", (req, res) => {
  console.log(req.session);
  res.render("index");
});

app.listen(3000, () => console.log("app listening on port 3000!"));
