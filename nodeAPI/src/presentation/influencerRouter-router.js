const Router = require("express");
const { param, validationResult, query } = require("express-validator");
const InfluencerService = require("../application/influencer-service.js");

const influencerRouter = Router();
const influencerService = new InfluencerService();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.errors.map((value) => {
      return value.msg;
    });
    const errorInfo = {
      developerMessage: errorMessages,
      userMessage: "リクエスト内容が正しくありませんでした",
    };
    return res.status(400).json({ errors: errorInfo });
  }
  next();
};

/**
 * インフルエンサidから平均いいね数、平均コメント数を JSON 形式で返却
 */
influencerRouter.get(
  "/influencers/:id",
  param("id").isNumeric().withMessage("influencerIdが正しくリクエストされていません"),
  validateRequest,
  async (req, res) => {
    try {
      console.log("リクエストパラメーター：", req.params.id);
      const result = await influencerService.detail(parseInt(req.params.id, 10));
      res.status(200).json({ influencer: result });
    } catch (err) {
      console.log(err);
      const errorStatus = err.name === "NotInfluencerError" ? 400 : 500;
      const userErroMessage =
        err.name === "NotInfluencerError"
          ? `インフルエンサーID「${req.params.id}」は存在しませんでした`
          : `インフルエンサーID「${req.params.id}」の情報取得処理に失敗しました`;
      const errorInfo = {
        developerMessage: [err.message],
        userMessage: userErroMessage,
      };
      res.status(errorStatus).json({ errors: errorInfo });
    }
  },
);

/**
 * 平均いいね数 or 平均コメント数(metric に設定した項目)が多いインフルエンサー上位N件(limit 設定した数)をJSON形式で返却
 */
influencerRouter.get(
  "/influencers-top",
  query("metric")
    .notEmpty()
    .withMessage("metricがリクエストされていません")
    .isIn(["likes", "comments"])
    .withMessage("metricが正しくリクエストされていません"),
  query("limit")
    .notEmpty()
    .withMessage("limitがリクエストされていません")
    .isNumeric()
    .withMessage("limitが正しくリクエストされていません"),
  validateRequest,
  async (req, res) => {
    try {
      console.log("リクエストクエリ：", req.query);
      const result = await influencerService.getTopInfluencersByMetric(req.query);
      res.status(200).json({ influencers: result });
    } catch (err) {
      console.log(err);
      const querryKind = req.query.metric === "likes" ? "いいね数" : "コメント数";
      const errorInfo = {
        developerMessage: [err.message],
        userMessage: `上位「${req.query.limit}」人の「${querryKind}」の情報取得処理に失敗しました`,
      };
      res.status(500).json({ errors: errorInfo });
    }
  },
);

/**
 * インフルエンサid毎に、投稿したデータから名詞を抽出して使用回数を集計し、上位N件(limit 設定した数)JSON 形式で返却
 */
influencerRouter.get(
  "/influencers/analysis/top-nouns",
  query("limit")
    .notEmpty()
    .withMessage("limitがリクエストされていません")
    .isNumeric()
    .withMessage("limitが正しくリクエストされていません"),
  validateRequest,
  async (req, res) => {
    try {
      console.log("リクエストパラメーター：", req.query);
      const result = await influencerService.getTopNouns(parseInt(req.query.limit, 10));
      res.status(200).json({ influencers: result });
    } catch (err) {
      console.log(err);
      const errorInfo = {
        developerMessage: [err.message],
        userMessage: `投稿データの名詞数「${req.query.limit}」の情報取得処理に失敗しました`,
      };
      res.status(500).json({ errors: errorInfo });
    }
  },
);

module.exports = influencerRouter;
