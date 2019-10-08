const response = require('../util/response')
const Joi = require('joi');

const create = async (req, res,next) => {
  try {
    req.sentEmail = req.body.sent
    req.receivedEmail = req.body.received
    next()
  } catch (err) {
    return response.error(res,500,'Unexpected error')
  }
}

//Validators
const createValidator = (data) => {
  const schema = {
    content: Joi.string().required().min(0).max(1500),
    received: Joi.string().email().required(),
    sent: Joi.string().email().required()
  }
  return Joi.validate(data,schema);
}


module.exports = {
  create,
  createValidator
}