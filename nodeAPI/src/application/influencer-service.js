const InfluencerDatasource = require("../infrastructure/datasource/influencer-datasource.js");
const NotInfluencerError = require("../error/not-influencer-error.js");
const kuromojin = require("kuromojin");

class InfluencerService {
  constructor() {
    console.log("InfluencerService initialized");
    this.influencerDatasource = new InfluencerDatasource();
  }

  async detail(id) {
    const result = await this.influencerDatasource.detail(id);
    if (result.length === 0) throw new NotInfluencerError(id);
    return result.pop();
  }

  async getTopInfluencersByMetric(query) {
    const res = await this.influencerDatasource.getTopInfluencersByMetric(query);
    return res.map((value, index) => ({
      No: index + 1,
      influencerId: value.influencer_id,
      [query.metric]: value.metric,
    }));
  }

  async getTopNouns(limit) {
    const results = await this.influencerDatasource.getTextData();
    const topNByIds = await this.extractNounsAndCount(results);
    const aggregatedData = this.calculateTopNouns(topNByIds);
    return this.formatTopNounsResult(aggregatedData, limit);
  }

  // 形態素解析を行い、名詞を抽出して集計
  async extractNounsAndCount(results) {
    const targetStrType = "名詞";
    const topNByIds = [];
    // kuromojin.tokenizeの箇所で約3秒程かかっている
    for (const result of results) {
      const { influencer_id, text } = result;
      const tokens = await kuromojin.tokenize(text);
      const nouns = tokens
        .filter((token) => token.pos === targetStrType)
        .reduce((acc, token) => {
          const key = token.surface_form;
          acc[key] = acc[key] ? acc[key] + 1 : 1;
          return acc;
        }, {});
      const topN = Object.entries(nouns).map(([word, count]) => ({
        word,
        count,
      }));
      topNByIds.push({ influencer_id, topN });
    }
    return topNByIds;
  }

  // influencer_id毎にtopNを集計する
  calculateTopNouns(topNByIds) {
    const aggregatedData = {};
    topNByIds.forEach((item) => {
      const influencerId = item.influencer_id;
      const topN = item.topN;
      if (!aggregatedData[influencerId]) {
        aggregatedData[influencerId] = {};
      }
      topN.forEach((wordData) => {
        const word = wordData.word;
        const count = wordData.count;
        if (!aggregatedData[influencerId][word]) {
          aggregatedData[influencerId][word] = count;
        } else {
          aggregatedData[influencerId][word] += count;
        }
      });
    });
    return aggregatedData;
  }

  formatTopNounsResult(aggregatedData, limit) {
    const result = Object.entries(aggregatedData).map(([influencerId, wordCounts]) => {
      const sortedWordCounts = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, parseInt(limit));
      const wordCount = sortedWordCounts.map(([word, count]) => ({
        [word]: count,
      }));
      return {
        influencer_id: influencerId,
        wordCount,
      };
    });
    return result;
  }
}

module.exports = InfluencerService;
