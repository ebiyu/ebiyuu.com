---
layout: blog
title: 【2025年版】Pythonパッケージ管理の決定版「uv」- 覚えることは4つだけ
date: 2025-08-26
draft: false
tags:
---
今流行りのPythonのパッケージマネージャー "[uv](https://docs.astral.sh/uv/)" が便利でとりあえず全員に使ってほしい。「昨日まで動いていたコードが突然エラーになった」 「同僚にコードを渡したら動かなかった」 「venv使ってるけど、activateが面倒」といった経験がある人は特に見てください。

この記事はそこまでPythonをガチで使っていない人（解析でPythonを使う研究者など）、パッケージ管理をやったことない人に向けた記事です。

## とにかく使ってほしい

覚えるのは以下の4つだけ。

1. 最初にプロジェクトフォルダを作ったら `uv init` を実行
2. `pip install {package}` の代わりに `uv add {package}` でパッケージをインストール
3. `python {script}.py` の代わりに `uv run python {script}.py` で実行
	- `uv run {script.py}` と省略可能
4. 人にスクリプトを渡すときはフォルダごと（ `pyproject.toml` と一緒に）渡す

## 今までのパッケージ管理との比較

なぜuvが良いのか、今までのパッケージ管理手法と比較して解説する。

### （手法1） pip install だけをする

`pip install matplotlib` など、pipを使うことで様々なパッケージをインストールすることができるのがPythonのいい所である。そのため、必要になったタイミングで `pip install` すれば実行できる、という運用をしている人が多いと思う。

普段はこれでいいものの、突然Pythonのコードが動かなくなった経験がある人も少なくないと思う。そして、Pythonのコードが急に動かなくなる原因の9割は依存パッケージによるものである。これが起こる1つのストーリーを紹介する。

- スクリプトAのために、 `pip install X` によってパッケージX v1.0 を入れた。
- 1年後に、スクリプトBのためにパッケージYを入れ、無事スクリプトBを動かすことができた。
	- しかし、パッケージYはパッケージX v2.0に依存しており、自動的に パッケージX v2.0がインストールされた。
- その後にスクリプトAを実行しようとしたが、パッケージX v1.0 ではなく v2.0 がインストールされていたため、エラーとなってしまった。
	- 当時に使っていたパッケージXのバージョンを記録していなかったため、復旧することができなかった。

