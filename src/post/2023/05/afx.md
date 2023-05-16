---
layout: blog
title: cliマネージャ "afx" を試す
date: 2023-05-16
---


[b4b4r07/afx: 📦 Package manager for CLI](https://github.com/b4b4r07/afx/)を使ってみる。

yamlファイルをもとに、宣言的にツールのインストールができるらしい。zplugの作者の作。
現状では GitHub / GitHub Release / Gist / HTTP (web) / Local からのインストールに対応している。


## インストール

Goで書かれている。 `go install` でもインストールできるようだが、
インストールスクリプトが用意されていたので今回はそちらを試す。

```sh
curl -sL https://raw.githubusercontent.com/b4b4r07/afx/HEAD/hack/install | bash

```

実行したところ、インストールスクリプトが上手く動かなかったため、PRを出しておいた。

- [fix: fix install script by ebiyuu1121 · Pull Request \#59 · b4b4r07/afx](https://github.com/b4b4r07/afx/pull/59)

また、コマンドを実行したところ設定ディレクトリが存在せず、エラーとなったため、 `~/.config/afx` を作成した。

なお、エラーになるのは不自然だと思ったので、こちらもPull-requestを作成しておいた。

- [Create ~/\.config/afx if not exist by ebiyuu1121 · Pull Request \#60 · b4b4r07/afx](https://github.com/b4b4r07/afx/pull/60)

この後、 `.zshrc` に以下の2行を追記する。

```sh
# set up afx
type afx > /dev/null 2>&1 && eval "$(afx init)"
type afx > /dev/null 2>&1 && eval "$(afx completion zsh)"
```



## neovimをビルドしてみる

以下のyamlを `~/.config/afx/github.yaml` に配置する。


```yaml
github:
- name: neovim/neovim
  description: Vim-fork focused on extensibility and usability
  owner: neovim
  repo: neovim
  branch: master
  with:
    depth: 1
  command:
    build:
      steps:
      - make CMAKE_BUILD_TYPE=RelWithDebInfo
    env:
      EDITOR: nvim
    alias:
      vi: nvim
    link:
      - from: build/bin/nvim
```

この状態で `afx install` を実行し、ビルドに成功した。


![afx-nvim](../img/afx-nvim.png)

gitリポジトリは `~/.afx/github.com` 以下に展開されていた。
このうち、yamlの `link` で指定したバイナリが `~/bin` へとリンクされていた。


![afx-nvim2](../img/afx-nvim2.png)

## まとめ

ビルドの自動化ができて便利そうだった。
今後はchezmoiとの連携、各種環境でのビルドに取り組みたい。

にしても、 `afx` は検索ノイズが多かった。

## References

- [新しいコマンドラインツール向けのパッケージマネージャ \| tellme\.tokyo](https://tellme.tokyo/post/2022/03/02/package-manager-for-cli/)
- [neovim/neovim: Vim\-fork focused on extensibility and usability](https://github.com/neovim/neovim)
- [b4b4r07/afx: 📦 Package manager for CLI](https://github.com/b4b4r07/afx)
- [AFX](https://babarot.me/afx/)
