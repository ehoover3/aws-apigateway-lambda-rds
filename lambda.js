const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

exports.getHandler = async (event) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM my_table");
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    return errorResponse(error);
  } finally {
    if (connection) connection.end();
  }
};

exports.postHandler = async (event) => {
  let connection;
  try {
    const body = JSON.parse(event.body);
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute("INSERT INTO my_table (name, value) VALUES (?, ?)", [body.name, body.value]);
    return {
      statusCode: 201,
      body: JSON.stringify({ id: result.insertId }),
    };
  } catch (error) {
    return errorResponse(error);
  } finally {
    if (connection) connection.end();
  }
};

exports.putHandler = async (event) => {
  let connection;
  try {
    const body = JSON.parse(event.body);
    connection = await mysql.createConnection(dbConfig);
    await connection.execute("UPDATE my_table SET value = ? WHERE id = ?", [body.value, body.id]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Record updated" }),
    };
  } catch (error) {
    return errorResponse(error);
  } finally {
    if (connection) connection.end();
  }
};

exports.deleteHandler = async (event) => {
  let connection;
  try {
    const { id } = JSON.parse(event.body);
    connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM my_table WHERE id = ?", [id]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Record deleted" }),
    };
  } catch (error) {
    return errorResponse(error);
  } finally {
    if (connection) connection.end();
  }
};

const errorResponse = (error) => {
  console.error(error);
  return {
    statusCode: 500,
    body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
  };
};
