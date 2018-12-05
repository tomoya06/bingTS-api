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

    const checkQuery = (method, req, targetQueries) => {
        const queries = method==='GET'? req.query: req.body
        for (let i=0; i<targetQueries.length; i++) { if (!queries[targetQueries[i]]) { return false } }
        return true
    }

    const { queries = [], method = 'GET' } = require(filepath)
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

    return next()
}