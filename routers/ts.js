const Crawler = require('crawler')

/**
 * ts api
 * query: keyword
 */
module.exports = {
    method: 'GET',
    queries: ['keyword'],
    handler: (req, res, next) => {
        const { keyword = '' } = req.query
        const url = `https://cn.bing.com/dict/search?q=${keyword}`

        const c = new Crawler({
            maxConnections: 10,
            callback: function (error, response, done) {
                if (error) {
                    req.code = 500
                    req.error = error
                    next()
                } else {
                    var $ = response.$
                    if ($('.content').find('.no_results').length > 0) {
                        req.code = 404
                        req.error = 'No results'
                        next()
                    } else {
                        req.code = 200
                        req.results = extractJson($)
                        next()
                    }
                }
            }
        })

        c.queue(url)
    }
}

function extractJson($) {
    const resJson = {
        keyword: '',
        defs: [],
        prons: [],
        sams: [],
        transforms: ''
    }
    // headword
    if ($('.qdef').find('#headword').length > 0) {
        resJson.keyword = $('#headword').text()
    }
    // Pronounciations
    if ($('.qdef').find('.hd_prUS').length > 0) {
        resJson.prons.push($('.qdef .hd_prUS').text())
    }
    if ($('.qdef').find('.hd_pr').length > 0) {
        resJson.prons.push($('.qdef .hd_pr').text())
    }
    // defs
    if ($('.qdef').children('ul').length > 0) {
        $('.qdef').children('ul').contents('li').each(function (i, elem) {
            resJson.defs.push({
                pos: $(this).children('.pos').text(),
                def: $(this).children('.def').text()
            })
        })
    }
    // transforms
    if ($('.qdef').find('.hd_if').length > 0) {
        resJson.transforms = $('.qdef .hd_if').text()
    }
    // sentences
    if ($('.se_div').find('.se_li').length > 0) {
        $('.se_div .se_li').each(function (i, elem) {
            resJson.sams.push({
                en: $(this).children('.se_li1').children('.sen_en').text(),
                cn: $(this).children('.se_li1').children('.sen_cn').text()
            })
        })
    }

    Object.keys(resJson).forEach(key => {
        if (resJson[key] === '' || resJson[key] instanceof Array && resJson[key].length == 0) {
            delete resJson[key]
        }
    })

    return resJson
}
