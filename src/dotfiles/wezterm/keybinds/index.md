---
layout: dotfiles.njk
title: wezterm/キーマップ
---

# キーマップ

[Key Binding \- Commentary of Dotfiles](https://coralpink.github.io/commentary/wezterm/keybind.html) を参考に設定していく。

## 設定ファイルを作る。

以下は `~/.config/wezterm` 以下で作業する。


```sh
wezterm show-keys --lua > keybinds_default.lua
```

でデフォルトキーマップを [keybinds_default.lua](https://github.com/ebiyuu1121/dotfiles/blob/master/dot_config/wezterm/keybinds_default.lua) として出力できる。


`keybinds.lua` は `keybinds_default.lua` をコピーして、キーマップを全部削除しておく。
必要なものだけ追加して設定していく。


```lua
-- keybinds.lua
local wezterm = require 'wezterm'
local act = wezterm.action

return {
  keys = {
    --
  },
  key_tables = {
    copy_mode = {
      --
    },
    search_mode = {
      --
    },
  }
}

```

## 設定ファイルを読み込む

今作成したファイルを `wezterm.lua` から読み込む。

```diff-lua
 -- wezterm.lua
 local wezterm = require("wezterm")
 
 return {
+    keys = require('keybinds').keys,
+    key_tables = require('keybinds').key_tables,
+    disable_default_key_bindings = true,
     font_size = 10.0,
     color_scheme = "Arthur",
     use_ime = false,
 }
```

これで、キーバインド設定の準備が整った。

```sh
vim -O keybinds.lua keybinds_default.lua

```

で左右分割で開いて、 `keybinding_default.lua` から `keybinding.lua` にコピペで移していく。

## LEADER

tmuxを使っていたので、tmuxっぽいキーバインディングにする。

LEADERキーを設定する。

```diff-lua
 -- wezterm.lua
 local wezterm = require("wezterm")
 
 return {
+    leader = { key = 's', mods = 'CTRL', timeout_milliseconds = 2000 },
     keys = require('keybinds').keys,
     key_tables = require('keybinds').key_tables,
 ...
```

LEADERを使ってキーバインドを設定する。

```diff-lua
 -- keybinds.lua
 ...
 return {
   keys = {
+    { key = 'h', mods = 'LEADER', action = act.ActivatePaneDirection 'Left' },
+    { key = 'j', mods = 'LEADER', action = act.ActivatePaneDirection 'Down' },
+    { key = 'k', mods = 'LEADER', action = act.ActivatePaneDirection 'Up' },
+    { key = 'l', mods = 'LEADER', action = act.ActivatePaneDirection 'Right' },
+
+    { key = "-", mods = 'LEADER', action = act.SplitVertical { domain = 'CurrentPaneDomain' } },
+    { key = "'", mods = 'LEADER', action = act.SplitHorizontal { domain = 'CurrentPaneDomain' } },
+
+    { key = '[', mods = 'LEADER', action = act.ActivateCopyMode },
+    { key = ']', mods = 'LEADER', action = act.PasteFrom 'Clipboard' },
   },
 ...
```

`key_tables.copy_mode` はほぼデフォルトのコピーで、tmuxっぽい挙動をする。

一行だけ、Enterキーでコピーできるように書き換える。
 
```diff-lua
 -- keybinds.lua
   key_tables = {
     copy_mode = {
       { key = 'Tab', mods = 'NONE', action = act.CopyMode 'MoveForwardWord' },
       { key = 'Tab', mods = 'SHIFT', action = act.CopyMode 'MoveBackwardWord' },
+      { key = 'Enter', mods = 'NONE', action = act.Multiple{ { CopyTo =  'ClipboardAndPrimarySelection' }, { CopyMode =  'Close' } } },
-      { key = 'Enter', mods = 'NONE', action = act.CopyMode 'MoveToStartOfNextLine' },
       { key = 'Escape', mods = 'NONE', action = act.CopyMode 'Close' },
       ...
       { key = 'DownArrow', mods = 'NONE', action = act.CopyMode 'MoveDown' },
     },
     ...
```


## References

- [WezTerm \- Wez's Terminal Emulator](https://wezfurlong.org/wezterm/)
- [Installation \- Commentary of Dotfiles](https://coralpink.github.io/commentary/wezterm/installation.html)

