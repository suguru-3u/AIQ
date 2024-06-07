# ベースイメージを指定
FROM node:alpine

# ファイルのコピー先のディレクトリまで移動する
WORKDIR /usr/app

# 雛形を生成するのに必要なパッケージのインストール
COPY ./package.json ./
RUN npm install
COPY ./ ./

