const config = require('./../config')
const assert = require('assert')
const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const options = {
    useNewUrlParser: true
}

async function initDB() {
    const database = await MongoClient.connect(config.dburl, options)
    return database
}

module.exports = initDB