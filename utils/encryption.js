const crypto = require('crypto')

const stringRandom = require('string-random')
const moment = require('moment')

/**
 * encript password for Database
 * @param {string} passwd 
 * @returns {Array} salt, encryped passwd
 */
function encryptPasswd(passwd) {
    const salt = stringRandom(32, { specials: true })
    const enPasswd = crypto.createHash('sha256').update(passwd).update(salt).digest('hex')
    return [salt, enPasswd]
}

function verifyPasswd(passwd, salt, enPasswd) {
    return enPasswd == crypto.createHash('sha256').update(passwd).update(salt).digest('hex')
}

module.exports = {
    encryptPasswd,
    verifyPasswd
}