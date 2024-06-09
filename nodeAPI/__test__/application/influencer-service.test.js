const InfluencerService = require("../../application/influencer-service.js");
const InfluencerDatasource = require("../../infrastructure/datasource/influencer-datasource.js");

// jest.mock()を使用してInfluencerDatasourceモジュールをモック化する
jest.mock("../../infrastructure/datasource/influencer-datasource.js", () => {
  const mock = jest.fn();
  return jest.fn().mockImplementation(() => {
    return {
      detail: mock,
      getTopInfluencersByMetric: mock,
    };
  });
});

describe("detail", () => {
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

describe("getTopInfluencersByMetric", () => {
  test("正常系: metricがlikes", async () => {
    const requestQuery = {
      metric: "likes",
      limit: 1,
    };
    const influencerData = [
      {
        influencer_id: 2,
        metric: "551.7500",
      },
    ];
    const responseData = [
      {
        No: 1,
        influencerId: 2,
        likes: "551.7500",
      },
    ];
    // InfluencerDatasourceモジュールのdetail関数をモック化し、適切な値を返すように設定
    InfluencerDatasource().getTopInfluencersByMetric.mockResolvedValueOnce(
      influencerData
    );

    const influencerService = new InfluencerService();
    const response = await influencerService.getTopInfluencersByMetric(
      requestQuery
    );
    expect(response).toEqual(responseData);
  });
  test("正常系: metricがcomments", async () => {
    const requestQuery = {
      metric: "comments",
      limit: 1,
    };
    const influencerData = [
      {
        influencer_id: 2,
        metric: "551.7500",
      },
    ];
    const responseData = [
      {
        No: 1,
        influencerId: 2,
        comments: "551.7500",
      },
    ];
    // InfluencerDatasourceモジュールのdetail関数をモック化し、適切な値を返すように設定
    InfluencerDatasource().getTopInfluencersByMetric.mockResolvedValueOnce(
      influencerData
    );

    const influencerService = new InfluencerService();
    const response = await influencerService.getTopInfluencersByMetric(
      requestQuery
    );
    expect(response).toEqual(responseData);
  });
});
