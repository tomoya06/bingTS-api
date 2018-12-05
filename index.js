const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongodb = require('mongodb')

const responseRouter = require('./middlewares/response')
const loggerRouter = require('./middlewares/logger')
const validRouter = require('./middlewares/valid')

const config = require('./config')

const MongoClient = mongodb.MongoClient

const options = {
    useNewUrlParser: true
}

MongoClient.connect(config.dburl, options, function(error, database) {
    if (error) {
        console.error(error)
        return 
    }

    const db = database.db()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    app.use(loggerRouter)
    app.use(validRouter)
    
    const files = fs.readdirSync(path.resolve(__dirname, 'routers'))
    const handlerWrapper = handler => (req, res, next) => req.skip? next(): handler(req, res, next, db)
    files.forEach(file => {
        let route = file.replace(/\.js$/i, '').replace(/_/g, '/').replace(/^(\w*)$/i, '/$1')
        let handler = handlerWrapper(require(`./routers/${file}`).handler)
        app.use(route, handler)
    })
    
    app.use(responseRouter)
    
    app.listen(3000, function() {
        console.log('Listening on port 3000')
    })
})
