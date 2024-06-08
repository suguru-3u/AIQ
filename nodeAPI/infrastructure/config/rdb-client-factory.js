const mysql = require("mysql2/promise");

class RDBClientFactory {
  constructor() {
    this.dbConfig = {
      host: process.env.LOCAL_DB_HOST_NAME,
      user: process.env.LOCAL_USER_NAME,
      password: process.env.LOCAL_USER_PASSWORD,
      database: process.env.LOCAL_DATABASE_NAME,
      port: process.env.LOCAL_DB_PORT,
      charset: "utf8mb4",
    };
    this.rdbClient = null;
    console.log("RDBClientFactory.constructor initialized");
  }

  async openConnection() {
    try {
      this.rdbClient = await mysql.createConnection(this.dbConfig);
      console.log("Database connection opened successfully");
    } catch (error) {
      console.error("Error occurred while connecting to the database:", error);
      throw new Error("Database connection failed");
    }
  }

  async closeConnection() {
    if (this.rdbClient) {
      try {
        await this.rdbClient.end();
        console.log("Database connection closed successfully");
      } catch (error) {
        console.error(
          "Error occurred while closing the database connection:",
          error
        );
        throw new Error("Failed to close the database connection");
      } finally {
        this.rdbClient = null;
      }
    }
  }
}

module.exports = RDBClientFactory;
