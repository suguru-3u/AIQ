# プロジェクトの説明
このプロジェクトはDocker,Node.js,MySQLを使用してCSVファイルからデータを取得しRDBに保存するCLI(nodeCliフォルダ)と保存したデータを取得するAPI(nodeAPIフォルダ)があります。

# 必要な環境
DockerComposeを使用できる環境が必要です。
環境構築方法は以下のURLを参考にしてください。https://docs.docker.jp/compose/toc.html

# 使い方
1. ターミナルで`docker-compose -v`を実行し、バージョンが表示されることを確認する。
※バージョンが表示されいない場合、上記URLを参考にインストールしてください。
2. CSVファイルのデータをRDBに保存する(CLIの実行)。
   1. CSVファイルをnodeCliフォルダに配置する。
   2. ターミナルで`docker-compose up -d`を実行後、`docker-compose ps`を実行し、コンテナが正常に立ち上げっていることを確認する。
   3. `docker-compose exec node-cli npm run start`を実行し、ターミナルに**データベースへの登録が完了しました**のメッセージが表示されること(CSVファイルのデータの保存成功)
3. APIを使用し、RDBに保存されたデータを取得する。
   1. ターミナルで`docker-compose ps`を実行し、コンテナが正常に立ち上げっていることを確認する。
   2. ターミナルで`docker-compose exec node-api npm run start`を実行し、**Example app listening on port 3000!**のメッセージが表示されていることを確認する。
   3. 下記に記載しているAPIのURLからデータを取得する。

# APIのURL
- http://localhost:3000/api/v1/influencers/:id
  - パスパラメーターの:idにインフルエンサーidを設定
  - インフルエンサーidから平均いいね数、平均コメント数をJSON形式で返却します。
- http://localhost:3000/api/v1/influencers/top?metric=&limit=
  - クエリ文字列のmetric
    - likes(いいね数) or comments(コメント数)のみ設定可能
  - クエリ文字列のlimit
    - 表示させたいインフルエンサーの上位人数を設定
  - 平均いいね数 or 平均コメント数(metricに設定した項目)が多いインフルエンサー上位N件(limit設定した数)をJSON形式で返却します。
- http://localhost:3000/api/v1/influencers/analysis/top-nouns?limit=
  - クエリ文字列のlimit
    - 表示させたいインフルエンサーの人数
  - インフルエンサーid毎に、投稿したデータから名詞を抽出して使用回数を集計し、上位N件(limit設定した数)JSON形式で返す返却します。

# 使用技術
- Node.js
- MySQL
- Docker