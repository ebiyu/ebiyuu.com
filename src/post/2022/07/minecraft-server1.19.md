---
layout: blog
title: AWSでminecraftサーバーを立てる (1.19)
date: 2022-07-17
tags:
  - minecraft
---

AWS EC2でminecraftのサーバーを構築した。
遊ぶ時だけ起動する運用なら時間課金制のEC2は便利。

## インスタンスの選択

今回は少人数でのプレイを想定していたため、 `t3.meduim` を選択。

インスタンスの作成からsshの設定までは省略する。

また、Security Groupを編集して25565番ポートを開けておく。

## JDKのインストール

Minecraft server 1.19はJDK18を要求している。

今回はAWSが用意しているJDKディストリビューションである[Amazon Corretto](https://docs.aws.amazon.com/corretto/latest/corretto-18-ug/generic-linux-install.html#rpm-linux-install-instruct)を利用した。

```sh
sudo rpm --import https://yum.corretto.aws/corretto.key
sudo curl -L -o /etc/yum.repos.d/corretto.repo https://yum.corretto.aws/corretto.repo
sudo yum install -y java-18-amazon-corretto-devel
```

## サーバーのインストール

今回はバニラサーバーではなく、modのインストールなどができる非公式の[Spigot](https://www.spigotmc.org/)をインストールした。

インストール時にgitが必要になるのでこちらもインストールしておく。

```
sudo yum install -y git
wget https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar
java -jar BuildTools.jar --rev 1.19
```

## 起動スクリプトの設定

起動用のシェルスクリプトファイルを作成する。


```sh
vi start.sh
```

`start.sh` に以下の内容を記入する。

```sh
#!/bin/sh
java -Xmx3500M -Xms2048M -jar /home/ec2-user/minecraft/spigot-1.19.jar nogui
```

```sh
chmod 755 start.sh
./start.sh
```

サーバーが起動すれば成功。 `eula.txt` の編集を求められる。

## デーモン化

`screen` などを用いて永続化してもいいが、今回はインスタンスの起動時に自動で起動・クラッシュ時に自動で再起動するよう、 `systemd` に登録する。

```sh
sudo vi /etc/systemd/system/minecraft.service
```

```
[Unit]
Description = Minecraft server

[Service]
ExecStart = /home/ec2-user/start.sh
WorkingDirectory=/home/ec2-user
Restart = always
Type = simple

[Install]
WantedBy = multi-user.target
```

保存できたら、

```sh
sudo systemctl start minecraft
```

で起動確認をする。正常に起動できていれば、サービスを有効化する。

```sh
sudo systemctl enable minecraft
```

サーバーログは

```sh
systemctl status minecraft
```

で(一部)確認が可能。

## Slack通知

起動前・終了時にSlackのimcoming webhookを用いて通知を送るため、 `start.sh` を以下のように編集したが、これは必須ではない。

EC2インスタンスから `169.254.169.254` にリクエストを送るとインスタンス情報が取得できるため、これを利用してIPアドレスを取得している。
ElasticIPを割り当てていない場合、毎回起動ごとにIPアドレスが変わるのでSlackで共有しておくと便利である。

```sh
#! /bin/sh
cd `dirname $0`

function notify_slack () {
  curl -XPOST -H Content-Type:application/json -d "{\"text\":\"$1\"}" <webhook url> >/dev/null 2>&1
}

function on_exit () {
  notify_slack "Minecraft server stopped\\nIP Address: \`$ip_addr\`"
}

ip_addr=`curl '169.254.169.254/latest/meta-data/public-ipv4/' 2>/dev/null`

notify_slack "Minecraft server starting\\nIP Address: \`$ip_addr\`"
trap on_exit EXIT

java -Xmx3500M -Xms2048M -jar /home/ec2-user/spigot-1.19.jar nogui | while read -r line
do
  echo $line
  if [[ $line == *joined\ the\ game* ]]; then notify_slack "$line"; fi
  if [[ $line == *left\ the\ game* ]]; then notify_slack "$line"; fi
  if [[ $line == *Done* ]]; then notify_slack "Server started!"; fi
done;
```

## 参考リンク

- [【Minecraft for AWS】 EC2インスタンスでMinecraftサーバーを構築 \| DevelopersIO](https://dev.classmethod.jp/articles/minecraft-for-aws_ec2-instance/#toc-8)
- [https://docs.aws.amazon.com/corretto/latest/corretto-18-ug/generic-linux-install.html#rpm-linux-install-instruct Amazon Corretto 18 Installation Instructions for Debian-Based, RPM-Based and Alpine Linux Distributions - Amazon Corretto 18]
- [SpigotMC \- High Performance Minecraft](https://www.spigotmc.org/)
- [Minecraft のマルチサーバでログイン通知を Slack / Discord / LINE に送る \| hgrs's Blog](https://blog.hgrs.me/20200223233018)
- [シェルスクリプトでtry\-catch\-finallyを実装する方法 │ Web備忘録](https://webbibouroku.com/Blog/Article/shell-try-catch-finally)

