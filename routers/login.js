const assert = require('assert')

const { verifyPasswd } = require('./../utils/oauth')


module.exports = {
    method: 'POST',
    queries: ['username', 'password'],
    handler: async (req, res, next, db) => {
        const { username, password } = req.body
        
        try {
            const dbUserRes = await db.collection('user').findOne({ username })
            const dbSaltRes = await db.collection('salt').findOne({ username })

            assert.notStrictEqual(dbUserRes, null)
            assert.notStrictEqual(dbSaltRes, null)
            assert.strictEqual(verifyPasswd(password, dbSaltRes.salt, dbUserRes.enPasswd), true)

            req.code = 200
            return next()
            
        } catch (error) {
            req.code = 400
            req.error = error
            return next()
        }

    }
}