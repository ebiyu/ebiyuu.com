---
layout: blog
title: " Windowsでyarnが動かなかった。"
date: 2020-07-29T05:47:59+09:00
---

mac で開発していた Nuxt のソースコードを windows に持ってきた。

yarn の開発環境は scoop で構築した。

```
$ scoop install node yarn
```

これでコンパイル！しようとしたら失敗した。

```
$ yarn run generate yarn run v1.22.4 > $ nuxt generate 'nuxt' is not recognized as an internal or external command, operable program or batch file. error Command failed with exit code 1. info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

nuxt が見つからないよ！って怒られてるらしい。もちろんちゃんと yarn での nuxt のインストールはしてあるので、エラーになるのはよくわからない。

## 解決策

調べてみたところ、`cross-env`を使うといいらしい。

まずは`cross-env`のインストール

```
$ yarn global add cross-env
```

それに加えて、`package.json`の書き換えを行う。

```
- "dev": "nuxt", - "build": "nuxt build", - "start": "nuxt start", - "generate": "nuxt generate", + "dev": "cross-env nuxt", + "build": "cross-env nuxt build", + "start": "cross-env nuxt start", + "generate": "cross-env nuxt generate",
```

これで実行すると成功した。

cross-env は、「開発環境ごとの差異を吸収してくれる」ということらしいが、よくわかっていない。

node のライブラリは全体的によくわからないものしかない。

## 参考サイト

- [vue.js — nuxt プロジェクトの実行エラー：「 'nuxt'は内部または外部コマンドとして認識されません」](https://www.it-swarm-ja.tech/ja/vue.js/nuxt%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E5%AE%9F%E8%A1%8C%E3%82%A8%E3%83%A9%E3%83%BC%EF%BC%9A%E3%80%8C-'nuxt'%E3%81%AF%E5%86%85%E9%83%A8%E3%81%BE%E3%81%9F%E3%81%AF%E5%A4%96%E9%83%A8%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%81%A8%E3%81%97%E3%81%A6%E8%AA%8D%E8%AD%98%E3%81%95%E3%82%8C%E3%81%BE%E3%81%9B%E3%82%93%E3%80%8D/809710738/)
