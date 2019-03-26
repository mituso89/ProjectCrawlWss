const request = require("request")
const cheerio = require("cheerio")
const fs = require('fs');
const path = require('path');
const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient;
const urlMongo = "mongodb+srv://mituso:2NisEgUF2JSFRciH@cluster0-j1jtc.mongodb.net/amazon?retryWrites=true"
const userAgent = require('./Shared/userAgent')
const proxyList = require('./Shared/proxy.js')
const userAgentList = require('./Shared/userAgent')
const getHtml = require('./common/getHtml')
const productdetail = require('./common/productCommon')





function tuan(){
    return "tuan"
}



(async () => {

    let amztxt ={}

    let arrayAsin = []

    arrayAsin.push(new Promise(async (NumAPI) => {
        let arrayasin1 = []
        for (let number = 0; number < 2; number++) {
            arrayasin1.push(new Promise(async (res) => {
                while (amztxt.length > 0) {
                    let asin = amztxt.pop()
                    let link = "https://www.amazon.com/gp/product/" + asin
                    let seller = "https://www.amazon.com/gp/offer-listing/" + asin
                    let arrayasin = []


                    let detail = await getHtml(link).then((txt) => {
                        return txt;
                    }).catch((err) => {

                        /*  if (err.code == "ECONNRESET") {
                            if(amztxt.indexOf(asin)==-1){
                                  amztxt.push(asin)
                             
 
                         } */
                        console.log("detail: " + err)
                    })
                    let detailseller = await getHtml(seller).then((txt) => {
                        return txt;

                    }).catch((err) => {
                        console.log("detalseller: " + err)
                        /* if (err.code == "ECONNRESET") {
                             if(amztxt.indexOf(asin)==-1){
                                 amztxt.push(asin)
                             }
                        } */
                    })
                    if (detail == null || detail == "") {
                        console.log("detail: ")
                    }
                    else {
                        let $ = cheerio.load(detail)
                        let tuan = await productdetail.productdetail($, asin)
                        let result = tuan
                        result.asin = asin
                        if (detailseller == null || detailseller == "") {

                            console.log("detailseller: ")
                        }
                        else {
                            let $1 = cheerio.load(detailseller)

                            let tuan1 = await productdetail.productseller($1, asin)
                            result.price = tuan1.price
                            result.shipping = tuan1.shipping
                        }
                           await MongoClient.connect(urlMongo,{ useNewUrlParser: true }, function(err,db){
                               let dbo = db.db('amazon')
                               if(err) throw err
                               dbo.collection('productsamz').insertOne(result,function(err,res){
                                   if(err) throw err
                                   console.log(err)
                                   db.close();
                               })
                           })
                        await console.log(asin)

                    }





                    // await console.log(tuan)
                }
             
                res();
            }));


        }

        await Promise.all(arrayasin1);
        NumAPI();


    }))

    await Promise.all(arrayAsin);



})()


