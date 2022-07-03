---
layout: blog
title: "WindowsからsshでGUIを表示したメモ"
date: 2021-06-15T14:41:51+09:00
---

## `~/.ssh/config` の記述内容

```
Host hogehoge
    ForwardX11 yes
    ForwardX11Trusted yes
```

は記述しておく。

## VcXsrc のインストール

VcXsrv を Windows 側で起動しておく。

また、起動時のオプションで `-ac` を指定する。

## WSL での試行

普段 SSh クライアントは WSL 上の ssh を使っているので、何も考えず WSL で接続を試みた。

`.bashrc`に以下を記述しておくとよいとのこと。

```bash
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0
```

これで動くはずだったが、動かなかった。エラーも出ず何も起きない状況。

## Powershell での試行

WSL->Windows の通信がうまくいっていなさそうなのでシンプルに Windows 側の ssh クライアントで接続する。（最初からそうすればよかった）

```
$env:DISPLAY="localhost:0.0"
ssh hoge
```

すると、

```
ssh_askpass: posix_spawn: No such file or directory
```

とのエラーメッセージが。

```
mkdir \dev
echo x > \dev\tty
```

を実行すれば良いらしいので実行したところうまく接続でき、GUI も表示された。

## 参考サイト

- [WSL2 における VcXsrv の設定 \- Qiita](https://qiita.com/ryoi084/items/0dff11134592d0bb895c)
- [Linux \- win10 標準の openSSH を使って、リモートの Ubuntu に X11 Forwarding したい｜ teratail](https://teratail.com/questions/246584)
- [win10 に同梱の OpenSSH で ssh すると失敗するときの対処 \- Qiita](https://qiita.com/jyomu/items/4bdb99776e88b7670026)
