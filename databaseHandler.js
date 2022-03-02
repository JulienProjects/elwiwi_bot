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
      getAll:function(userId){
        return new Promise((resolve) => {
            console.log("getAll");
            const text = 'SELECT * FROM e_users'
            client.query(text, [], (err, res) => {
                if (err) {
                  console.log(err.stack)
                } else {
                  resolve(res.rows);
                }
              })
        })
    },
    getUser: function(userId){
        return new Promise((resolve) => {
            
            console.log("getUser", userId);
            const text = 'SELECT * FROM e_users WHERE name = $1'
            const values = [userId]
            client.query(text, values, (err, res) => {
                if (err) {
                  console.log(err.stack)
                } else {
                  resolve(res.rows[0]);
                }
              })
        })
        
    },
    createNewUser: function(userId, userName, date){
        return new Promise((resolve) => {
            console.log("createNewUser", userId);
            const text = 'INSERT INTO e_users (name, userName, last_praise, streak) values ($1, $2, $3, 1)'
            const values = [userId, userName, date]
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