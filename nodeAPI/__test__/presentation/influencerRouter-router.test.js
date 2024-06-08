const request = require("supertest");
const cookMenuRouter = require("../../presentation/influencerRouter-router.js");
const InfluencerService = require("../../application/influencer-service.js");

// jest.mock()を使用してInfluencerServiceモジュールをモック化する
jest.mock("../../application/influencer-service.js", () => {
  const mockDetail = jest.fn();
  return jest.fn().mockImplementation(() => {
    return {
      detail: mockDetail,
    };
  });
});

describe("GET /", () => {
  test("正常系: パスパラメータが数値", async () => {
    const influencerData = {
      influencer_id: 2,
      likes: "551.7500",
      comments: "10.5000",
    };
    const responceData = {
      influencer: influencerData,
    };
    // モック化されたdetail関数を設定
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
    // モック化されたdetail関数を設定
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
    // モック化されたdetail関数を設定
    InfluencerService().detail.mockResolvedValueOnce(influencerData);
    const response = await request(cookMenuRouter).get("/influencers/100");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responceData);
  });
  test("異常系: パスパラメータが数値", async () => {
    // モック化されたdetail関数を設定
    const message = { message: "インフルエンサー情報取得処理に失敗しました" };
    InfluencerService().detail.mockRejectedValue(
      new Error("ユニットテスト用エラー")
    );
    const response = await request(cookMenuRouter).get("/influencers/1");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(message);
  });
  test("異常系 validation check: パスパラメータが文字列", async () => {
    const message = { message: ["influencer id が正しく設定されていません"] };
    const response = await request(cookMenuRouter).get("/influencers/a");
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系 validation check:  パスパラメータが文字と数値が混同", async () => {
    const message = { message: ["influencer id が正しく設定されていません"] };
    const response = await request(cookMenuRouter).get("/influencers/12ubva6");
    expect(response.status).toBe(400);
    expect(response.body).toEqual(message);
  });
  test("異常系 validation check: パスパラメータがない", async () => {
    const response = await request(cookMenuRouter).get("/influencers/");
    expect(response.status).toBe(404);
  });
});