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

module.exports = {
    method: 'POST',
    queries: ['username', 'password'],
    handler: (req, res, next, db) => {
        const { username, password } = req.body
        db.collection('user').findOne({ username, password })
            .then(results => {
                assert.notStrictEqual(results, null)
                req.code = 200
                req.results = results
                return next()
            })
            .catch(err => {
                req.code = 403
                req.error = err
                return next()
            })
    }
}