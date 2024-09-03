const pool = require('../database/connection');

const createTable = (model) => {
    return new Promise((resolve, reject) => {
        pool.query(model, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const checkIfRecordExist = (table, column, value) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${table} WHERE ${column} = $1 LIMIT 1`;
        pool.query(query, [value], (err, results) => {
            if (err) {
                reject(err)
            } else {
                console.log(results)
                resolve(results.rows.length ? results.rows[0] : null)
            }
        });
    });
}

const checkIfDatabaseExists = (dbName) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT datname FROM pg_database WHERE lower(datname) = lower($1)`;
        if(dbName === 'transport_db'){
            pool.query(query, [dbName], (err, results) => {
                if(err){
                    reject(err)
                }else{  
                    //console.log(results); 
                    if(results.rows[0]){
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                }
            })
        }else{
            console.log('wrong database')
        }      
    });
}

const insertData = (tableName, data) => {
    return new Promise((resolve, reject) => {
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;

        pool.query(query, values, (err, results) => {
            if (err) {
                reject(err)
            } else {
                console.log(results)
                resolve(results);
            }
        });
    });
}

const getAll = (tableName, columns) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tableName}`;
        pool.query(query, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    });
}

module.exports = {
    createTable,
    checkIfDatabaseExists,
    checkIfRecordExist,
    insertData,
    getAll
}

