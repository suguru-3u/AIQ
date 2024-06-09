const request = require("supertest");
const cookMenuRouter = require("../../presentation/influencerRouter-router.js");
const InfluencerService = require("../../application/influencer-service.js");

// jest.mock()を使用してInfluencerServiceモジュールをモック化する
jest.mock("../../application/influencer-service.js", () => {
  const mock = jest.fn();
  return jest.fn().mockImplementation(() => {
    return {
      detail: mock,
      getTopInfluencersByMetric: mock,
      getTopNouns: mock,
    };
  });
});

describe("GET /influencers/:id", () => {
  test("正常系: パスパラメータが数値", async () => {
    const influencerData = {
      influencer_id: 2,
      likes: "551.7500",
      comments: "10.5000",
    };
    const responceData = {
      influencer: influencerData,
    };
    InfluencerService().detail.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers/0");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("正常系: パスパラメータが数値", async () => {
    const influencerData = {
      influencer_id: 2,
      likes: "551.7500",
      comments: "10.5000",
    };
    const responceData = {
      influencer: influencerData,
    };
    InfluencerService().detail.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("正常系: パスパラメータが数値", async () => {
    const influencerData = {
      influencer_id: 2,
      likes: "551.7500",
      comments: "10.5000",
    };
    const responceData = {
      influencer: influencerData,
    };
    InfluencerService().getTopInfluencersByMetric.mockResolvedValueOnce(
      influencerData
    );
    const response = await request(cookMenuRouter).get("/influencers/100");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("異常系: パスパラメータが数値", async () => {
    const message = { message: "インフルエンサー情報取得処理に失敗しました" };
    InfluencerService().detail.mockRejectedValue(
      new Error("ユニットテスト用エラー")
    );
    const response = await request(cookMenuRouter).get("/influencers/1");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(message);
  });
  test("異常系 validation check: パスパラメータが文字列", async () => {
    const message = {
      message: ["influencer id が正しくリクエストされていません"],
    };
    const response = await request(cookMenuRouter).get("/influencers/a");
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系 validation check:  パスパラメータが文字と数値が混同", async () => {
    const message = {
      message: ["influencer id が正しくリクエストされていません"],
    };
    const response = await request(cookMenuRouter).get("/influencers/12ubva6");
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系 validation check: パスパラメータがない", async () => {
    const response = await request(cookMenuRouter).get("/influencers/");
    expect(response.status).toBe(404);
  });
});

describe("GET /top?metric=&limit=", () => {
  test("正常系", async () => {
    const influencerData = {
      No: 1,
      likes: "551.7500",
      comments: "10.5000",
    };
    const responceData = {
      influencers: influencerData,
    };
    InfluencerService().getTopInfluencersByMetric.mockResolvedValueOnce(
      influencerData
    );
    const response = await request(cookMenuRouter).get(
      "/top?metric=likes&limit=1"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("正常系: limitが0", async () => {
    const influencerData = {};
    const responceData = { influencers: influencerData };
    InfluencerService().getTopInfluencersByMetric.mockResolvedValueOnce(
      influencerData
    );
    const response = await request(cookMenuRouter).get(
      "/top?metric=likes&limit=0"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("異常系: getTopInfluencersByMetricが異常終了", async () => {
    const message = { message: "処理に失敗しました" };
    InfluencerService().getTopInfluencersByMetric.mockRejectedValue(
      new Error("ユニットテスト用エラー")
    );
    const response = await request(cookMenuRouter).get(
      "/top?metric=likes&limit=1"
    );
    expect(response.status).toBe(500);
    expect(response.body).toEqual(message);
  });
  test("異常系: metricがlikes or commentsじゃない", async () => {
    const message = { message: ["metricが正しくありません"] };
    const response = await request(cookMenuRouter).get(
      "/top?metric=likess&limit=1"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系: metricがリクエストされない", async () => {
    const message = { message: ["metricが正しくありません"] };
    const response = await request(cookMenuRouter).get("/top?limit=1");
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系: limitが文字", async () => {
    const message = { message: ["limitが正しくリクエストされていません"] };
    const response = await request(cookMenuRouter).get(
      "/top?metric=likes&limit=a"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系: limitが文字と数値", async () => {
    const message = { message: ["limitが正しくリクエストされていません"] };
    const response = await request(cookMenuRouter).get(
      "/top?metric=likes&limit=a2837wbu"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系: limitがリクエストされない", async () => {
    const message = { message: ["limitがリクエストされていません"] };
    const response = await request(cookMenuRouter).get("/top?metric=like");
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
});

describe("GET /influencers/analysis/top-nouns?limit=", () => {
  test("正常系", async () => {
    const influencerData = [{ influencer_id: "2", wordCount: [{ "#": 56 }] }];
    const responceData = {
      influencers: influencerData,
    };
    InfluencerService().getTopNouns.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get(
      "/influencers/analysis/top-nouns?limit=1"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("正常系: limitが0", async () => {
    const influencerData = [{ influencer_id: "2", wordCount: [] }];
    const responceData = { influencers: influencerData };
    InfluencerService().getTopNouns.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get(
      "/influencers/analysis/top-nouns?limit=0"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("異常系: getTopNounsが異常終了", async () => {
    const message = { message: "処理に失敗しました" };
    InfluencerService().getTopNouns.mockRejectedValue(
      new Error("ユニットテスト用エラー")
    );
    const response = await request(cookMenuRouter).get(
      "/influencers/analysis/top-nouns?limit=1"
    );
    expect(response.status).toBe(500);
    expect(response.body).toEqual(message);
  });
  test("異常系: limitが文字", async () => {
    const message = { message: ["limitが正しくリクエストされていません"] };
    const response = await request(cookMenuRouter).get(
      "/influencers/analysis/top-nouns?limit=a"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系: limitが文字と数値", async () => {
    const message = { message: ["limitが正しくリクエストされていません"] };
    const response = await request(cookMenuRouter).get(
      "/influencers/analysis/top-nouns?limit=29837bbwyiu"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系: limitがリクエストされない", async () => {
    const message = { message: ["limitがリクエストされていません"] };
    const response = await request(cookMenuRouter).get(
      "/influencers/analysis/top-nouns"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
});
