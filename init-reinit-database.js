const mongodb = require('mongodb')
const moment = require('moment')

const dbconfig = require('./config')
const options = {
    useNewUrlParser: true
}

mongodb.connect(dbconfig.dburl, options, async function(error, database) {
    if (error) {
        console.error(error)
        return
    }

    const db = database.db(dbconfig.dbname)

    await db.collection('user').deleteMany({})
    await db.collection('client').deleteMany({})
    await db.collection('token').deleteMany({})

    console.log('finish')
})