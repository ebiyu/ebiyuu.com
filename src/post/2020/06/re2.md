---
layout: blog
title: "Google製の正規表現ライブラリ「RE2」をpythonで動かす"
date: 2020-06-24T05:27:05+09:00
---

python で Google の正規表現ライブラリ「RE2」を使いたかったが、インストールで困ったのでメモ。

## RE2 とは

RE2 は Google によって開発されている正規表現ライブラリ。

[google/re2: RE2 is a fast, safe, thread\-friendly alternative to backtracking regular expression engines like those used in PCRE, Perl, and Python\. It is a C\+\+ library\.](https://github.com/google/re2)

> RE2 was designed and implemented with an explicit goal of being able to handle regular expressions from untrusted users without risk. One of its primary guarantees is that the match time is linear in the length of the input string. It was also written with production concerns in mind: the parser, the compiler and the execution engines limit their memory usage by working within a configurable budget – failing gracefully when exhausted – and they avoid stack overflow by eschewing recursion.
>
> <cite>[https://github.com/google/re2/wiki/WhyRE2](https://github.com/google/re2/wiki/WhyRE2)</cite>

高速な正規表現ライブラリで、計算量が入力文字列の長さに対して線形になるアルゴリズムを採用している。正規表現の計算量を利用した[ReDoS 攻撃](https://qiita.com/prograti/items/9b54cf82a08302a5d2c7)を防げるらしい。

詳細は下の記事に詳しく書いてあった。

<figure class="wp-block-embed is-type-rich is-provider-hatena-blog">

<iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fnaoyat.hatenablog.jp%2Fentry%2F2012%2F01%2F12%2F220812" title="高速かつ省メモリなGoogleの正規表現ライブラリ re2 についてのメモ - naoya_t@hatenablog" class="embed-card embed-blogcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 190px; max-width: 500px; margin: 10px 0px;"></iframe>

</figure>

## インストールする

### pip でインストールしてみる

何も考えずに pip でインストールしてみた。

<pre class="wp-block-preformatted shell">$ pip install re2</pre>

インストールに失敗した。

<pre class="wp-block-preformatted shell">_re2.cc:37:10: fatal error: re2/re2.h: No such file or directory
     #include <re2/re2.h>
              ^~~~~~~~~~~
    compilation terminated.
    error: command 'gcc' failed with exit status 1</pre>

### 本体のインストール

ちゃんとドキュメントを読んでみる。

[re2 · PyPI](https://pypi.org/project/re2/)

[axiak/pyre2: Python wrapper for RE2](https://github.com/axiak/pyre2)

GitHub の readme にちゃんと書いてあった。

> To install, you must first install the prerequisites:
>
> - The [re2 library from Google](http://code.google.com/p/re2/)
> - The Python development headers (e.g. *sudo apt-get install python-dev*)
> - A build environment with `g++` (e.g. *sudo apt-get install build-essential*)

RE2 本体のインストールが必要らしい。（python-dev・build-seential はすでに入っていたのか、インストールする必要はなかった）

apt-get からインストールできるようなので利用する。（[参考](https://www.hexacosa.net/blog/detail/120/)）

```
$ sudo apt-get install -y re2 $ pip install re2
```

無事インストールが完了した。

公式リポジトリでは `easy_install` の使用が推奨されていたようだが、[easy_install は deprecated なようなので](https://setuptools.readthedocs.io/en/latest/easy_install.html)今回は pip を採用した。

### うまく行ったと思ったが..

インストールできたかのように思えたが、まだ罠が待っていた。

ドキュメントのとおりに import する。標準の re モジュールをオーバーラップしているので置き換えるだけで同じように動作するようだ。

```
import re2 as re
```

```
File "/code/cms/functions.py", line 1, in import re2 File "re2.pyx", line 1, in init re2 (src/re2.cpp:13681) NameError: basestring
```

エラーが発生してしまった。

[Python3 で re2 を使う](https://stackovernet.xyz/ja/q/12827277)

PyPI 版の re2 モジュールは python3 に対応していないから GitHub から直接 pip でインストールするといいいらしい。

せっかくなので RE2 のリポジトリからリンクを貼られている Facebook のリポジトリのほうがメンテナンスされてイそうなので、こちらからインストールすることにする。

[facebook/pyre2: Python wrapper for RE2](https://github.com/facebook/pyre2)

```sh
$ pip install git+https://github.com/facebook/pyre2
```

無事インストールが完了し、実行することができた。

ベンチマーク結果などは以下の記事にあったので参考までに。

## まとめ

- RE2 本体と Python ラッパーのインストールが必要。
- PyPI でホスティングされているリポジトリ（[axiak/pyre2](https://github.com/axiak/pyre2/issues/34)）が Python3 に対応していないなど、メンテナンスされてない感じがあって残念
- RE2 のリポジトリからリンクされていてそこそこメンテナンスもされている[facebook/pyre2](https://github.com/facebook/pyre2/)を使うと良さそう。
- pip コマンドを使って GitHub から直接インストールすることができる。

## 参考サイト

- [pyre2 を使ってみた | hexacosa.net](https://www.hexacosa.net/blog/detail/120/)
- [Python3 で re2 を使う](https://stackoverrun.com/ja/q/12827277)
- [GitHub のリポジトリを pip install - Qiita](https://qiita.com/mktakuya/items/8e76b9f720dd1d0e02bb)
- [高速かつ省メモリな Google の正規表現ライブラリ re2 についてのメモ - naoya_t@hatenablog](https://naoyat.hatenablog.jp/entry/2012/01/12/220812)
- [RE2：脆弱な正規表現のリスクをゼロにするライブラリ - VELTRA Engineering - Medium](https://medium.com/veltra-engineering/regexp-library-re2-for-fragility-risk-7c28310838e0)
