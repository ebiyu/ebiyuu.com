---
layout: blog
title: ghとghq(+peco)で作る快適git環境
date: 2023-03-15
---


## 紹介するもの

### [gh](https://cli.github.com/)

- GitHubの公式cliクライアント。少し前には `hub` とかあったけどもうghで十分。
- `gh repo view -w` 現在のリポジトリをwebで表示
- `gh pr create` 現在のブランチからpull-requestを作成
- `gh repo create` リポジトリを作成
- `gh run watch` 現在実行中のGithub actionsを表示・監視

### [ghq](https://github.com/x-motemen/ghq)

- gitでcloneしたフォルダをフォルダ管理してくれる優れもの。「あのフォルダどこにcloneしたんだっけ？」がなくなる。
    - 「とりあえずリポジトリcloneして中見たい！」みたいなときにも考えることが減るのが良いポイント。
- 例えば `https://github.com/ebiyuu1121/ebiyuu.com/` だったら自動的に `~/ghq/github.com/ebiyuu1121/ebiyuu.com/` にcloneされる。
    - 上記の例だと `ghq get -p ebiyuu1121/ebiyuu.com` でcloneできる。
    - 自分のリポジトリだったらユーザー名も省略できるので、 `ghq get -p ebiyuu.com` で十分。
- 各種コマンドもあり、例えば `ghq list | ghq get --update --parallel` でローカルの全リポジトリを最新状態にできます。
- [ghq-handbook](https://github.com/Songmu/ghq-handbook/tree/master/ja) が分かりやすいのでおすすめです。

### peco

- ghqでcloneしたフォルダに移動するときに、pecoでインタラクティブにリポジトリを選択するのが便利。
- これに関しては設定して使ってみてください。

## 設定

書いてないOS・環境は公式サイト参照。

### git

- windows: `scoop install git`
- ubuntu: `sudo apt install git`
- mac: XCode command line toolsに付属

### gh

- windows: `scoop install gh`

### ghq

- goのインストール
    - win: `scoop install go`
    - ubuntu: `sudo apt install golang`
- `go install github.com/motemen/ghq`

### peco

- windows: `scoop install peco`
- ubuntu: `apt install peco`
- mac: `brew install peco`

### .zshrc

以下をzshrcに追記

`ctrl` + `]` で起動してcdできます。

```sh
function peco-src () {
local selected_dir=$(ghq list -p | peco --query "$LBUFFER")
if [ -n "$selected_dir" ]; then
    BUFFER="cd ${selected_dir}"
    zle accept-line
fi
}
zle -N peco-src
bindkey '^]' peco-src
```
