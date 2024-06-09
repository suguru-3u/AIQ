const InfluencerService = require("../../application/influencer-service.js");
const InfluencerDatasource = require("../../infrastructure/datasource/influencer-datasource.js");

// jest.mock()を使用してInfluencerDatasourceモジュールをモック化する
jest.mock("../../infrastructure/datasource/influencer-datasource.js", () => {
  const mock = jest.fn();
  return jest.fn().mockImplementation(() => {
    return {
      detail: mock,
      getTopInfluencersByMetric: mock,
      getTextData: mock,
    };
  });
});

describe("detail", () => {
  test("正常系", async () => {
    const dbMockData = [
      {
        influencer_id: 2,
        likes: "551.7500",
        comments: "10.5000",
      },
    ];
    const responseMockData = {
      influencer_id: 2,
      likes: "551.7500",
      comments: "10.5000",
    };
    InfluencerDatasource().detail.mockResolvedValueOnce(dbMockData);

    const influencerService = new InfluencerService();
    const response = await influencerService.detail(1);
    expect(response).toEqual(responseMockData);
  });
  test("正常系: インフルエンサーがいなかった", async () => {
    const dbMockData = [];
    InfluencerDatasource().detail.mockResolvedValueOnce(dbMockData);
    const influencerService = new InfluencerService();
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
    const requestMockQuery = {
      metric: "likes",
      limit: 1,
    };
    const dbMockData = [
      {
        influencerId: 2,
        metric: "551.7500",
      },
    ];
    const responseMockData = [
      {
        No: 1,
        influencerId: 2,
        likes: "551.7500",
      },
    ];
    // InfluencerDatasourceモジュールのdetail関数をモック化し、適切な値を返すように設定
    InfluencerDatasource().getTopInfluencersByMetric.mockResolvedValueOnce(dbMockData);

    const influencerService = new InfluencerService();
    const response = await influencerService.getTopInfluencersByMetric(requestMockQuery);
    expect(response).toEqual(responseMockData);
  });
  test("正常系: metricがcomments", async () => {
    const requestMockQuery = {
      metric: "comments",
      limit: 1,
    };
    const dbMockData = [
      {
        influencerId: 2,
        metric: "551.7500",
      },
    ];
    const responseMockData = [
      {
        No: 1,
        influencerId: 2,
        comments: "551.7500",
      },
    ];
    InfluencerDatasource().getTopInfluencersByMetric.mockResolvedValueOnce(dbMockData);

    const influencerService = new InfluencerService();
    const response = await influencerService.getTopInfluencersByMetric(requestMockQuery);
    expect(response).toEqual(responseMockData);
  });
});

describe("getTopNouns", () => {
  const dbMockData = [
    {
      influencerId: 2,
      text:
        "．\n" +
        "👶🎉🎂\n" +
        "．\n" +
        "遅ればせながらhalf birthdayのお祝い♡\n" +
        "（1ヶ月も遅れてる🤫）\n" +
        "@cakewith_tokyo でオーダーしました🤳\n" +
        "ケーキの形が□・○・♡が選べて、クリームの色やフルーツ有無、サイドのクリームにステッチを入れるかなど選べて、好きな文字や写真をプリントすることも可能で、どんなデザインにするか凄く迷いました🥺♡\n" +
        "．\n" +
        "冷凍で届くので食べる前に冷蔵庫で5時間ほど解凍すると食べられます🍰\n" +
        "お誕生日会の当日にケーキ屋さんに取りに行ったりバタバタせずに用意できるのはメッチャ有り難いですよね‼︎\n" +
        "スポンジ・フルーツ・クリームの味も美味しいし、見た目もオシャレで可愛いし💯でしかなかったです✊\n" +
        "．\n" +
        "#cakewith_tokyo #halfbirthday #ハーフバースデー #誕生日ケーキ #生後6ヶ月 #男の子ベビー #バースデーケーキ #オーダーケーキ #男の子ママ #育児",
    },
    {
      influencerId: 2,
      text:
        "．\n" +
        "マザーズバッグはリュックを使うことが多いけど、布製のものだったので雨の日に中身がしっとりしてしまい、防水がしっかりしている @gastonluga のものにしました🎒\n" +
        "形もしっかりしてて荷物もたくさん入るし、デザインもオシャレで最高です☻\n" +
        "．\n" +
        "送料もかからないし、【manamin158】のクーポンで15% offになります※公式HPのみ\n" +
        "期間数量限定のプレゼントもついていてお得です◎\n" +
        "．\n" +
        "#GastonLuga #ガストンルーガ #バックパック #CARRYYOURLIFEEFFORTLESSLY",
    },
    {
      influencerId: 3,
      text: "#ママコーデ #ママファッション #大人コーデ",
    },
    {
      influencerId: 4,
      text: "#IMUNNY #アイムユニ #コスメレポ #新作コスメ",
    },
  ];
  test("正常系: limitが1", async () => {
    const responseMockData = [
      { influencerId: "2", wordCount: [{ "#": 14 }] },
      { influencerId: "3", wordCount: [{ "#": 3 }] },
      { influencerId: "4", wordCount: [{ "#": 4 }] },
    ];
    InfluencerDatasource().getTextData.mockResolvedValueOnce(dbMockData);

    const influencerService = new InfluencerService();
    const response = await influencerService.getTopNouns(1);
    expect(response).toEqual(responseMockData);
  });
  test("正常系: limitが0", async () => {
    const responseMockData = [
      { influencerId: "2", wordCount: [] },
      { influencerId: "3", wordCount: [] },
      { influencerId: "4", wordCount: [] },
    ];
    InfluencerDatasource().getTextData.mockResolvedValueOnce(dbMockData);

    const influencerService = new InfluencerService();
    const response = await influencerService.getTopNouns(0);
    expect(response).toEqual(responseMockData);
  });
  test("正常系: limitが10", async () => {
    const responseMockData = [
      {
        influencerId: "2",
        wordCount: [
          {
            "#": 14,
          },
          {
            ケーキ: 5,
          },
          {
            "♡": 3,
          },
          {
            クリーム: 3,
          },
          {
            日: 3,
          },
          {
            ヶ月: 2,
          },
          {
            "@": 2,
          },
          {
            cakewith: 2,
          },
          {
            _: 2,
          },
          {
            tokyo: 2,
          },
        ],
      },
      {
        influencerId: "3",
        wordCount: [
          {
            "#": 3,
          },
          {
            ママコーデ: 1,
          },
          {
            ママ: 1,
          },
          {
            ファッション: 1,
          },
          {
            大人: 1,
          },
          {
            コーデ: 1,
          },
        ],
      },
      {
        influencerId: "4",
        wordCount: [
          {
            "#": 4,
          },
          {
            IMUNNY: 1,
          },
          {
            アイムユニ: 1,
          },
          {
            コスメレポ: 1,
          },
          {
            新作: 1,
          },
          {
            コスメ: 1,
          },
        ],
      },
    ];
    InfluencerDatasource().getTextData.mockResolvedValueOnce(dbMockData);

    const influencerService = new InfluencerService();
    const response = await influencerService.getTopNouns(10);
    expect(response).toEqual(responseMockData);
  });
});
