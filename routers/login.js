const assert = require('assert')

function login(db, username, password) {
    return new Promise((resolve) => {
        const collection = db.collection('user')
        collection.find({ username, password }).toArray((err, docs) => {
            try {
                assert.strictEqual(err, null)
                assert.strictEqual(docs.length, 1, 'Username and password mismatch. ')
            } catch (error) {
                return resolve([null, error])
            }
            return resolve([true, null])
        })
    })
}

module.exports = (req, res, next) => {
    if (req.method !== 'POST') {
        
    }

    next()
}