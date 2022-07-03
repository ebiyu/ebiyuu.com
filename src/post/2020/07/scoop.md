---
layout: blog
title: "Windowsのscoopが便利という話"
date: 2020-07-01T05:44:54+09:00
---

windows でプログラミングをやる人全員におすすめしたいパッケージ管理ツール「scoop」を紹介する。

## 「パッケージ管理ツール」とは

僕はもともと mac ユーザーであるが、mac には有名なパッケージ管理ツール「homebrew」がある。（Linux だと`yum`やら`apt`やらがある。）

パッケージ管理ツールはソフトウェアのインストール&管理（そしてそのソフトウェアを動かすのに必要なソフトのインストール）を行ってくれる便利ツールである。特に手動でやると色々面倒な環境構築をコマンド一発でできるので便利なのだ。

mac の場合、

```
$ brew install python3 $ brew install php
```

などのように実行するだけで環境が構築できる（mac で homebrew を使ってない人は使いましょう）

## Windows のパッケージ管理ツール

Windows のパッケージ管理ツールとして有名なものとしては Chocolatey や Scoop があるらしいので調べてみた。

### Chocolatey

[https://chocolatey.org/](https://chocolatey.org/)

一番有名らしいが、ネットで下調べしたところ

- 毎回管理者権限を要求される
- アンインストールによく失敗する

などの短所が書いてあったので見送った。（パッケージ管理ツールを使う理由の一つが楽にアンインストールしたいってことなのでアンインストールできないのは致命的）

### scoop

[https://scoop.sh/](https://scoop.sh/)

Linux のパッケージ管理ツールをイメージしてる作られたらしい。

[https://blog.satotaichi.info/scoop/](https://blog.satotaichi.info/scoop/)

このブログが一番わかりやすかった。

Docker も入ったりするらしい。

[https://qiita.com/watahani/items/9551e22e0f9d42c35672](https://qiita.com/watahani/items/9551e22e0f9d42c35672)

### Windows Package Manager

[https://devblogs.microsoft.com/commandline/windows-package-manager-preview/](https://devblogs.microsoft.com/commandline/windows-package-manager-preview/)

Microsoft が公式に開発しているパッケージ管理ツールのようである。今後のスタンダードになるといいなあと思いつつ、今回は情報が少ないということで見送った。

## 試した

scoop をインストールしてみた。

### インストール

公式サイトを参考にしてインストールする。

[https://scoop.sh/](https://scoop.sh/)

Powershell（管理者として実行）で以下のコマンドを実行するだけ。

```
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh') # or shorter iwr -useb get.scoop.sh | iex
```

実行に失敗した場合は下のコマンドで実行ポリシーをする必要があるらしい。（僕は必要なかった）

```
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
```

### 使ってみる

```
$ scoop install php $ scoop install iverilog
```

特に時間は測ってないけど結構速くインストールできた。

## まとめ

- 今回は scoop をインストールしてみた
- ちょっと使ってみた感じ使いやすかった。
- そのうち、汚れた windows 環境を一旦クリーンインストールして scoop で環境構築したい。
