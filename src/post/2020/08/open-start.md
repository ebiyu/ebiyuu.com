---
layout: blog
title: "macのopenコマンドとwindowsのstartコマンド"
date: 2020-08-24T04:51:50+09:00
---

## mac の場合

mac のターミナルには `open` というコマンドがある。例えば

```
$ open .
```

とすると現在のフォルダを Finder で開くし、

```
$ open doc/html/index.html
```

とすればブラウザで html でファイルを開いたり、

```
$ open logo.png
```

とすると画像ファイルをプレビューアプリで開いたりする。

要はファイルをダブルクリックした時と同じ動作になる。ファイルを簡単に確認するのに便利なのでぜひ覚えておきたい。

## Windows の場合

これは最近知ったのだが、windows にも `start` コマンドがある。

git bash の場合

```
$ start .
$ start doc/html/index.html
$ start logo.png
```

コマンドプロンプトの場合

```
> start .
> start doc\html\index.html
> start logo.png
```

などと、 `open` コマンドと同等の事ができる。

フォルダを開く場合は直接 explorer を呼ぶことができる。

git bash の場合

```sh
$ explorer doc
$ explorer doc\\html # ファイル名は\\で区切る必要がある
```

コマンドプロンプトの場合

```
> explorer doc
> explorer doc\html
```

## WSL の場合

WSL からフォルダを開く場合は、前述の `explorer` が使える。ただし、ちゃんと `eplorer.exe` と指定しないといけない。

```
$ explorer.exe .
```
