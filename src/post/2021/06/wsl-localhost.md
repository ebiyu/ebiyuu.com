---
layout: blog
title: "WSLのlocalhostがWindowsから見えない問題"
date: 2021-06-02T13:40:00+09:00
---

WSL でウェブ開発をしている際、Windows 上のブラウザから `http://localhost:3000` とかでアクセスできないことがよくあった。大体再起動すると戻るのだが。

WSL 内から

```sh
$ curl localhost:3000
```

とかするとソースは見えるので、サーバー自体は立ち上がっていそう。

結論としては、Windows の「高速スタートアップ」をオフにすると解決した。再起動時（シャットダウン → 起動とは挙動が違う）は高速スタートアップが無効になるため、再起動でも解決していたようだ。

Linux と Windows をデュアルブートしている場合でも高速スタートアップがよく悪さをするので、無効化しておくのが無難そう。（そんな早くなる実感ないし）

## 参考記事

- [WSL2 内で立ち上げたサーバに Windows 側から localhost で接続する \- Qiita](https://qiita.com/snaka/items/a8eee4cfc8f7d733e6ab)
