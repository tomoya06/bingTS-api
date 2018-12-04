const app = require("express")()
const path = require("path")
const fs = require("fs")

const bodyParser = require("body-parser")

const responseRouter = require("./pre_routers/response")
const loggerRouter = require("./pre_routers/logger")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(loggerRouter)

const files = fs.readdirSync(path.resolve(__dirname, 'routers'))

files.forEach(file => {
  let route = file.replace(/\.js$/i, '').replace(/^(\w*)$/i, '/$1')
  let handler = require(`./routers/${file}`)

  app.use(route, handler)
})

app.use(responseRouter)

app.listen(3000, function() {
  console.log("Listening on port 3000")
})
