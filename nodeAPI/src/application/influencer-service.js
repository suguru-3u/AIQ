const InfluencerDatasource = require("../infrastructure/datasource/influencer-datasource.js");
const NotInfluencerError = require("../error/not-influencer-error.js");
const kuromojin = require("kuromojin");

class InfluencerService {
  constructor() {
    console.log("InfluencerService initialized");
    this.influencerDatasource = new InfluencerDatasource();
  }

  /**
   * @param {String} id - インフルエンサid
   * @return {object} - インフルエンサid,平均いいね数,平均コメント数のオブジェクトが格納されている
   */
  async detail(id) {
    const result = await this.influencerDatasource.detail(id);
    if (result.length === 0) throw new NotInfluencerError(id);
    return result.pop();
  }

  /**
   * @param {object} query - query配下、metricにはlikes or comments,limitには表示したい上位人数が表示される
   * @return {[object]} - 上位番号,インフルエンサid,平均いいね数 or 平均コメント数のオブジェクト配列が格納されている
   */
  async getTopInfluencersByMetric(query) {
    const res = await this.influencerDatasource.getTopInfluencersByMetric(query);
    return res.map((value, index) => ({
      No: index + 1,
      influencerId: value.influencerId,
      [query.metric]: value.metric,
    }));
  }

  /**
   * @param {String} limit - 表示したい上位名詞
   * @return {[object]} - インフルエンサid,投稿した名詞と数が格納されている
   */
  async getTopNouns(limit) {
    const dbResults = await this.influencerDatasource.getTextData();
    const extractResults = await this.extractNounsAndCount(dbResults);
    const aggregatedResults = this.calculateTopNouns(extractResults);
    return this.formatTopNounsResult(aggregatedResults, limit);
  }

  /**
   * 形態素解析を行い、名詞を抽出して集計
   * @param {[object]} dbResults - dbから取得したインフルエンサid,投稿した本文
   * @return {[object]} - 形態素解析を行い、名詞を抽出して集計したものが格納されている
   */
  async extractNounsAndCount(dbResults) {
    const targetStrType = "名詞";
    const extractResults = [];
    // OPTIMIZE: kuromojin.tokenizeの箇所で約3秒程かかっている
    for (const result of dbResults) {
      const { influencerId, text } = result;
      const tokens = await kuromojin.tokenize(text);
      const nouns = tokens
        .filter((token) => token.pos === targetStrType)
        .reduce((acc, token) => {
          const key = token.surface_form;
          acc[key] = acc[key] ? acc[key] + 1 : 1;
          return acc;
        }, {});
      const wordInfos = Object.entries(nouns).map(([word, count]) => ({
        word,
        count,
      }));
      extractResults.push({ influencerId, wordInfos });
    }
    return extractResults;
  }

  /**
   * influencerId毎に名詞を集計する
   * @param {[object]} extractResults - 形態素解析を行い、名詞を抽出して集計したもの
   * @return {[object]} - influencerId毎に名詞を集計したものが格納されている
   */
  calculateTopNouns(extractResults) {
    const aggregatedResults = {};
    extractResults.forEach((item) => {
      const influencerId = item.influencerId;
      const wordInfos = item.wordInfos;
      if (!aggregatedResults[influencerId]) {
        aggregatedResults[influencerId] = {};
      }
      wordInfos.forEach((wordData) => {
        const word = wordData.word;
        const count = wordData.count;
        if (!aggregatedResults[influencerId][word]) {
          aggregatedResults[influencerId][word] = count;
        } else {
          aggregatedResults[influencerId][word] += count;
        }
      });
    });
    return aggregatedResults;
  }

  /**
   *
   * @param {[object]} aggregatedResults - influencerId毎に名詞を集計したもの
   * @param {*} limit - 表示させたい名詞の上位数字
   * @returns - influencerId毎に名詞を集計したものをフォーマットしたもの
   */
  formatTopNounsResult(aggregatedResults, limit) {
    const result = Object.entries(aggregatedResults).map(([influencerId, wordCounts]) => {
      const sortedWordCounts = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, parseInt(limit));
      const wordCount = sortedWordCounts.map(([word, count]) => ({
        [word]: count,
      }));
      return {
        influencerId,
        wordCount,
      };
    });
    return result;
  }
}

module.exports = InfluencerService;
