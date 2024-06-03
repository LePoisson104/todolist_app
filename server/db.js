const mysql = require("mysql");
require("dotenv").config();
let instance = null;

const pool = mysql.createPool({
  host: process.env.HOSTNAME,
  database: process.env.DATABASENAME,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
});

pool.getConnection((err) => {
  if (err) throw err;
  console.log("database conneced successfully!");
});

class dbService {
  static getDbServiceInstance() {
    //if not null create new instance
    return instance ? instance : new dbService();
  }

  async getUserInfo(userEmail) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM todos WHERE user_email = ?";
        pool.query(query, [userEmail], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async postNewTask(id, user_email, title, progress, date) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO todos (id, user_email, title, progress, date) VALUES (?,?,?,?,?)";
        pool.query(
          query,
          [id, user_email, title, progress, date],
          (err, results) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(results);
            }
          }
        );
      });
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  async updateTask(id, user_email, title, progress, date) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE todos SET user_email = ?, title = ?, progress = ?, date = ? WHERE id = ?";
        pool.query(
          query,
          [user_email, title, progress, date, id],
          (err, results) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(results);
            }
          }
        );
      });
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  async deleteTask(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM todos WHERE id = ?";
        pool.query(query, [id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  async signUp(email, hashedPassword) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO users (email, hashed_password) VALUES (?, ?)";
        pool.query(query, [email, hashedPassword], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async logIn(email) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";
        pool.query(query, [email], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      return response;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = dbService;
