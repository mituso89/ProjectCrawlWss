const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient;
const urlMongo = "mongodb+srv://mituso:2NisEgUF2JSFRciH@cluster0-j1jtc.mongodb.net/amazon?retryWrites=true"
const Product = require('./models/product')
const mongoConnect = require('./ulti/database');


(async () => {
    await mongoConnect.mongoConnect();
    await Product.fetchAll().then(products => {
      /*   let product = products.filter((pr) => {
            return ( ((pr.weighItem == "" && pr.shippingItem == "") || (pr.shippingItem == undefined & pr.weighItem == undefined)))
        }) */
        
        let product = products.filter((pr) => {
            return ( pr.price !="0" && pr.price!=null && ((pr.shippingItem!="" && pr.shippingItem!=null)|| (pr.weighItem!="" &&pr.weighItem!=null)  )) 
        })
        console.log(product)
    })


})()


