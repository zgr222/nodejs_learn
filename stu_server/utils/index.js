function regFn(req, arr) {
  const params = {}
  arr.forEach(key => {
    if (['', null, undefined].includes(req.body[key])) return
    if (key == 'sex') {
      params[key] = req.body[key]
    } else {
      params[key] = new RegExp(req.body[key], 'i')
    }
  })
  return params
}

module.exports = {
  regFn
}