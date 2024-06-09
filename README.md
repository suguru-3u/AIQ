# プロジェクトの説明

このプロジェクトは Docker,Node.js,MySQL を使用して CSV ファイルからデータを取得し RDB に保存する CLI(nodeCli フォルダ)と保存したデータを取得する API(nodeAPI フォルダ)があります。

# 使用技術

- Node.js
- MySQL
- Docker

# 必要な環境

DockerCompose を使用できる環境が必要です。
環境構築方法は以下の URL を参考にしてください。https://docs.docker.jp/compose/toc.html

# 使い方

1. ターミナルで`docker-compose -v`を実行し、バージョンが表示されることを確認する。
   ※バージョンが表示されいない場合、上記 URL を参考にインストールしてください。
2. CSV ファイルのデータを RDB に保存する(CLI の実行)。
   1. CSV ファイルを nodeCli フォルダに配置する。
   2. ターミナルで`docker-compose up -d`を実行後、`docker-compose ps`を実行し、コンテナが正常に立ち上げっていることを確認する。
   3. `docker-compose exec node-cli npm run start`を実行し、ターミナルに**データベースへの登録が完了しました**のメッセージが表示されること(CSV ファイルのデータの保存成功)
3. API を使用し、RDB に保存されたデータを取得する。
   1. ターミナルで`docker-compose ps`を実行し、コンテナが正常に立ち上げっていることを確認する。
   2. ターミナルで`docker-compose exec node-api npm run start`を実行し、**App listening on port 3000!**のメッセージが表示されていることを確認する。
   3. 下記に記載している API の URL からデータを取得する。

# API の URL

- http://localhost:3000/api/v1/influencers/:id
  - パスパラメーターの:id にインフルエンサ id を設定
  - インフルエンサー id から平均いいね数、平均コメント数を JSON 形式で返却します。
- http://localhost:3000/api/v1/influencers-top?metric=&limit=
  - クエリ文字列の metric
    - likes(いいね数) or comments(コメント数)のみ設定可能
  - クエリ文字列の limit
    - 表示させたいインフルエンサの上位人数を設定
  - 平均いいね数 or 平均コメント数(metric に設定した項目)が多いインフルエンサー上位 N 件(limit 設定した数)を JSON 形式で返却します。
- http://localhost:3000/api/v1/influencers/analysis/top-nouns?limit=
  - クエリ文字列の limit
    - 表示させたいインフルエンサの人数
  - インフルエンサ id 毎に、投稿したデータから名詞を抽出して使用回数を集計し、上位 N 件(limit 設定した数)JSON 形式で返す返却します。

# その他コマンド

- テスト実行方法
  - docker-compose exec node-api npm run test
- 各コンテナへのログイン方法
  - RDB
    - docker-compose exec db bash
  - CLI
    - docker-compose exec node-cli sh
  - API
    - docker-compose exec node-api sh
- MySQL へのログイン方法
  - コマンド
    - docker-compose exec db mysql -u root -p
    - パスワードは環境変数の`LOCAL_ROOT_PASSWORD`を使用
