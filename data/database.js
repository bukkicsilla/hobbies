const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
let database

const uri = "mongodb+srv://luamontana:M5NG5DB69.@cluster0.exxpnll.mongodb.net/?retryWrites=true&w=majority";

async function connect(){
  //const client = await  MongoClient.connect('mongodb://localhost:27017');
  const client = await MongoClient.connect(uri);
 database = client.db('hobbies')

}
function getDB(){
  if(!database){
    throw {message: 'No database connection!'}
  }
  return database
}

module.exports = {
  connectToDatabase: connect,
  getDB: getDB
}