const path = require('path')
const fs = require('fs')

module.exports = (req, res, next) => {
    const file = req.path.replace(/^\//i, '').replace(/\//g, '_')
    const filepath = path.resolve(__dirname, '../routers', file)

    // avoid 404 error
    if (!fs.existsSync(filepath+'.js')) { 
        req.skip = true
        req.code = 404
        return next() 
    }

    const { queries = [], method = 'GET' } = require(filepath)
    if (req.method !== method) {
        req.code = 405
        req.error = 'Invalid Request Method'
        req.skip = true
        return next()
    } else if (!(function() {
        for (let i=0; i<queries.length; i++) { if (!req.query[queries[i]]) { return false } }
        return true
    })()) {
        req.code = 400
        req.error = 'Miss some queries'
        req.skip = true
        return next() 
    }

    return next()
}