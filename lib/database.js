
var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'app',
    password: 'BamBoozale',
    database: 'cms'
});

db.connect();

export default async function query({ query, values }) {
    return new Promise((resolve, reject) => {
        db.query(query, values, function (error, results, fields) {
            if (error) {
                console.error(error.sqlMessage);
                return reject(new Error(error));
            }else{
                resolve(results);
            }
        });
    });
}