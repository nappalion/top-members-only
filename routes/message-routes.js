const express = require("express");
const messageController = require("../controllers/message-controller");

const router = express.Router();

router.get("/", messageController.messagesGet);
router.get("/create", messageController.createGet);
router.post("/create", messageController.createPost);
router.post("/delete", messageController.deletePost);

module.exports = router;
