module.exports = (req, res) => {
  if (req.error || req.code !== 200) {
    const { code = 404, error = 'No such api' } = req
    res.status(code).send({
      code, 
      error
    })
  } else {
    res.send({
      code: 200,
      results: req.results
    })
  }
}