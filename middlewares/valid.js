const assert = require('assert')
const path = require('path')
const fs = require('fs')

const moment = require('moment')

// check if missing some necessary query
function checkQuery(method, req, targetQueries) {
    const queries = method==='GET'? req.query: req.body
    for (let i=0; i<targetQueries.length; i++) { if (!queries[targetQueries[i]]) { return false } }
    return true
}

// check if auth is needed and is valid
async function checkAuth(req, targetScope, db) {
    try {
        const headerAuth = req.get('Authorization')
        assert.notEqual(headerAuth, false)
        assert.notStrictEqual(headerAuth.match(/Bearer\s(\w+)/), null)

        const headerToken = headerAuth.replace(/Bearer\s(\w+)/, '$1')
        const tokenRes = await db.collection('token').findOne({ access_token: headerToken })
        assert.notEqual(tokenRes, false)

        assert.strictEqual(moment().format('x')<tokenRes.expires_in, true)

        const { scope } = await db.collection('client').findOne({ client_id: tokenRes.client_id })

        const scopeReg = new RegExp(`(\\bADMIN\\b|(\\b|\\s)${targetScope}(\\b|\\s))`, 'gm')
        assert.notStrictEqual(scope.match(scopeReg), null)

        return (scope.match(/\bADMIN\b/gm) !== null ? 1: 2)
    } catch (error) {
        return 0
    }
}

module.exports = async (req, res, next, db) => {
    const file = req.path.replace(/^\//i, '').replace(/\//g, '_')
    const filepath = path.resolve(__dirname, '../routers', file)

    // avoid 404 error
    if (!fs.existsSync(filepath+'.js')) { 
        req.code = 404
        req.skip = true
        return next() 
    }

    const { queries = [], method = 'GET', scope = '' } = require(filepath)
    if (req.method !== method) {
        req.code = 405
        req.error = 'Invalid Request Method'
        req.skip = true
        return next()
    } else if (!checkQuery(method, req, queries)) {
        req.code = 400
        req.error = 'Miss some queries'
        req.skip = true
        return next() 
    } 

    if (scope) {
        const isAuthValid = await checkAuth(req, scope, db)
        if (!isAuthValid) {
            req.code = 403
            req.error = 'auth error'
            req.skip = true
            return next()
        }

        req.admin = isAuthValid===1
        return next()
    }

    return next()
}