import pg from 'pg'
const { Pool } = pg

import dotenv from 'dotenv'
dotenv.config()

const client = new Pool({
    user: process.env.PGUSER,
    host:  process.env.HOST,
    database:  process.env.PGDATABASE,
    password:  process.env.PGPASSWORD,
    port:  process.env.PGPORT
  })

export default {
    getUser: function(userId){
        console.log("getUser", userId);
        const text = 'SELECT FROM e_users WHERE name = $1'
        const values = [userId]
        client.query(text, values, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
              console.log(res.rows[0])
        
            }
          })
    },
    createNewUser: function(userId, date){
        let ajax = new XMLHttpRequest();
        ajax.open("SET", `./database/createUser?userId=${userId}&date=${date}`, true);

        ajax.send();
        
        ajax.onreadystatechange = function(){
            if(this.readyState = 4 && this.status === 200){
                return "success"
            }
        }
    },
    setUserData: function(userId, date){
        let ajax = new XMLHttpRequest();
        ajax.open("SET", `./database/setUserData?userId=${userId}&date=${date}`, true);

        ajax.send();
        
        ajax.onreadystatechange = function(){
            if(this.readyState = 4 && this.status === 200){
                return "success"
            }
        }
    }
}