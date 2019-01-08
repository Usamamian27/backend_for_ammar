"use strict";
const Joi = require("joi");
function validateUser(user) {
  const schema = Joi.object().keys({
    userName: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .email()
      .required()
  });
  return Joi.validate(user, schema);
}

exports.validate = validateUser;
