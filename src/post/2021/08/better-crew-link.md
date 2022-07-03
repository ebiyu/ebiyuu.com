---
layout: blog
title: "Among usで近くにいる人と通話できる「BetterCrewLink」の使い方"
summary: "Among usに特化した通話ツールで、Among usの部屋と連動して通話ができる。"
date: 2021-08-27T21:08:59+09:00
---

Among usに特化した通話ツールで、Among usの部屋と連動して通話ができる。

- 会議中だけ生きている人全員で会話ができる
- 会議中以外はゲーム上で近くにいる人と通話ができる。
- 死んだ人の声は生きている人には聞こえない。

#### 会議中以外

|                        | 近くにいる生きている人の声 | 近くにいる死んだ人の声 | 遠くにいる人の声 |
| ---------------------- | :------------------------: | :--------------------: | :--------------: |
| 生きているクルーメイト |          聞こえる          |       聞こえない       |    聞こえない    |
| 生きているインポスター |          聞こえる          |      *設定による*      |    聞こえない    |
| 死んだ人               |          聞こえる          |        聞こえる        |    聞こえない    |

#### 会議中

|                        | 生きている人の声 |            死んだ人の声            |
| ---------------------- | :--------------: | :--------------------------------: |
| 生きているクルーメイト |     聞こえる     |             聞こえない             |
| 生きているインポスター |     聞こえる     | 聞こえない <small>(要検証)</small> |
| 死んだ人               |     聞こえる     |              聞こえる              |



## リポジトリ

Githubで開発が行われており、使い方もGithubに書いてある。

- [OhMyGuus/BetterCrewLink: Free, open, Among Us Proximity Chat](https://github.com/OhMyGuus/BetterCrewLink)
- [OhMyGuus/BetterCrewlink\-mobile](https://github.com/OhMyGuus/BetterCrewlink-mobile)

## 設定方法

注意点: 少なくとも一人は「Windows版BetterCrewLink+Windows版 Among us」の組み合わせの人が必要。

### Windows

以下から.exeファイルをダウンロードしてインストールできる。

[Releases · OhMyGuus/BetterCrewLink](https://github.com/OhMyGuus/BetterCrewLink/releases)

Windows版はPC上で起動しているAmong usを自動で認識し、自動的に接続される。

### Android

Google Play Storeからダウンロードできます。

[BetterCrewlink \- Apps on Google Play](https://play.google.com/store/apps/details?id=io.bettercrewlink.app)

<small>android版の詳細に関しては詳しくないのでわかりません。</small>

### その他

[ブラウザ版](https://web.bettercrewl.ink/settings)を使用してください。

**Among usアプリでのルーム参加に加え、BetterCrewLinkでのルーム参加が必要。**

Among usを起動する端末とBetterCrewLinkを開く端末は同じでも異なっていても大丈夫。

## よくあるトラブル

### 声が二重に聞こえる

- イヤホンをしていない人がいる可能性がある。全員がイヤホンを装着するようにしてください。

### 他の人の声が聞こえない・自分の声が届かない

- ブラウザ版であれば、マイクの使用が許可できているか確認する。リロードすると許可のポップアップが出ることがある。
- 別の端末・ブラウザを試してみるというのも手。

### ブラウザ版で「Waiting for a PC user to respond」と表示され進まない

- PC版のBetterCrewLinkを起動しているユーザーがいないか、その接続が悪い。

### ブラウザ版で「Waiting for you to join with the name with XXX」と表示され進まない

- Among usのアプリでルームに参加していなければする。
- ルームIDまたはプレイヤー名が間違っている可能性がある。
- プレイヤー名が日本語の場合うまくいかない可能性が高いのでアルファベットに変更する。
- たまに名前を変えるとなおる。

### 特定の人の声がだけが聞こえない

- Windows版・ブラウザ版ともにリロードすると治ることがある。

## 参考サイト

- [OhMyGuus/BetterCrewLink: Free, open, Among Us Proximity Chat](https://github.com/OhMyGuus/BetterCrewLink)
