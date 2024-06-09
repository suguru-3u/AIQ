const mysql = require("mysql2/promise");

class RDBClientFactory {
  constructor() {
    const {
      LOCAL_DB_HOST_NAME,
      LOCAL_USER_NAME,
      LOCAL_USER_PASSWORD,
      LOCAL_DATABASE_NAME,
      LOCAL_DB_PORT,
    } = process.env;
    if (
      !LOCAL_DB_HOST_NAME ||
      !LOCAL_USER_NAME ||
      !LOCAL_USER_PASSWORD ||
      !LOCAL_DATABASE_NAME ||
      !LOCAL_DB_PORT
    ) {
      throw new Error("環境変数が設定されていません");
    }
    this.dbConfig = {
      host: LOCAL_DB_HOST_NAME,
      user: LOCAL_USER_NAME,
      password: LOCAL_USER_PASSWORD,
      database: LOCAL_DATABASE_NAME,
      port: LOCAL_DB_PORT,
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
