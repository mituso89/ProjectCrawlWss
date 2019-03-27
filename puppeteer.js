const puppeteer = require('puppeteer');

const delay = require('delay')
const NUM_BROWSERS = 1;
const NUM_PAGES = 1;
let fs = require('fs');
const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient;
const urlMongo = "mongodb+srv://mituso:2NisEgUF2JSFRciH@cluster0-j1jtc.mongodb.net/amazon?retryWrites=true"
const getHtml = require('./common/getHtml')
const productdetail = require('./common/productCommon')
const proxyList = require('./Shared/proxy.js')
const userAgentList = require('./Shared/userAgent')
const cheerio = require("cheerio")
const Product = require('./models/product')
const mongoConnect = require('./ulti/database')


function readFile() {
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

const blockedResourceTypes = [
    'media', 'link', 'stylesheet','script',
    'font',
    'texttrack',
    'object',
    'beacon',
    'csp_report',
    'imageset',
];

(async () => {
    const startDate = new Date().getTime();
    await mongoConnect.mongoConnect()


    const promisesBrowsers = [];
    let amztxt = await readFile()
    amztxt = amztxt.slice(1000,2000) 

    const delaytimearray=[8,9,10,11,12,13,14,15,16]

    for (let numBrowser = 0; numBrowser < NUM_BROWSERS; numBrowser++) {
        promisesBrowsers.push(new Promise(async (resBrowser) => {

            let proxy = proxyList[Math.floor(Math.random() * proxyList.length)]
            let proxyServer = '--proxy-server=' + proxy.proxyIp + ''
            const browser = await puppeteer.launch(
                {
                    headless: true,
                    args: [
                        /* proxyServer, */
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-infobars',
                        '--window-position=0,0',
                        '--ignore-certifcate-errors',
                        '--ignore-certifcate-errors-spki-list',
                    ]
                }
            );


            const promisesPages = [];

            for (let numPage = 0; numPage < NUM_PAGES; numPage++) {
                promisesPages.push(new Promise(async (resPage) => {
                    while (amztxt.length > 0) {
                        let asinObject = amztxt.pop()
                        const asin = asinObject
                        const url = "https://www.amazon.com/dp/" + asin;
                        let seller = "https://www.amazon.com/gp/offer-listing/{asin}"
                        seller = seller.replace("{asin}", asin)
                        console.log(`Visiting url: ${url}`);
                        let page = await browser.newPage();
                        let username = proxy.proxyName;
                        let password = proxy.proxyPass;
                        /* await page.authenticate({ username, password }); */

                        let delaytime = delaytimearray[Math.floor(Math.random() * delaytimearray.length)]
                        await page.setRequestInterception(true);

                        page.on('request', request => {

                            if (
                                blockedResourceTypes.indexOf(request.resourceType()) !== -1

                            ) {
                                request.abort();
                            } else {
                                request.continue();
                            }
                        });

                        try {
                            await page.goto(url);
                            const result = await page.evaluate(() => {

                                data = document.querySelector('html').innerHTML
                                return data


                            });
                            await delay(delaytime*1000)
                            await page.goto(seller);
                            await delay((delaytime+1)*1000)
                            const resultseller = await page.evaluate(() => {

                                data = document.querySelector('html').innerHTML
                                return data


                            });

                            if (result == null || result == "") {
                                console.log("detail error: " + asin)
                            }
                            else {
                                let $ = cheerio.load(result)
                                let tuan = await productdetail.productdetail($, asin)
                                if (JSON.stringify(tuan) == "{}") {
                                    console.log("productdetail: " + JSON.stringify(tuan) + "")
                                }
                                else {
                                    let result = tuan
                                    result.asin = asin

                                    if (resultseller == null || resultseller == "") {

                                        console.log("detailseller error :" + asin)
                                    }
                                    else {
                                        let $1 = cheerio.load(resultseller)

                                        let tuan1 = await productdetail.productseller($1, asin)
                                        if (JSON.stringify(tuan1) == "{}") {
                                            console.log("productSeller: " + JSON.stringify(tuan1) + "")
                                        }
                                        else {
                                            result.price = tuan1.price
                                            result.shipping = tuan1.shipping
                                            /* console.log(result) */
                                            const product = new Product(result.category, result.ratting, result.name, result.price, result.shipping, result.asin, result.weighItem, result.shippingItem, result.imageList, asinObject._id)
                                            await product.save().then(res => {
                                                console.log("update thanh cong :" + asin)
                                            }).catch(err => {
                                                console.log(err)
                                            })
                                            
                                        }

                                    }
                                }




                            }



                        } catch (err) {
                            console.log(`An error occured on url: ${url}`);
                        } finally {
                            await page.close();
                        }
                    }

                    resPage();
                }));
            }

            await Promise.all(promisesPages);
            
            await browser.close();
            

            resBrowser();
        }));
    }

    await Promise.all(promisesBrowsers);
    console.log(`Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`);

})();