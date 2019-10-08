'use strict';

const _ = require('lodash');

module.exports = function(validator, type, values) {
  return (req,res,next) => {
    const data = _.pick(req.body[type], values)
    const { error } =  validator(data)
    if (error) {
      return res.status(400).send({
        data: {
          errors: error.details[0].message
        }
      })
    }
    req.body = data;
    next();
  }
}
