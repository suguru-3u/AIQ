/**
 * このファイルはフォルダ内のCSVデータをRDBに保存する機能が書かれています。
 */

const fs = require("fs");
const { parse } = require("csv-parse");
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.LOCAL_DB_HOST_NAME,
  user: process.env.LOCAL_USER_NAME,
  password: process.env.LOCAL_USER_PASSWORD,
  database: process.env.LOCAL_DATABASE_NAME,
  port: process.env.LOCAL_DB_PORT,
  charset: "utf8mb4",
};

async function main() {
  try {
    const inputCsvData = await readCSV();
    const dbConnection = await mysql.createConnection(dbConfig);
    console.log("データベースに接続しました");

    // NOTE: APIでlikes,comments,bodyを使用しているため、重複があった際に更新している。
    const insertIntoPostQuery =
      "INSERT INTO posts (influencer_id, post_id, shortcode, likes, comments, thumbnail, body, post_date) VALUES ? ON DUPLICATE KEY UPDATE likes = VALUES(likes), comments = VALUES(comments), body = VALUES(body);";
    await dbConnection.beginTransaction();
    await dbConnection.query(insertIntoPostQuery, [inputCsvData]);
    await dbConnection.commit();
    console.log("データベースへの登録が完了しました");

    dbConnection.end();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

async function readCSV() {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(
      "./t_influencer_posts_202401121334.csv"
    );
    const parseStream = parse();
    const aggregationCsvData = [];

    readStream
      .on("error", (err) => {
        parseStream.end();
        console.log("ファイルの読み込みエラー:", err);
      })
      .pipe(parseStream)
      .on("readable", () => {
        const postNum = 0;
        const influencerNum = 1;
        const likeNum = 3;
        const commentNum = 4;
        const parseNum = 10;
        let readCsvData;
        console.log("CSV読み込み処理開始");
        while ((readCsvData = parseStream.read()) !== null) {
          const convertCsvData = readCsvData.map((value, index) => {
            if (
              index === postNum ||
              index === influencerNum ||
              index === likeNum ||
              index === commentNum
            )
              return parseInt(value, parseNum);
            return value;
          });
          aggregationCsvData.push(convertCsvData);
        }
        aggregationCsvData.shift();
        console.log("CSV読み込み処理終了");
      })
      .on("error", (err) => {
        readStream.destroy();
        console.error("CSVパース処理でエラー検知:", err);
        reject(err);
      })
      .on("end", () => {
        resolve(aggregationCsvData);
      });
  });
}

main();
