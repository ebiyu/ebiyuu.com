---
layout: blog
title: pecoが文字化けする問題
date: 2024-11-06
tags:
  - linux
---

バグを引いたので記録用に

- 2024/11/6現在
- Ubuntu24.04にて、aptでインストールしたpecoにて発生。

`peco` を実行すると "?????????" と表示され、画面表示が崩れる。

同様の現象は発生していて、aptパッケージが壊れているらしい。

- cf. [Ubuntu24.04 LTSにpecoをインストールしたら文字化けしたが、apt経由ではなく直接githubから落とすことで文字化け解消できた](https://zenn.dev/mato/scraps/2b0c423ad9da2c)

[GitHub](https://github.com/peco/peco) から直接入れる。
今回はgoが入っていたので `go install` で入れる。

```sh
go install github.com/peco/peco/cmd/peco@latest
```

にて解決。

releaseからバイナリを落としてきてもいいらしい。

## References

- cf. [Ubuntu24.04 LTSにpecoをインストールしたら文字化けしたが、apt経由ではなく直接githubから落とすことで文字化け解消できた](https://zenn.dev/mato/scraps/2b0c423ad9da2c)
