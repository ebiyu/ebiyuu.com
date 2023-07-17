---
layout: blog
title: キー入力一発でDiscordのマイクミュートをするi3wmの設定d
date: 2023-07-18
---

通話をしている時に、マイクミュートにすぐしたいタイミングというのは定期的に発生する。

今回は、Linuxのタイル型居ウィンドウマネージャーのi3wmを使って、
Discord上にフォーカスが当たっていなくてもキー入力一発で
Discordのミュート・ミュート解除ができるようにする。


## 環境

- Ubuntu 20.04
- i3 version 4.22

## xdotool の導入

今回は、 discordアプリに `ctrl` + `shift` + `m` のキー入力を送ることでミュートを行う。

Linux上で、特定のwindowにキー入力を送ることができる `xdotool` をインストールする。

```sh
sudo apt install xdotool
```

## 設定

`~/.config/i3/config` 内に以下を記入する。

```
# mute/unmute on discord
bindsym $mod+m exec xdotool search --onlyvisible --name discord windowactivate --sync key --clearmodifiers ctrl+shift+m
```

この状態で `super` + `m` を入力すると、Discordのウィンドウがアクティブになってミュートされる。

## まとめ

便利になった。
Linux+i3を使っていると、このような設定が簡単にできるのがとてもよい。

もちろんこの方法は他のソフトでも可能なので、便利な設定を探していきたい。

## References

- [xdotool コマンド全２６実例 – console dot log](https://blog.capilano-fw.com/?p=3477)
- [xdotoolでGUIツールの操作をする　その２：ウィンドウ検索とアクティブ化 \- Bye Bye Moore](https://shuzo-kino.hateblo.jp/entry/2020/06/23/235617)
