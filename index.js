const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongodb = require('mongodb')

const responseRouter = require('./middlewares/response')
const loggerRouter = require('./middlewares/logger')
const validRouter = require('./middlewares/valid')

/*
    config file should have:
    dburl: string, target mongodb url
*/
const config = require('./config')

const MongoClient = mongodb.MongoClient

const options = {
    useNewUrlParser: true
}

const dbcntLogger = setInterval(() => {
    console.count('Connecting to remote DB')
}, 1000)

MongoClient.connect(config.dburl, options, function(error, database) {
    clearInterval(dbcntLogger)

    if (error) {
        console.error(error)
        return 
    }

    // TODO: change db(<db name>)
    const db = database.db('test')

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    app.use(loggerRouter)
    app.use(validRouter)
    
    const files = fs.readdirSync(path.resolve(__dirname, 'routers'))
    const handlerWrapper = handler => (req, res, next) => req.skip? next(): handler(req, res, next, db)
    files.forEach(file => {
        let route = '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')
        let handler = handlerWrapper(require(`./routers/${file}`).handler)
        app.use(route, handler)
    })
    
    app.use(responseRouter)
    
    app.listen(3000, function() {
        console.clear()
        console.log('Connected to remote DB')
        console.log('Listening on port 3000')
    })
})
