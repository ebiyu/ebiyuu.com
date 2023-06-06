---
layout: blog
title: Keyball61を組んだ
date: 2023-06-06
tags:
  - gadget
---

トラックボール付き分割キーボードであるところの[Keyball61](https://shirogane-lab.com/products/keyball61)を購入したので組み立てた。

要約すると、

- トラックボールを買え
- キースイッチは予備を買っておけ
- Pro Microの向きには気をつけろ

## 材料の調達

「自作キーボード」なので、もろもろのパーツを買って組み立てないといけない。

必要な部品のリストは[遊舎工房のページ](https://shop.yushakobo.jp/products/5358)や
[ビルドガイド](https://github.com/Yowkees/keyball/blob/main/keyball61/doc/rev1/buildguide_jp.md) に書いてある。

### キースイッチ

とりあえず初心者は赤軸、という記事を見かけたのと、ミーティング中にうるさくないキーボードがほしかったので、
[Cherry MXのピンク軸](https://shop.yushakobo.jp/products/cherry-mx?variant=44079445672167)を購入。

気に入らなかったら交換すればいいやというのと、どうせ長く使わないと実際に使用感は分からないと思ったため、
特に比較せず購入。

親指は[ロープロの赤軸](https://shop.yushakobo.jp/products/pg1350?variant=44079245492455)のキースイッチを採用。

### キーキャップ

[刻印ありのPBTキーキャップ一式](https://shop.yushakobo.jp/products/a0300pc-01-1?variant=37665534673057)と、
特殊キー用の[DSA無刻印](https://shop.yushakobo.jp/products/dsa-blank-keycaps?_pos=1&_sid=470a31dc8&_ss=r&variant=37665598308513)を購入。

DSAとPBTの違いが分からず買ったので、いずれ統一しないといけない。

特殊キーはどうせすぐキーマップが変わると思ったので、無刻印にした。
キーマップが固まったらオーダーメイドで何か刻印してもいいかな。

### トラックボール

買い忘れたので自宅にあった[MX ergo](https://www.amazon.co.jp/gp/product/B0BXCTQJP7/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)から羅生門した。

## 組み立てで詰まったところ

### Pro Microの向きを間違えた

Pro Microは部品面が下。ちゃんとビルドガイドを見よう。

### キースイッチの足が折れた (x3)

特定のキーが反応しなかった。キースイッチを引き抜いてみたところ、足が曲がっていた。
新しいキースイッチに交換して対応した。

キースイッチの予備はあったほうがいい。

### キーソケットのハンダ付け不良 (x1)

キーソケットのハンダ付け不良が1箇所あった。
温め直してハンダを流し込んで修正。

逆に1箇所しかなかったのは少なくて意外だった。

### Pro Microの接触不良 (x2)

Row 4が左右ともに反応しなかったので、ProMicroの接触不良を疑った。
実際にテスターを当ててみたら導通していなかった。差し直したら直った。
ソケットの信頼性に若干の不安。

## キーマップ

キーマップは試行錯誤中なので、いずれ。

## References

- [keyball39 を組み立てた \- goropikariの備忘録](https://goropikari.hatenablog.com/entry/keyball39_build_log) 
- [はじめての自作キーボード：Keyball61 \- チラシのすきま](https://monoworks.co.jp/post/2023-04-10-first-self-made-keyboard-keyball61/)
