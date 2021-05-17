require('dotenv').config()

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const assert = require('assert')

// Database
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_NAME = process.env.DB_NAME

// Connection URL
const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`

const client = new MongoClient(url)

// ACTIONS IDS
const ids = [
  { index: 1, id: '609a4e332dced100348197b8' },
  { index: 2, id: '609a90f12dced10034819906' },
  { index: 3, id: '609ba426803be7003434a102' },
  { index: 4, id: '609aaa682dced1003481996d' },
  { index: 5, id: '609ce8c3b6b6180034398a19' },
  { index: 6, id: '609bb7be803be7003434a130' },
  { index: 7, id: '609d21acb6b6180034398a8c' },
  { index: 8, id: '609959c82dced10034819649' },
  { index: 9, id: '609b9022803be7003434a09e' },
  { index: 10, id: '609e445bacf5ab00347d1580' },
  { index: 11, id: '609d2ee3b6b6180034398ab8' },
  { index: 12, id: '609ce77fb6b6180034398a11' },
  { index: 13, id: '609a75b92dced10034819857' },
  { index: 14, id: '609ea4f181cfbd00347d652d' },
  { index: 15, id: '609d2892b6b6180034398aa0' },
  { index: 16, id: '609a4e332dced100348197b9' },
  { index: 17, id: '609a90f12dced10034819907' },
  { index: 18, id: '609ba426803be7003434a101' },
  { index: 19, id: '609aaa682dced1003481996c' },
  { index: 20, id: '609ce8c3b6b6180034398a1b' },
  // { index: 21, id: '609ce8c3b6b6180034398a1b' }, // duplicate with 20
  { index: 22, id: '609bb7be803be7003434a12f' },
  { index: 23, id: '609d21acb6b6180034398a8d' },
  { index: 24, id: '609ce77fb6b6180034398a13' },
  // { index: 25, id: '609d21acb6b6180034398a8d' }, // duplicate with 23
  // { index: 26, id: '609ce77fb6b6180034398a13' }, // duplicate with 24
  { index: 27, id: '609e445bacf5ab00347d157f' },
  { index: 28, id: '609b9022803be7003434a0a0' },
  { index: 29, id: '609a75b92dced1003481985a' },
  { index: 30, id: '609a4e332dced100348197ba' },
  { index: 31, id: '609a90f12dced10034819908' },
  { index: 32, id: '609ba426803be7003434a103' },
  { index: 33, id: '609aaa682dced1003481996b' },
  { index: 34, id: '609ce8c3b6b6180034398a17' },
  { index: 35, id: '609bb7be803be7003434a131' },
  { index: 36, id: '609ce77fb6b6180034398a14' },
  { index: 37, id: '609d21acb6b6180034398a8b' },
  { index: 38, id: '609e445bacf5ab00347d157c' },
  { index: 39, id: '609b9022803be7003434a09f' },
  { index: 40, id: '609a75b92dced10034819858' }
].map((i) => ObjectId(i.id))

// Use connect method to connect to the server
client.connect(function (err) {
  assert.strictEqual(null, err)
  console.log(':>> Connected successfully to server')

  const db = client.db(DB_NAME)

  const collection = db.collection('actions')

  // collection.updateMany({ _id: { $in: ids } }, { $set: { isDone: true } }, function (err, result) {
  //   assert.strictEqual(err, null)
  //   assert.strictEqual(37, result.result.n)
  //   console.log(`:>>Update result :>> `, result)
  //   console.log('Update operations successfully')
  // })

  collection.find({ _id: { $in: ids } }).toArray(function (err, docs) {
    assert.strictEqual(err, null)
    assert.strictEqual(37, docs.length)
    console.log(`:>> Found docs :>>`, docs)
  })

  client.close()
})
