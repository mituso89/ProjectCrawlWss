
const cheerio = require("cheerio")
const Product = require('./models/product')
const mongoConnect = require('./ulti/database')
const getHtml = require('./common/getHtml')
const productdetail = require('./common/productCommon')
const readFile = require('./common/readFileCommon')
const delay = require('delay')


function tuan(){
    return "tuan"
}
(async () => {
    await mongoConnect.mongoConnect()
     let amztxt = await readFile()
 
    /*  amztxt =  await Product.fetchAll().then(products => {
         return  products.filter((pr) => {
             return (((pr.weighItem == "" && pr.shippingItem == "") || (pr.shippingItem == undefined & pr.weighItem == undefined)||(pr.weighItem == null && pr.shippingItem == null)))
         })
 
         
     }) */
     amztxt = amztxt.slice(1000,2000) 
     let arrayAsin = []
     const delaytimearray=[8,9,10,11,12,13,14,15,16]
 
     arrayAsin.push(new Promise(async (NumAPI) => {
         let arrayasin1 = []
         for (let number = 0; number < 1; number++) {
             arrayasin1.push(new Promise(async (res) => {
                 while (amztxt.length > 0) {
                     let asinObject = amztxt.pop()
                     let asin =  asinObject
                     let link = "https://www.amazon.com/gp/product/" + asin
                     let seller  = "https://www.amazon.com/gp/offer-listing/{asin}/ref=dp_olp_new_mbc?ie=UTF8&condition=new"
                     seller = seller.replace("{asin}",asin)
                     let delaytime = delaytimearray[Math.floor(Math.random() * delaytimearray.length)]

                     let detail = await getHtml(link).then((txt) => {
                         return txt;
                     }).catch((err) => {
 
                         console.log("detail: " + err)
                     })
                     let detailseller = await getHtml(seller).then((txt) => {
                         return txt;
 
                     }).catch((err) => {
                         console.log("detalseller: " + err)
                         
                     })
                     if (detail == null || detail == ""  ) {
                         console.log("detail error: " + asin)
                     }
                     else {
                         let $ = cheerio.load(detail)
                         let tuan = await productdetail.productdetail($, asin)
                         if(JSON.stringify(tuan)=="{}"){
                            console.log("productdetail: " + JSON.stringify(tuan) + "")
                         }
                         else{
                             let result = tuan
                             result.asin = asin
                             if (detailseller == null || detailseller == "" ) {
     
                                 console.log("detailseller error :" +asin)
                             }
                             else {
                                 let $1 = cheerio.load(detailseller)
     
                                 let tuan1 = await productdetail.productseller($1, asin)
                                 if(JSON.stringify(tuan1)=="{}"){
                                    console.log("productSeller: " + JSON.stringify(tuan1) + "")
                                 }
                                 else{
                                     result.price = tuan1.price
                                     result.shipping = tuan1.shipping
                                     //,asinObject._id
                                     const product =await new Product(result.category, result.ratting, result.name, result.price, result.shipping, result.asin, result.weighItem, result.shippingItem, result.imageList)
                                     await product.save().then(res => {
                                         console.log("update thanh cong :"+ asin)
                                     }).catch(err => {
                                         console.log(err)
                                     })
                                 }
                              
                             }
                          
                         }
                       
                        
                         
 
                     }
 
                 }
 
                 res();
             }));
 
 
         }
 
         await Promise.all(arrayasin1);
         NumAPI();
 
 
     }))
 
     await Promise.all(arrayAsin);
 
 
 
 })()
 


