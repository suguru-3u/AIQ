const RDBClientFactory = require("../config/rdb-client-factory.js");

class InfluencerDatasource {
  #rdbClientFactory;

  constructor() {
    console.log("InfluencerDatasource initialized");
    this.#rdbClientFactory = new RDBClientFactory();
  }

  /**
   * @param {String} id - 取得したいインフルエンサid
   * @return {[object]} - インフルエンサid,平均いいね数,平均コメント数のオブジェクト配列が格納されている
   */
  async detail(id) {
    try {
      await this.#rdbClientFactory.openConnection();
      // TODO:小数点の扱いについて要件の確認が必要
      const selectInfluencerQuery = `
        SELECT influencer_id AS influencerId, AVG(likes) AS likes, AVG(comments) AS comments
        FROM posts
        WHERE influencer_id = ?
        GROUP BY influencer_id;
      `;
      const [results] = await this.#rdbClientFactory.rdbClient.query(selectInfluencerQuery, [id]);
      console.log("データの取得が完了しました");
      return results;
    } catch (error) {
      console.error("エラーが発生しました:", error);
      throw new Error("データ取得中にエラーが発生しました");
    } finally {
      await this.#rdbClientFactory.closeConnection();
    }
  }

  /**
   * @param {object} query - query配下、metricにはlikes or comments,limitには表示したい上位人数が表示される
   * @return {[object]} - インフルエンサid,平均いいね数 or 平均コメント数のオブジェクト配列が格納されている
   */
  async getTopInfluencersByMetric(query) {
    try {
      await this.#rdbClientFactory.openConnection();
      // TODO:小数点の扱いについて要件の確認が必要
      const insertIntoPostQuery = `
        SELECT influencer_id AS influencerId, AVG(??) AS metric
        FROM posts
        GROUP BY INFLUENCER_ID
        ORDER BY metric desc limit ?;
      `;
      const [results] = await this.#rdbClientFactory.rdbClient.query(insertIntoPostQuery, [
        query.metric,
        parseInt(query.limit, 10),
      ]);
      console.log("データの取得が完了しました");

      return results;
    } catch (error) {
      console.error("エラーが発生しました:", error);
      throw new Error("データ取得中にエラーが発生しました");
    } finally {
      await this.#rdbClientFactory.closeConnection();
    }
  }

  /**
   * @return {[object]} - インフルエンサidと投稿した本文が降順に格納されている
   */
  async getTextData() {
    try {
      await this.#rdbClientFactory.openConnection();
      const getTextQuery = `
        SELECT influencer_id AS influencerId, body AS text
        FROM posts
        ORDER BY INFLUENCER_ID;`;
      const [results] = await this.#rdbClientFactory.rdbClient.query(getTextQuery);
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
