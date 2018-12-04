const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')

const bodyParser = require('body-parser')

const responseRouter = require('./pre_routers/response')
const loggerRouter = require('./pre_routers/logger')
const validRouter = require('./pre_routers/valid')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(loggerRouter)
app.use(validRouter)

const files = fs.readdirSync(path.resolve(__dirname, 'routers'))
const handlerWrapper = handler => (req, res, next) => req.skip? next(): handler(req, res, next)
files.forEach(file => {
    let route = file.replace(/\.js$/i, '').replace(/_/g, '/').replace(/^(\w*)$/i, '/$1')
    let handler = handlerWrapper(require(`./routers/${file}`).handler)
    app.use(route, handler)
})

app.use(responseRouter)

app.listen(3000, function() {
    console.log('Listening on port 3000')
})
