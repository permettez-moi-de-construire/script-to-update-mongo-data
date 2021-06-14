const { Pool } = require('pg')
const MongoClient = require('mongodb').MongoClient
const hubspot = require('@hubspot/api-client')

require('dotenv').config()

// DB MONGO
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_NAME = process.env.DB_NAME
const DB_PORT = process.env.DB_PORT
const API_KEY = process.env.API_KEY

// DB POSTGRES
const DB_PORT_POSTGRES = process.env.DB_PORT_POSTGRES
const DB_HOST_POSTGRES = process.env.DB_HOST_POSTGRES
const DB_USER_POSTGRES = process.env.DB_USER_POSTGRES
const DB_PASS_POSTGRES = process.env.DB_PASS_POSTGRES
const DB_NAME_POSTGRES = process.env.DB_NAME_POSTGRES

// Connection URL
const url =`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`


exports.mongoConnect = async () => {
    return new Promise((resolve, _) => {
        const client = new MongoClient(url, { useUnifiedTopology: true })
        client.connect(function (err) {
            const db = client.db(DB_NAME)
            const actions = db.collection('actions')

            console.log('MONGO', {
                DB_USER, 
                DB_PASS, 
                DB_HOST, 
                DB_PORT, 
                DB_NAME
            });

            resolve({
                actions,
                mongo: client
            })
        })
    })
}


exports.hubspotClient = () => {
    return new hubspot.Client({ apiKey: API_KEY })
}

exports.postgresPool = () => {
    const pool = new Pool({
        user: DB_USER_POSTGRES,
        host: DB_HOST_POSTGRES,
        database: DB_NAME_POSTGRES,
        password: DB_PASS_POSTGRES,
        port: DB_PORT_POSTGRES,
      })

    console.log('POSTGRES', {
        DB_USER_POSTGRES,
        DB_HOST_POSTGRES,
        DB_NAME_POSTGRES,
        DB_PASS_POSTGRES,
        DB_PORT_POSTGRES
    });
    
    return pool
}

