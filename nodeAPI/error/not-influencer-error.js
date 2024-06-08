class NotInfluencerError extends Error {
  constructor(id) {
    super(`Influencer ID [${id}] not found`);
    this.name = "NotInfluencerError";
  }
}

module.exports = NotInfluencerError;
