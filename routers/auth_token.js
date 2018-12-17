// User login with granted client and get token
const randomString = require('string-random')
const moment = require('moment')
const crypto = require('crypto')

async function isClientValid(client_id, client_secret, db) {
    const clientRes = await db.collection('client').findOne({ client_id })
    if (!clientRes || clientRes.client_secret !== client_secret) {
        return false
    }
    return true 
}

async function isUserValid(username, password, db) {
    const userRes = await db.collection('user').findOne({ username })
    if (!userRes || userRes.password !== password) {
        return false
    }
    return true
}

function generateToken(client_id, username) {
    return {
        client_id,
        username,
        access_token: crypto.createHash('sha256').update(client_id).update(username).update(moment().add(1, 'week').format('x')).digest('hex'),
        expires_in: moment().add(1, 'week').format('x'),
        // expires_in: moment().format('x'),
        refresh_token: crypto.createHash('sha256').update(client_id).update(username).update(moment().add(2, 'weeks').format('x')).digest('hex'),
        refresh_token_expires_in: moment().add(2, 'weeks').format('x')
    }
}

async function insertNewToken(token, db) {
    try {
        await db.collection('token').deleteMany({
            username: token.username, 
            client_id: token.client_id
        })
        await db.collection('token').insertOne(token)
        return [true, null]
    } catch (error) {
        return [false, error]
    }
}

module.exports = {
    method: 'POST',
    queries: ['client_id', 'client_secret', 'username', 'password'],
    auth: null,
    handler: async (req, res, next, db) => {
        const { client_id='', client_secret='', username='', password='' } = req.body
        if (!isClientValid(client_id, client_secret, db) || !isUserValid(username, password, db)) {
            // login error
            req.error = 'login error'
            req.code = 401
            return next()            
        }
        const newToken = generateToken(client_id, username)
        // db insert will add '_id' to original document object...
        const dbNewToken = Object.assign({}, newToken)
        const [insertRes, insertError] = await insertNewToken(dbNewToken, db)
        if (!insertRes) {
            // update db error
            req.error = insertError
            req.code = 500
            return next()
        }

        // new token success
        req.code = 200
        req.results = newToken
        return next()

    }
}