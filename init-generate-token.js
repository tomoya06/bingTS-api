const mongodb = require('mongodb')

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

    await db.collection('user').insertOne({
        username: 'admin',
        password: 'peng-476612',
        role: 'ADMIN'
    })

    await db.collection('client').insertOne({
        client_id: 'tomoya00',
        client_secret: 'peng-476612',
        scope: 'ADMIN'
    })
    
    console.log('finish')
})