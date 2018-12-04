module.exports = (req, res, next) => {
  console.log(`${(new Date()).toLocaleTimeString()} - ${req.ip} [${req.method}] ${req.originalUrl}`)
  if (req.method === 'POST') {
    console.log(`---- POST body: ${JSON.stringify(req.body)}`)
  }
  next()
}