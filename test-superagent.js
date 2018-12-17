const request = require('superagent')
const saCheerio = require('superagent-cheerio')

const url = `https://www.bing.com/dict/search?q=good`

request.get(url).use(saCheerio).then((res) => {
    console.log(res.$('.no_results').text())
    console.log(res.$('#headword').text())
}).catch((error) => {
    console.error(error)
})

