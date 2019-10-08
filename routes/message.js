const express = require('express')
const router = express.Router()

const validator = require('../middleware/validator')
const message = require('../controller/message')
const firebaseChat = require("../middleware/firebaseChat")


router.post('/', validator(message.createValidator, 'message',['content','received','sent']), message.create, firebaseChat.sendMessage)


module.exports = router