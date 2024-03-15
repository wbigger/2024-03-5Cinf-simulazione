const mysql = require("mysql2");
const dbConfig = require("../config/config");
// constructor
const Supplier = function (supplier) {
    this.id = supplier.id;
    this.name = supplier.name;
    this.description = supplier.description;
    this.price = supplier.price;
};
// connecting on each request so the server will start without a db connection, plus
//   a simple mechanism enabling the app to recover from a momentary missing db connection
Supplier.dbConnect = () => {
    const connection = mysql.createConnection({
        host: dbConfig.APP_DB_HOST,
        user: dbConfig.APP_DB_USER,
        password: dbConfig.APP_DB_PASSWORD,
        database: dbConfig.APP_DB_NAME
    });
    connection.connect(error => {
        if (error) {
            console.log("Error connecting to Db")
            throw error;
        }
        console.log("Successfully connected to the database.");
    });
    return connection;
}

Supplier.create = (newSupplier, result) => {
    const dbConn = Supplier.dbConnect();
    dbConn.query("INSERT INTO orders SET ?", newSupplier, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created supplier: ", {id: res.insertId, ...newSupplier});
        result(null, {id: res.insertId, ...newSupplier});
    });
};

Supplier.getAll = result => {
    const dbConn = Supplier.dbConnect();
    dbConn.query("SELECT * FROM orders", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Orders: ", res);
        result(null, res);
    });
};

Supplier.findById = (supplierId, result) => {
    const dbConn = Supplier.dbConnect();
    dbConn.query(`SELECT * FROM orders WHERE id = ${supplierId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found supplier: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

Supplier.updateById = (id, supplier, result) => {
    const dbConn = Supplier.dbConnect();
    dbConn.query(
        "UPDATE orders SET name = ?, price = ?, description = ? WHERE id = ?",
        [supplier.name, supplier.price, supplier.description, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                result({kind: "not_found"}, null);
                return;
            }
            console.log("updated supplier: ", {id: id, ...supplier});
            result(null, {id: id, ...supplier});
        }
    );
};

Supplier.delete = (id, result) => {
    const dbConn = Supplier.dbConnect();
    dbConn.query("DELETE FROM orders WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows === 0) {
            result({kind: "not_found"}, null);
            return;
        }
        console.log("deleted order with id: ", id);
        result(null, res);
    });
};

Supplier.removeAll = result => {
    const dbConn = Supplier.dbConnect();
    dbConn.query("DELETE FROM orders", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log(`deleted ${res.affectedRows} orders`);
        result(null, res);
    });
};

module.exports = Supplier;