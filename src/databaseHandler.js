import pg from 'pg'
const { Pool } = pg

import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.HOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false
    }
})


export default {
    getTopTen: function () {
        return new Promise((resolve) => {
            console.log("getTopTen");
            const text = 'SELECT * FROM e_users ORDER BY streak DESC LIMIT 10'
            pool.connect((err, client, done) => {
                if (err) throw err
                client.query(text, [], (err, res) => {
                    done();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        resolve(res.rows);
                    }
                })
            })
        })
    },
    getAll: function () {
        return new Promise((resolve) => {
            console.log("getAll");
            const text = 'SELECT * FROM e_users ORDER BY streak DESC'
            pool.connect((err, client, done) => {
                if (err) throw err
                client.query(text, [], (err, res) => {
                    done();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        resolve(res.rows);
                    }
                })
            })
        })
    },
    getUser: function (userId) {
        return new Promise((resolve) => {
            console.log("getUser", userId);
            const text = 'SELECT * FROM e_users WHERE name = $1'
            const values = [userId]
            pool.connect((err, client, done) => {
                if (err) throw err
                client.query(text, values, (err, res) => {
                    done();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        resolve(res.rows[0]);
                    }
                })
            })
        })
    },
    createNewUser: function (userId, userName, date) {
        return new Promise((resolve) => {
            console.log("createNewUser", userId);
            const text = 'INSERT INTO e_users (name, userName, last_praise, streak) values ($1, $2, $3, 1)'
            const values = [userId, userName, date]
            pool.connect((err, client, done) => {
                if (err) throw err
                client.query(text, values, (err, res) => {
                    done();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        resolve("success");

                    }
                })
            })
        })
    },
    setUserData: function (userId, date, streak) {
        return new Promise((resolve) => {
            console.log("setUserData", userId);
            const text = 'UPDATE e_users SET last_praise = $2, streak = $3 WHERE name = $1'
            const values = [userId, date, streak]
            pool.connect((err, client, done) => {
                if (err) throw err
                client.query(text, values, (err, res) => {
                    done();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        resolve("success");
                    }
                })
            })
        })
    }
}