const Router = require("express");
const { param, validationResult } = require("express-validator");
const InfluencerService = require("../application/influencer-service.js");

const influencerRouter = Router();
const influencerService = new InfluencerService();

const ERROR_MESSAGES = {
  validationError: "バリデーションエラー",
  processingError: "インフルエンサー情報取得処理に失敗しました",
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.errors.map((value) => {
      return value.msg;
    });
    return res.status(400).json({ message: errorMessages });
  }
  next();
};

influencerRouter.get(
  "/influencers/:id",
  param("id")
    .isNumeric()
    .withMessage("influencer id が正しく設定されていません"),
  validateRequest,
  async (req, res) => {
    try {
      console.log("リクエストパラメーター：", req.params.id);
      const result = await influencerService.detail(
        parseInt(req.params.id, 10)
      );
      res.status(200).json({ influencer: result });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: ERROR_MESSAGES.processingError });
    }
  }
);

module.exports = influencerRouter;