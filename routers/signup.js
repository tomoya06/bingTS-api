module.exports = {
    method: 'POST',
    queries: ['username', 'password'],
    handler: (req, res, next, db) => {
        const { username, password } = req.body
        const isUsernameExist = db.collection('user').find({
            username,
            password
        }).count == 0
        if (isUsernameExist) {
            req.code = 400
            req.error = 'Username has been used'
            return next()
        }
        db.collection('user').insertOne({ username, password })
            .then(results => {
                req.code = 200
                req.results = results
                return next()
            })
            .catch(err => {
                req.code = 500
                req.error = err
                return next()
            })
    }
}