最近起きた事例だと、[numpyのv2.0のリリース](https://github.com/numpy/numpy/releases/tag/v2.0.0) が2024年にあって、この現象が起きた。例えば X=numpy、Y=matplotlib など。

また、他の例だと、機械学習によく用いるPyTorchは厳密にバージョンを指定しないと動作が変わってしまうことがあるため、勝手に変わっては困ることがある。

### （手法2）venvを使う

このような困りごとはよくあることであるため、pythonにはvenvという仕組みが標準搭載されている。venv（仮想環境）をプロジェクトごとに作成し、その中に `pip install` することで、前述したような別のプロジェクトの影響による不具合は起こらなくなる。

venvを使う際は以下のような流れになる。

```sh
python -m venv venv # `venv` ディレクトリに仮想環境を作成して
./venv/bin/activate # 仮想環境を有効化して
pip install matplotlib # パッケージを入れて
python script.py # 実行したいスクリプトを実行して
deactivate # 仮想環境から出る
```

ディレクトリを指定して（今回は `venv` ディレクトリ）仮想環境を作成し、そこにパッケージをインストールする。

`venv` は十分な機能であり、 `venv` だけで運用している人も多い。しかし、以下のような困りごともある。

- `venv` をアクティベートし忘れる
	- スクリプトを実行する前にactivateを忘れると、エラーが発生したり、
	- `pip install` をする前にactivateを忘れるとPC全体にインストールされてしまったりする。
	- まあ忘れなければよいが。
- venvのディレクトリ名を忘れる
	- `venv` /  `.venv` などが慣例的に用いられるが、それ以外の名前も指定できるため、フォルダ名を忘れてしまう。見ればいいんだけどね。
- 必要なパッケージのリストを手動で管理しないといけない
	- pip installはあくまで手動でやるため、例えば別のPCに移動する場合や他人に共有する場合はパッケージのリストを共有する必要がある。
	- なお、このための仕組みはちゃんとpipに容易されており、
		- `pip freeze > requirements.txt` でパッケージのリスト（ `requirements.txt` ）を作成しておく。
		- `pip install -r requirements.txt` で、リストを元にインストールできる。
	- 新しいパッケージを入れたものの `requirements.txt` の更新を忘れていて、パッケージが足りなかったりなどもよく起こる。

このように、まあ十分使えるんだが、覚えることが多くて大変。
なので、初心者ほど uv を使うのがいいと思っている。
## uvの使い方

再掲するが、覚えるのは以下の4つだけ。

1. 最初にプロジェクトフォルダを作ったら `uv init` を実行
2. `pip install {package}` の代わりに `uv add {package}` でパッケージをインストール
3. `python {script}.py` の代わりに `uv run python {script}.py` で実行
	- `uv run {script.py}` と省略可能
4. 人にスクリプトを渡すときはフォルダごと（ `pyproject.toml` と一緒に）渡す
	- gitを使っている場合は、 `pyproject.toml` をコミットする
	- 「 `uv run script.py` で実行」してくださいと伝える。（READMEに書くなど）

実際には上で説明した venv を使っているのだが、

- `uv run` `uv add` 時に、勝手に仮想環境を activate して実行してくれる。
	- 仮想環境が存在しない場合は自動で作成してくれる。
	-  `.venv` という名前で固定になっていて、意識する必要がない。
- 必要なパッケージがない場合は勝手にインストールしてくれる。
- 後述するが、Pythonがない場合ですら勝手にインストールしてくれる。
	- なので、uvを使う場合はPythonのインストールが不要。
- インストールしたパッケージとバージョンは `pyproject.toml`  に勝手に保存される。
	- 明示的に指定していないパッケージのバージョンも `uv.lock` に記録されるため、完全に環境が再現可能である。

つまり、何も意識せずに使えばよい。
ちなみに単純に `pip install` するよりも高速なのでそれだけでも便利。

## uvのインストール

[Installation | uv](https://docs.astral.sh/uv/getting-started/installation/) に従えばインストールができる。

windowsの場合

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```


mac / linux の場合

```sh
curl -LsSf https://astral.sh/uv/install.sh | sh
```

スクリプトを実行したくない場合は、 `winget` や `homebrew` で入れることもできる。

```sh
winget install astral-sh.uv # for windows
brew install uv # for mac
```

## その他の便利機能

さっきの4項目だけを使うだけで、uvの恩恵にあずかることができる。

一方で、uvにはさらにいくつか便利機能があるので、活用例と共に紹介する。

### uvを使ってPythonをインストール

[Python versions | uv](https://docs.astral.sh/uv/concepts/python-versions/#discovery-of-python-versions)

Python自体のインストールをする機能がある。そのため、基本的にはuvさえインストールすればPythonをインストールする必要はない。実行時にPythonがなければ自動でインストールしてくれる。ちなみに、すでにPythonを(例えばmicrosoft storeなどから)インストールしてある場合には、そのPythonをちゃんと参照してくれたりする。

uvではこの仕組みを使って、指定したpythonのバージョンを用いることができる。これによって、Pythonのバージョンが環境によって異なることによる不具合を防ぐことができる。 `uv init` 時に指定する。

```sh
uv init --python 3.11 # Python 3.11を指定
uv python pin 3.11 # すでにinitしている場合には、python pinが使える
```

指定したPythonは `.python-version` ファイルに自動で記録され、uvが勝手に読み取ってくれるため、次回以降は意識せず `uv run` を行うだけで指定したバージョンのPythonで実行される（そのバージョンがなければインストールしてくれる）。

なお、パッと違うバージョンで実行したい時には 

```sh
uv run --python 3.13 script.py
```

と指定して実行ができる。

Pythonのバイナリをパッとインストール
```
uv python install 3.10
uv venv --python 3.10
```

https://docs.astral.sh/uv/pip/environments/

### スクリプト1ファイルで完結させる

依存パッケージの情報は、 `pyproject.toml` に基本的に記載される。一方で、スクリプトファイル1つだけ動かしたいような場合には、わざわざ `pyproject.toml` に記載するのが面倒である。

uvを使うと、ファイル内に依存関係を埋め込むこともできる。 `uv add` 時に `--script` を指定すればよい。

```
uv add --script script.py matplotlib
```

```diff
+# /// script
+# requires-python = ">=3.9"
+# dependencies = [
+#     "matplotlib",
+# ]
+# ///
 import matplotlib.pyplot as plt
 
 x = [1, 2, 3, 4, 5]
 y = [2, 4, 1, 3, 5]
 
 plt.plot(x, y, marker='o')
 plt.xlabel('x-axis')
 plt.ylabel('y-axis')
 plt.grid(True)
 plt.show()
```

実行する側は、何も意識せず今まで通りやればよい。（これが素晴らしい）

```
uv run script.py
```

`.py` スクリプトを共有する場合には依存関係を組み込んでおくと親切。

## 応用例

他にも便利な使い方の例を紹介する。

### Pythonファイルのフォーマット

```
uvx ruff format
```

`uvx` を用いると、パッケージをインストールして実行できる。この機能を用いて、フォーマッタの1つである `ruff` パッケージをインストールすることで簡単にPythonスクリプトのフォーマット（体裁を整えること）ができる。

[Tools | uv](https://docs.astral.sh/uv/concepts/tools/)

### Jupyter notebook (jupyer lab)の実行

```
uv run --with jupyter jupyter lab
```

`uv run` 時に `--with` で指定したパッケージを追加で一時的に（ `pyproject.toml` に追加せずに）インストールして実行することができる。これを活用すると、現在のフォルダの依存パッケージを保ったまま jupyter labを実行することができる。

[Running scripts | uv](https://docs.astral.sh/uv/guides/scripts/)

## まとめ

- パッケージ管理ツールを使うと、パッケージ依存に関するトラブルを避けることができる。
- `uv` では基本的な使いかたを覚えるだけで使うことができる。
- 他にも便利な機能がある。
- とにかく将来の自分や他人のために使ってください。

## References

- [uv official document](https://docs.astral.sh/uv/)
- [uvはinline script metadataを書ける！ Guidesの「Running scripts」を読んだメモ - nikkie-ftnextの日記](https://nikkie-ftnext.hatenablog.com/entry/uv-guides-running-scripts-add-inline-script-metadata)