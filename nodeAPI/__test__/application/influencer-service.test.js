const InfluencerService = require("../../application/influencer-service.js");
const InfluencerDatasource = require("../../infrastructure/datasource/influencer-datasource.js");

// jest.mock()を使用してInfluencerDatasourceモジュールをモック化する
jest.mock("../../infrastructure/datasource/influencer-datasource.js", () => {
  const mockDetail = jest.fn();
  return jest.fn().mockImplementation(() => {
    return {
      detail: mockDetail,
    };
  });
});

describe("GET /", () => {
  test("正常系: パスパラメータが数値", async () => {
    const influencerData = [
      {
        influencer_id: 2,
        likes: "551.7500",
        comments: "10.5000",
      },
    ];
    const responseData = {
      influencer_id: 2,
      likes: "551.7500",
      comments: "10.5000",
    };
    // InfluencerDatasourceモジュールのdetail関数をモック化し、適切な値を返すように設定
    InfluencerDatasource().detail.mockResolvedValueOnce(influencerData);

    const influencerService = new InfluencerService();
    const response = await influencerService.detail(1);
    expect(response).toEqual(responseData);
  });
  test("正常系: インフルエンサーがいなかった", async () => {
    const influencerData = [];
    // InfluencerDatasourceモジュールのdetail関数をモック化し、適切な値を返すように設定
    InfluencerDatasource().detail.mockResolvedValueOnce(influencerData);
    const influencerService = new InfluencerService();
    // エラーが発生するかどうかを確認
    try {
      await influencerService.detail(1);
    } catch (error) {
      expect(error.name).toBe("NotInfluencerError");
      expect(error.message).toBe("Influencer ID [1] not found");
    }
  });
});
