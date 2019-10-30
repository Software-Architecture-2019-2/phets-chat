const response = require('../util/response')
const Joi = require('joi');

const create = async (req, res,next) => {
  try {
    req.sent = req.body.sent
    req.received = req.body.received
    req.adopt = req.body.adopt
    next()
  } catch (err) {
    return response.error(res,500,'Unexpected error')
  }
}

const deleteCollection = async (req, res, next) => {
  try {
    req.sent = req.body.sent
    req.received = req.body.received
    next()
  } catch (err) {
    return response.error(res, 500, 'Unexpected error')
  }
}

//Validator
const createValidator = (data) => {
  const schema = {
    content: Joi.string().required().min(0).max(1500),
    received: Joi.string().required(),
    sent: Joi.string().required(),
    adopt: Joi.boolean().required(),
  }
  return Joi.validate(data,schema);
}

const deleteCollectionValidator = (data) => {
  const schema = {
    received: Joi.string().email().required(),
    sent: Joi.string().email().required()
  }
  return Joi.validate(data,schema);
}


module.exports = {
  create,
  createValidator,
  deleteCollection,
  deleteCollectionValidator
}