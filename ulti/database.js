const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;


let _db;

const mongoConnect =async (callback)=>{
   await MongoClient.connect("mongodb+srv://mituso:2NisEgUF2JSFRciH@cluster0-j1jtc.mongodb.net/amazon?retryWrites=true",{ useNewUrlParser: true }).then(client =>{
        console.log("---------thanh cong")
        _db = client.db("amazon");
        callback()
        
    }).catch(err =>{
        console.log(err)
    })
}

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'no database';

}

exports.getDb = getDb
exports.mongoConnect = mongoConnect 
