---
layout: blog
title: Google製の正規表現ライブラリ「RE2」をpythonで動かす - 2025版
date: 2025-08-14
draft: false
tags:
  - python
  - django
---
[Google製の正規表現ライブラリ「RE2」をpythonで動かす](/post/2020/06/re2/) という記事を5年前に書いたが、いろいろと状況が変わっていたので最新の状況を記す。

前述の記事で用いていた `fb-re2` がpip install時にビルドでコケてしまうようになった。

Claudeに要約させたところこのようなことらしい。
- システムのAbseilライブラリがC++14以上を要求
- fb-re2のビルドスクリプトがC++11を指定
つまり、Ubuntuのバージョンが更新されたことによって、最新の環境でビルドができなくなってしまった。しばらく更新されていなかったことによる、互換性問題が発生していそう。

気付いたらGoogle公式が re2をPyPIに公開しており、これがメンテナンスされているので、これに切り替えてみる。

https://pypi.org/project/google-re2/

- `google-re2` 2022年10月25日にv1.0がリリース
- `fb-re2` 2019年2月8日を最後にリリースされていない

google-re2を使ってみることで、ビルドが成功した。

## 差異

バージョン `fb-re2` → `google-re2` へ変更した際にたまたま発見した差異。

`fb-re2` は `re2.error` がそのまま `re.error` を差していたが、 `gooogle-re2` では別物のオブジェクトになっている。まあこれが問題になることはないと思うが……

検証結果。uvはこういう検証に便利。

```sh
uv run --isolated --no-project --with fb-re2 python -c "import re;import re2;print(re.error is re2.error)"
>>> True
uv run --isolated --no-project --with google-re2 python -c "import re;import re2;print(re.error is re2.error)"
>>> False
```

## まとめ

- `fb-re2` はもう古いので `google-re2` を使おう。

## References

- [google\-re2 · PyPI](https://pypi.org/project/google-re2/)
- [fb\-re2 · PyPI](https://pypi.org/project/fb-re2/)
- [google/re2: RE2 is a fast, safe, thread\-friendly alternative to backtracking regular expression engines like those used in PCRE, Perl, and Python\. It is a C\+\+ library\.](https://github.com/google/re2)