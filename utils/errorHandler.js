"use strict";
module.exports = {
  sendRawError: (res, error) => {
    res.status(400).send(error);
  }
};
