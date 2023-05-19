---
layout: dotfiles.njk
title: wezterm
---

# Wezterm

[Wezterm](https://wezfurlong.org/wezterm/) はターミナルエミュレータです。

うれしい点としては

- tmux相当のターミナルマルチプレクサ(タブ・ペイン)機能
- Nerdfontが一緒にインストールされる
- luaで設定可能
- Sixel対応

あたり。

## 設定ファイル

[~/.config/wezterm](https://github.com/ebiyuu1121/dotfiles/tree/master/dot_config/wezterm) 以下に設定ファイルを置く。

`~/.config/wezterm/wezterm.lua` が設定ファイルとなる。

とりあえず設定ファイルを作って基本的な設定をする。

```lua
-- wezterm.lua
local wezterm = require("wezterm")

return {
    font_size = 10.0,
    color_scheme = "Arthur",
    use_ime = false,
}

```

IMEが有効になっていて日本語が入力されたりするとダルいので、
ターミナル上ではIMEが無効になるようにしておく。

ターミナル上の日本語入力には skkeleton(後述)を活用する予定。

フォントサイズと[カラーテーマ](https://wezfurlong.org/wezterm/config/appearance.html)も適当に設定しておく。

## References

- [WezTerm \- Wez's Terminal Emulator](https://wezfurlong.org/wezterm/)
- [Installation \- Commentary of Dotfiles](https://coralpink.github.io/commentary/wezterm/installation.html)

