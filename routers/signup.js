const { encryptPasswd } = require('./../utils/oauth')

module.exports = {
    method: 'POST',
    queries: ['username', 'password'],
    handler: async (req, res, next, db) => {
        const { username, password } = req.body
        const usernameCnt = await db.collection('user').find({ username }).count()
        const isUsernameExist = usernameCnt !== 0

        if (isUsernameExist) {
            req.code = 400
            req.error = 'Username has been used'
            return next()
        }

        try {
            const [salt, enPasswd] = encryptPasswd(password)
            const wwUserRes = await db.collection('user').insertOne({ username, enPasswd })
            const wwSaltRes = await db.collection('salt').insertOne({ username, salt })

            req.code = 200
            req.results = { wwUserRes, wwSaltRes }
            return next()
        } catch (error) {
            await db.collection('user').deleteOne({ username })
            await db.collection('salt').deleteOne({ username })

            req.code = 400
            req.error = error
            return next()
        }
    }
}