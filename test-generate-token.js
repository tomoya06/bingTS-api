const mongodb = require('mongodb')
const moment = require('moment')

// const { dburl } = require('./config')
const dburl = 'mongodb://localhost:27017'
const options = {
    useNewUrlParser: true
}

mongodb.connect(dburl, options, function(error, database) {
    if (error) {
        console.error(error)
        return
    }

    const db = database.db('test')
    db.collection('user').deleteMany({})
    db.collection('client').deleteMany({})

    db.collection('user').insertOne({
        username: 'admin',
        password: '000',
    })

    db.collection('client').insertOne({
        client_id: '000',
        client_secret: '000',
        scope: 'bingTS'
    })
    
    // db.collection('token').insertOne({
    //     client_id: '000',
    //     access_token: '001',
    //     expires_in: moment().add(7, 'days').format('x'),
    //     refresh_token: '002',
    //     refresh_token_expires_in: moment().add(14, 'days').format('x')
    // })
})