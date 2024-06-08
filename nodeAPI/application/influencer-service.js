const InfluencerDatasource = require("../infrastructure/datasource/influencer-datasource.js");
const NotInfluencerError = require("../error/not-influencer-error.js");

class InfluencerService {
  #dataNotIndexNum = 0;

  influencerDatasource;

  constructor() {
    console.log("InfluencerService initialized");
    this.influencerDatasource = new InfluencerDatasource();
  }

  async detail(id) {
    const result = await this.influencerDatasource.detail(id);
    if (result.length === this.#dataNotIndexNum)
      throw new NotInfluencerError(id);
    return result.pop();
  }
}

module.exports = InfluencerService;
