const success = function (res,data) {
  return res.status(200).send({
    data: data
  });
}

const error = function (res, status, message) {
  return res.status(status).send({
    data: {
      error: message.toString()
    }
  })
}

const emptySuccess = function (res, status = 200) {
  return res.status(status).send();
}

module.exports = {
  success,
  error,
  emptySuccess
}