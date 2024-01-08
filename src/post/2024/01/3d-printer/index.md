---
layout: blog
title: 自宅の3Dプリンターまわりの知見まとめ 2023年度版
date: 2024-01-08
tags:
  - 3d-printer
---

自宅で使っている3Dプリンターの環境や設定などをまとめる。


## 本体まわり

手軽なEnder3。24,900円(2024/1時点)。

- [Creality Ender 3](https://www.amazon.co.jp/dp/B07D218NX3/)

デフォルトで付属している制御基板だと、ステッピングモーターのノイズ音が(想像の10倍くらい)うるさい。
市販のサードパーティーの制御基板に換装する。

- [BIQU SKR Mini E3 V2\.0 基板 コントローラーボード32ビット](https://www.amazon.co.jp/dp/B0882TTF4B/)
- 参考: [３Dプリンタの動作音を劇的に静かにする方法【Ender\-3】 \- YouTube](https://www.youtube.com/watch?v=ZaEEMG5nTHQ)

ベッドはマグネット式を採用。
ベッドの上だけが外れるので、ベッドを曲げることで簡単に印刷物を剥がすことができる。

- [Creality マグネットシート 235x235mm ソフト 磁気 印刷 ベッド Ender 3 / Ender 3 V2 / Ender 3 S1](https://www.amazon.co.jp/gp/product/B085NK3KQ8/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&th=1)

剥がれないときは無理矢理剥がす必要があるが、付属のスクレイパーだと、厚みがありすぎてうまく剥がせないし怪我をして危ない。

シールはがし用のカッターがいい感じ。

- [ニトムズ テープはがしカッター](https://www.amazon.co.jp/dp/B07QF883Z9/)


## スライサー

Ultrimaker Cura。基本的にデフォルトの設定でうまく印刷できる。brimも付けなくてOK。

積層ピッチは0.2mmか0.26mmを普段は使う。

移動速度2倍くらいまでなら見た目の品質劣化はなさそうに見える。
3倍くらいだと多少の乱れは見えるものの、1mm精度程度であれば十分出るので、おおまかなプロトタイプならそれでもOK。

## フィラメント

このへんは問題なく使えた。設定もCuraデフォルトのものでOK。

- [Creality Hyper PLA フィラメント 1\.75mm 1KG](https://www.amazon.co.jp/dp/B085CCBP6S/)
- [Creality 3Dプリンター フィラメント PLA 1\.75mm ±0\.02mm 1KG](https://www.amazon.co.jp/dp/B0BGR7Q4NK/)

## インサートナット

3dプリンタ成形物に、ナットを溶かし入れることで、2つ以上の部品を組み合わせて作ることができる。
手軽なのでちょくちょく活用している。


参考: [【3Dプリンタ】PLA造形物に熱圧入で簡単にネジをつくる方法 – まにあふぁくとりー](https://maniacucina.work/3dprinter/heat-press-fitting/)

用意したもの

- [uxcell ローレットインサートナット M3 x 4mm L x 5mm](https://www.amazon.co.jp/dp/B09NNPRV9C/)
- はんだごてを活用して圧入する。通常のはんだごてでも可能がだが、安定しやすくて熱が伝わりやすい専用のコテ先もある。普段はこれを使っている。
  - [hineNow ヒートセットインサートチップ](https://www.amazon.co.jp/dp/B09VL41T7K/)
  - [白光\(HAKKO\) ダイヤル式温度制御はんだこて FX600\-02](https://www.amazon.co.jp/dp/B006MQD7M4/?th=1)


条件 (M3の場合)
- 穴径：外径+0.05mm → 5.05mm
- 穴深さ：全長+0.1mm → 4.1mm
- 入口に面取り0.5mm
  - 安定して圧入するには、面取りが重要。
- こての温度270度か320度
  - 少し足りないかな？くらいの低めの温度で、ゆっくり溶かしてゆっくり圧入するのがコツ。

## ネットワークプリント

SDカードの抜き差しをしなくてよいよう、
OctoPrintを利用してネットワーク経由で印刷できるようにしている。

専用のラズパイイメージ "OctoPi" を活用。ラズパイをEnder3に接続して制御している。
Raspi Imagerからイメージを焼くことができる。

## TODO

- オートレベリング用のセンサを買ったけど手をつけられていないので試してみたい。
  - [Creality CR Touch 自動ベッドレベリングセンサーキット 3Dプリンターベッドレベリングツール 金属プッシュピン付き Ender 3/Ender 3 V2/Ender 3 Pro/3 Max/Ender 5 pro/CR\-10用 32 ビット V4\.2\.2/V4\.2\.7 メインボード付き : DIY・工具・ガーデン](https://www.amazon.co.jp/dp/B0CFX3VSDF/)
- [Creality K1](https://www.amazon.co.jp/dp/B0CD5YWSL3/) を試してみたい。



