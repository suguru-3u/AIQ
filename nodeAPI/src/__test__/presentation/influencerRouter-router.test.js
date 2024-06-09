const request = require("supertest");
const cookMenuRouter = require("../../presentation/influencerRouter-router.js");
const InfluencerService = require("../../application/influencer-service.js");
const NotInfluencerError = require("../../error/not-influencer-error.js");

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
  test("正常系: パスパラメータが0", async () => {
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
  test("正常系: パスパラメータが1", async () => {
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
  test("正常系: パスパラメータが100", async () => {
    const influencerData = {
      influencer_id: 2,
      likes: "551.7500",
      comments: "10.5000",
    };
    const responceData = {
      influencer: influencerData,
    };
    InfluencerService().getTopInfluencersByMetric.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers/100");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("異常系: インフルエンサーが存在しなかった", async () => {
    const message = ["Influencer ID [1] not found"];
    InfluencerService().detail.mockRejectedValue(new NotInfluencerError(1));
    const response = await request(cookMenuRouter).get("/influencers/1");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: detailが異常終了", async () => {
    const message = ["ユニットテスト用エラー"];
    InfluencerService().detail.mockRejectedValue(new Error("ユニットテスト用エラー"));
    const response = await request(cookMenuRouter).get("/influencers/1");
    expect(response.status).toBe(500);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: パスパラメータが文字列", async () => {
    const message = ["influencerIdが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get("/influencers/a");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: パスパラメータが文字と数値が混同", async () => {
    const message = ["influencerIdが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get("/influencers/12ubva6");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: パスパラメータがない", async () => {
    const response = await request(cookMenuRouter).get("/influencers/");
    expect(response.status).toBe(404);
  });
});

describe("GET /influencers/top?metric=&limit=", () => {
  test("正常系: limitが0", async () => {
    const influencerData = {};
    const responceData = { influencers: influencerData };
    InfluencerService().getTopInfluencersByMetric.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers-top?metric=likes&limit=0");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("正常系: limitが1", async () => {
    const influencerData = {
      No: 1,
      likes: "551.7500",
      comments: "10.5000",
    };
    const responceData = {
      influencers: influencerData,
    };
    InfluencerService().getTopInfluencersByMetric.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers-top?metric=likes&limit=1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("正常系: limitが100", async () => {
    const influencerData = {};
    const responceData = { influencers: influencerData };
    InfluencerService().getTopInfluencersByMetric.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers-top?metric=likes&limit=100");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("異常系: getTopInfluencersByMetricが異常終了", async () => {
    const message = ["ユニットテスト用エラー"];
    InfluencerService().getTopInfluencersByMetric.mockRejectedValue(
      new Error("ユニットテスト用エラー"),
    );
    const response = await request(cookMenuRouter).get("/influencers-top?metric=likes&limit=1");
    expect(response.status).toBe(500);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: getTopInfluencersByMetricが異常終了", async () => {
    const message = ["ユニットテスト用エラー"];
    InfluencerService().getTopInfluencersByMetric.mockRejectedValue(
      new Error("ユニットテスト用エラー"),
    );
    const response = await request(cookMenuRouter).get("/influencers-top?metric=comments&limit=1");
    expect(response.status).toBe(500);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: metricがlikes or commentsじゃない", async () => {
    const message = ["metricが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get("/influencers-top?metric=likess&limit=1");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: metricがリクエストされない", async () => {
    const message = ["metricがリクエストされていません", "metricが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get("/influencers-top?limit=1");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: limitが文字", async () => {
    const message = ["limitが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get("/influencers-top?metric=likes&limit=a");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: limitが文字と数値", async () => {
    const message = ["limitが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get(
      "/influencers-top?metric=likes&limit=a2837wbu",
    );
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: limitがリクエストされない", async () => {
    const message = ["limitがリクエストされていません", "limitが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get("/influencers-top?metric=likes");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
});

describe("GET /influencers/analysis/top-nouns?limit=", () => {
  test("正常系: limitが0", async () => {
    const influencerData = [{ influencer_id: "2", wordCount: [] }];
    const responceData = { influencers: influencerData };
    InfluencerService().getTopNouns.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers/analysis/top-nouns?limit=0");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("正常系: limitが1", async () => {
    const influencerData = [{ influencer_id: "2", wordCount: [{ "#": 56 }] }];
    const responceData = {
      influencers: influencerData,
    };
    InfluencerService().getTopNouns.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers/analysis/top-nouns?limit=1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("正常系: limitが100", async () => {
    const influencerData = [{ influencer_id: "2", wordCount: [] }];
    const responceData = { influencers: influencerData };
    InfluencerService().getTopNouns.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers/analysis/top-nouns?limit=100");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("異常系: getTopNounsが異常終了", async () => {
    const message = ["ユニットテスト用エラー"];
    InfluencerService().getTopNouns.mockRejectedValue(new Error("ユニットテスト用エラー"));
    const response = await request(cookMenuRouter).get("/influencers/analysis/top-nouns?limit=1");
    expect(response.status).toBe(500);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: limitが文字", async () => {
    const message = ["limitが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get("/influencers/analysis/top-nouns?limit=a");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: limitが文字と数値", async () => {
    const message = ["limitが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get(
      "/influencers/analysis/top-nouns?limit=29837bbwyiu",
    );
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
  test("異常系: limitがリクエストされない", async () => {
    const message = ["limitがリクエストされていません", "limitが正しくリクエストされていません"];
    const response = await request(cookMenuRouter).get("/influencers/analysis/top-nouns");
    expect(response.status).toBe(400);
    expect(response.body.errors.developerMessage).toEqual(message);
  });
});
