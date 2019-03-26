
const mongodb = require("mongodb")
const getDb = require('./../ulti/database').getDb

class Product {
    constructor(category, ratting, name, price, shipping, asin, weighItem, shippingItem,imageList,id) {
        this.category = category,
            this.ratting = ratting,
            this.name = name,
            this.price = price,
            this.shipping = shipping,
            this.asin = asin,
            this.weighItem = weighItem,
            this.shippingItem = shippingItem,
            this.imageList = imageList
            this._id = id;
    }
    async save() {

        const db =await getDb();
        let dp0p;
        if(this._id){
            dp0p =  db.collection("productsWss")
            .updateOne({_id : new mongodb.ObjectId(this._id)},{$set:this})
        }else{
            dp0p =   db.collection("productsWss").insertOne(this)
        }

        
        return await dp0p.then(result => {
            
        }).catch(err => {
            
        })
      
    }
    static async fetchAll(){
        const db =await getDb();
        return db.collection('productsWss').find().toArray().then(products=>{
            return products;
        }).catch(err =>{
            console.log(err)
        })
    }
}

/* const Product = sequelize.define('product', {

    category: Sequelize.STRING,
    ratting: Sequelize.STRING,
    name: Sequelize.STRING,
    price: Sequelize.STRING,
    shipping: Sequelize.STRING,
    asin: Sequelize.STRING,
    weighItem: Sequelize.STRING,
    shippingItem: Sequelize.STRING
}); */

module.exports = Product;