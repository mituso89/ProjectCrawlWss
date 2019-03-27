
const proxyList = require('./../Shared/proxy.js')
const userAgentList = require('./../Shared/userAgent')
const request = require("request")

let amazon = async (url, seller) => {
    return new Promise((resolve, reject) => {
        let userAgent = userAgentList[Math.floor(Math.random() * userAgentList.length)]
        let proxy = proxyList[Math.floor(Math.random() * proxyList.length)]
        var proxyUrl = "http://" + proxy.proxyName + ":" + proxy.proxyPass + "@" + proxy.proxyIp;
        let proxiedRequest = request.defaults({
            /* proxy: 'http://5.79.66.2:13080', */

            /* proxy: proxyUrl, */
            headers: {

                'User-Agent': userAgent,
                'Content-Type': 'text/html;charset=UTF-8',
                'Accept-Encoding': 'gzip, deflate,br',
                'authority': 'www.amazon.com',
                'path': '/s?i=aps&k=tuan&ref=nb_sb_noss2',
                'scheme': 'https',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            },
            gzip: true
        });
        proxiedRequest(url, (error, res, body) => {
            if (!error && res.statusCode == 200) {

                resolve(body)
            }
            else {
                reject(error)
                console.log("proxiedRequest:  " + error)
            }
        });
    })
}

module.exports = amazon