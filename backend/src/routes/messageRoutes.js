const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

router.use(protect);

router.get("/conversations", messageController.listConversations);
router.post("/conversations/start", messageController.startConversation);
router.get("/conversations/:id/messages", messageController.getMessages);
router.post("/conversations/:id/messages", messageController.sendMessage);

module.exports = router;
