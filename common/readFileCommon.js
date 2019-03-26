
const fs = require('fs');
const path = require('path');
let readFile = ()=> {
    return new Promise(function (resolve, reject) {
        fs.readFile('amz.txt', 'utf8', function (err, data) {
            if (err) {
                reject(error);
            } else {
                resolve(data.split('\n'))
            }
        })
    })

}
module.exports = readFile