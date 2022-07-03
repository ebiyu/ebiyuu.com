---
layout: blog
title: "Lambda at Edge Chrome"
date: 2021-06-08T21:54:11+09:00
---

## Lambda layer を作成する

Headless Chrome 本体のレイヤーと、pip ライブラリをインストールしたレイヤーの 2 つを作成します。

### chrome Layer

以下の 2 点を Zip にします。

- [adieuadieu/serverless\-chrome: 🌐 Run headless Chrome/Chromium on AWS Lambda](https://github.com/adieuadieu/serverless-chrome/tree/master)
  - Headless Chrome を Lambda で動作するようにカスタマイズしたライブラリ
- [ChromeDriver \- WebDriver for Chrome \- Downloads](https://chromedriver.chromium.org/downloads)
  - Chrome を制御する WebDriver

今回は Serverless Chrome [Release v1.0.0-37](https://github.com/adieuadieu/serverless-chrome/releases/tag/v1.0.0-37)、[Chromedriver 2.37](https://chromedriver.storage.googleapis.com/index.html?path=2.37/)を用いました。（最新版は容量不足で入らなかった）

これらを解凍して実行権限を与え、`chrome` フォルダにまとめて zip に固めます。

```
chrome
├── chromedriver
└── headless-chromium
```

```000
$ chmod 755 chrome/*
$ zip -r chrome.zip chrome
```

`chrome.zip`を Lambda Layer としてアップロードします。

## selenium layer

画像のリサイズ処理を行うため、Pillow も一緒にインストールします。

```
$ pip3 install -t python/lib/python3.7/site-packages selenium Pillow
$ zip -r selenium.zip python
```

動かん。もう無理。

## 参考サイト

- [[Python] Headless Chrome を AWS Lambda で動かす \- Qiita](https://qiita.com/mishimay/items/afd7f247f101fbe25f30)
- [[Python] pip3 のパッケージを AWS Lambda 上で import できるようにする \- Qiita](https://qiita.com/mishimay/items/e107b685381cca0493bf)
- [AWS Lambda で Pillow を使おうとしたらハマった \- michimani\.net](https://michimani.net/post/aws-use-pillow-in-lambda/)
-
