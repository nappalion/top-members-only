const db = require("../db/queries");
const { isAuth } = require("../routes/auth-middleware");

const messagesGet = [
  isAuth,
  async (req, res) => {
    const messages = await db.getMessages();
    res.render("home", { title: "Home", messages: messages });
  },
];

async function createGet(req, res) {}

async function createPost(req, res) {}

async function deletePost(req, res) {}

module.exports = { messagesGet, createGet, createPost, deletePost };
