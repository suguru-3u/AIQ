const InfluencerDatasource = require("../infrastructure/datasource/influencer-datasource.js");
const NotInfluencerError = require("../error/not-influencer-error.js");

class InfluencerService {
  influencerDatasource;

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
    const res = await this.influencerDatasource.getTopInfluencersByMetric(
      query
    );
    const newArray = res.map((value, index) => {
      return {
        No: index + 1,
        influencerId: value.influencer_id,
        [query.metric]: value.metric,
      };
    });
    return newArray;
  }
}

module.exports = InfluencerService;
