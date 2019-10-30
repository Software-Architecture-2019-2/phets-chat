const express = require("express");
const router = express.Router();

const validator = require("../middleware/validator");
const message = require("../controller/message");
const firebaseChat = require("../middleware/firebaseChat");

//Create messages
router.post(
  "/",
  validator(message.createValidator, "message", [
    "content",
    "received",
    "sent",
    "adopt"
  ]),
  message.create,
  firebaseChat.sendMessage
);
// Delete conversation
router.delete(
  "/conversation",
  validator(message.deleteCollectionValidator, "conversation", [
    "received",
    "sent"
  ]),
  message.deleteCollection,
  firebaseChat.deleteChannel
);
// Delete notifications
router.delete(
  "/notifications",
  validator(message.deleteCollectionValidator, "notification", [
    "received",
    "sent"
  ]),
  message.deleteCollection,
  firebaseChat.deleteNotifications
);

module.exports = router;
