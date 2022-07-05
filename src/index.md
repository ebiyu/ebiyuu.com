---
layout: site.njk
title: Yusuke Ebihara
---

## Profile

- Yusuke Ebihara (海老原祐輔)
- M1 Student (electronics, The University of Tokyo) / Programmer (web, mobile)
- Email: `yusuke+ebihara.me` (Please replace + with @)
- Twitter: [@ebiyuu1121_](https://twitter.com/ebiyuu1121_)
- Facebook: [Yusuke Ebihara](https://www.facebook.com/yuusuke.ebihara.7/)
- Github: [ebiyuu1121](https://github.com/ebiyuu1121)
- Favorite game: Mario Kart 8DX / maimai / Mahjong

## Experiences

- [2022/04-] 東京大学大学院工学系研究科 [電気系工学専攻](https://www.eeis.t.u-tokyo.ac.jp)
  - [2022/04-] 東京大学大学院工学系研究科 [染谷研究室](http://www.ntech.t.u-tokyo.ac.jp) (Organic / flexible electronics)
- [2020/04-2022/03] 東京大学工学部 [電気電子工学科](https://www.ee.t.u-tokyo.ac.jp/)
  - [2021/04-2022/03] 東京大学工学部 [三田研究室](https://www.if.t.u-tokyo.ac.jp) (MEMS)
- [2018/04-2020/03] 東京大学教養学部理科一類


## Projects

- [2021年度未踏IT人材発掘・育成事業](https://www.ipa.go.jp/jinzai/mitou/2021/gaiyou_sd-3.html) (クリエータ) [2021-2022]
- [東大学内チェックインアプリ「MOCHA」](https://mocha.t.u-tokyo.ac.jp) (PR担当・ウェブ担当) [2020-]
- [2021年度工学部研究成果発表会](https://2021.eeic.jp/) (企画統括・VTuberモデリング・ウェブ開発担当) [2021]
- [Лироша Channel リローシャチャンネル](https://www.youtube.com/channel/UC5T-TP6eOGbX9DVXpLtevEA) (企画・動画編集) [2018-2019]
- [東京大学サイエンスコミュニケーションサークルCAST](https://ut-cast.net/) (会計・ウェブ担当) [2018-2022]

## Works

Includes collaborative works

- [2022/02] [全自動筋トレ記録システム「Muscle Supporter」](https://muscle-supporter.com/) (iOS App / Machine learning)
- [2020/11] [東大CAST駒場祭特設サイト](https://ut-cast.net/komafes2020/) (Web site)
  - [ガチャガチャ企画(元素ガチャ)](https://ut-cast.net/komafes2020/gacha/) (Web app)
- [2020/09] [東大CAST五月祭特設サイト](https://ut-cast.net/mayfes2020/) (Web site)
  - [ミニゲーム「階段を作り出せ！」](https://ut-cast.net/mayfes2020/minigame/tsumiki/) (Unity project)
  - [進捗企画「みんなで実験！円周率を求めよう！」](https://ut-cast.net/mayfes2020/data-collecting/) (Web app)
- [2020/06] [自作問題共有サービス「ポロロッカ」](https://pororocca.com/) (Web app)
- [various] [Ebi's web lab](https://lab.ebiyuu.com/) (Web app) ([source](https://github.com/ebiyuu1121/web-lab))

## Skills

- Programming
  - Web frontend (HTML, CSS, JavaScript; Sass, Vue, Nuxt, React)
  - Web backend (PHP, Go, SQL; Laravel, Django; Serverless)
  - iOS app (Swift)
  - Web cloud (AWS; EC2, S3, Lambda...)
  - Data analysis / machine learning (Python, R; neural network)
  - Embedded programing (Arduino)
  - Others (C, C++, Excel VBA, Unity)
- Electronics
  - Circuit design
  - LSI design (including verilog)
  - Nano fabrication
- Movie editing
- Design (learning)

## Awards

- [2021年度未踏IT人材発掘・育成事業スーパークリエータ](https://www.ipa.go.jp/jinzai/mitou/2021/20220527.html)  [2022]
- [全国物理コンテスト 物理チャレンジ2017 銀賞・実験優秀賞](http://www.jpho.jp/2017schedule.html) [2017]

## Publications / Conference presentation

- <u>Yusuke Ebihara</u>, Ayako Mizushima, Takashi Yoda , Kenji Hirakawa, Masayuki Iwase, Munehiro Ogasawara, Akio Higo, Yukinori Ochiai, and Yoshio Mita, "Two-pads per electrode in-situ test structure for micron-scale flip-chip bonding reliability of chip-on-chip device", <i>34th IEEE International Conference on Microelectronic Test Structures (ICMTS)</i>, online, March 21-24, 2022

<hr>

## Recent blog posts

<ul>
{%- for post in collections.recentPosts -%}
  <li>
    {{ post.data.date | formatDate }}
    <a href="{{post.url}}">{{ post.data.title }}</a>
  </li>
{%- endfor -%}
  <li>
    <a href="/post">See more</a>
  </li>
</ul>


