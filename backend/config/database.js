import mysql from "mysql";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "test_auth_database_2"
});

db.connect((error) => {
    if (!error) {
        console.log("Connected successfully to DB");
    }
    else {
        console.log("Error connecting: " + error.message);
    }
});

export default db;