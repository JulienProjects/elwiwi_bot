import pg from 'pg'
const { Client } = pg

import dotenv from 'dotenv'
dotenv.config()

const client = new Client({
    user: process.env.PGUSER,
    host:  process.env.HOST,
    database:  process.env.PGDATABASE,
    password:  process.env.PGPASSWORD,
    port:  process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false
    }
  })

  client.connect()

export default {
    getUser: function(userId){
        return new Promise((resolve) => {
            
            console.log("getUser", userId);
            const text = 'SELECT * FROM e_users WHERE name = $1'
            const values = [userId]
            client.query(text, values, (err, res) => {
                if (err) {
                  console.log(err.stack)
                } else {
                    console.log(res.rows[0]);
                  resolve(res.rows[0]);
                }
              })
        })
        
    },
    createNewUser: function(userId, date){
        return new Promise((resolve) => {
            console.log("createNewUser", userId);
            const text = 'INSERT INTO e_users (name, last_praise, streak) values ($1, $2, 1)'
            const values = [userId, date]
            client.query(text, values, (err, res) => {
                if (err) {
                  console.log(err.stack)
                } else {
                    resolve("success");
            
                }
              })
        })
       
    },
    setUserData: function(userId, date, streak){
        return new Promise((resolve) => {
            console.log("setUserData", userId);
            const text = 'UPDATE e_users SET last_praise = $2, streak = $3 WHERE name = $1'
            const values = [userId, date, streak]
            client.query(text, values, (err, res) => {
                if (err) {
                  console.log(err.stack)
                } else {
                    resolve("success");
            
                }
              })
        })
    }
}