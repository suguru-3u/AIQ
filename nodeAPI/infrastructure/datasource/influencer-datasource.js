/**
 * 献立メニューのDB関連を記述しています
 */

const RDBClientFactory = require("../config/rdb-client-factory.js");

class InfluencerDatasource {
  #rdbClientFactory;

  constructor() {
    console.log("InfluencerDatasource initialized");
    this.#rdbClientFactory = new RDBClientFactory();
  }

  async detail(id) {
    try {
      await this.#rdbClientFactory.openConnection();
      // TODO:小数点の扱いについて、記述がなかったため確認が必要
      const selectInfluencerQuery = `
        SELECT influencer_id, AVG(likes) AS likes, AVG(comments) AS comments
        FROM posts
        WHERE influencer_id = ?
        GROUP BY influencer_id;
      `;
      const [results] = await this.#rdbClientFactory.rdbClient.query(
        selectInfluencerQuery,
        [id]
      );
      console.log("データの取得が完了しました");
      return results;
    } catch (error) {
      console.error("エラーが発生しました:", error);
      throw new Error("データ取得中にエラーが発生しました");
    } finally {
      await this.#rdbClientFactory.closeConnection();
    }
  }
}

module.exports = InfluencerDatasource;
