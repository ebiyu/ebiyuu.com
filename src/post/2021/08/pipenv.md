---
layout: blog
title: "pipenvのススメ"
date: 2021-08-23T19:31:25+09:00
---

## pipenvとは

環境ごとにパッケージの管理ができるツール。npm・yarnのpython版

### Dockerとの比較

- ホストのpythonを用いるので軽い
- devcontainerを用いなくてもVSCodeが自動的に読み込んでくれる（後述の `.vev` ファイルが必要）
- Pythonモジュール以外にインストールの必要がない場合はDockerより良さそう。

### 具体的な挙動

- `Pipfile` に依存パッケージが記述される。 (`package.json` に該当)
- `Pipfile.lock` に実際にインストールされたバージョンが記述される→環境による差異を防ぐ (`package.lock`や`yarn.lock`に該当)

↑これらをgitにコミットすることで環境を共有できる

## インストール

```sh
pip install pipenv
```

pyenvとの連携が便利

## 主要コマンド
```sh
pipenv --python 3.8 # 初期化 pyenvが入っていると該当のpythonバージョンを読み込んでくれる。 (npm init)
pipenv install pandas # パッケージのインストール (npm install --save libname)
pipenv install black --dev # 開発用モジュールをinstall (npm install --save-dev libname)
pipenv sync --dev # Pipfile.lockからインストール（cloneしたら基本これ） (npm install)
pipenv install --dev # Pipfileを使ってinstall（Pipfileを手動で編集してパッケージを追加した場合に実行する）
pipenv shell # pipenvの環境内に入る（vscodeのターミナルなら自動で実行してくれる）
```

## .venv の生成

VSCodeで補完を効かせるために必要

`.bashrc`や`.bash_profile` に記述。
```bash
export PIPENV_VENV_IN_PROJECT=true
```

## 参考
- [Python：VSCode で pipenv 仮想環境にインストールしたライブラリの補完を効かせる - pyてよn日記](https://pyteyon.hatenablog.com/entry/2019/10/03/182407)
- [Pipenvを使ったPython開発まとめ - Qiita](https://qiita.com/y-tsutsu/items/54c10e0b2c6b565c887a)
