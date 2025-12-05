---
layout: blog
title: 分析スクリプト迷子問題を解決する：1成果物＝1スクリプト運用
date: 2025-12-05
draft: false
tags:
  - python
---

Pythonでデータ分析やグラフ作成をしてると、「この図ってどのスクリプト・どの条件で作ったんだっけ？」が多発する。これを解決するために、

- 1成果物1ファイルでスクリプトを作り、
- `__file__` を使うことでスクリプトファイルと成果物を対応させる

運用を紹介する。1年間ほど行ってきて固まってきたものを紹介する。

## これまでの課題

- **スクリプトを書き換えてしまい、どの条件で出した図かわからなくなる**
	- Jupyter Notebookなどを用いている場合も書き換えがちなので同様
- 入力ファイルなどを引数にして管理しても、
	- 最初はパラメータだと思っていなかったところを後から変えたくなったり
	- パラメータが増えていくと実行するのが大変になるなど、
	- どうしても本体のスクリプトを書き換えたくなる
- 修正版を作るためにスクリプトをコピーすると増えていき、**どの成果物がどのスクリプトから出力したものなのか分からなくなってしまう**。

つまり、成果物とスクリプトの紐付けが失われやすいのが課題

## 解決するための運用

### 1成果物1スクリプトの運用にする（一対一ルール）

例えば、`251205_data1_plot.py` というスクリプトは `251205_data1_plot.png` を生成する

- 同じスクリプトで別のデータを出力する際も別のファイルにする
	- これは、後からグラフの文言や縦軸・横軸を変えたくなったりすることがあるため。


### スクリプトは基本的に書き換えずコピーする（イミュータブルルール）

基本スクリプトの書き換えはせず、コピーして新規スクリプトを作る（イミュータブルルール）
コピーして編集してもよいし、「名前をつけて保存」でもよい。

- 可視化の際に試行錯誤するとか、明らかに間違えたとかであればもちろんOK。
- 一方で1週間前作ったグラフを作り直したい、などあればコピーして修正するのがベター。
- イメージとしては、24時間経ったらもう編集しないくらいのイメージ

実際はスクリプトを作成した日付を頭につける運用をしている。
命名が面倒なのでファイルをコピーせず編集しちゃう、といったことが起きうるが、
日付をつけておけばある程度適当な命名でも同じ日付内での重複だけ避ければよい。


### `__file__` で自動的に出力ファイル名を決める

一対一ルールとイミュータブルルールを守るためのテクニック。

- `__file__` を使うことでスクリプトのファイル名を取得できるので、これを用いて出力ファイル名を決定するとファイルと成果物（グラフ画像など）が一対一対応できる
	- また、スクリプトを別名保存した際にはグラフも新しい名前で自動的に作成される。
- `pathlib` の `.with_suffix()` を用いるとこれが簡略に書ける

例: 

```python
from pathlib import Path

import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 8), constrained_layout=True) # example

# plot here

plt.savefig(Path(__file__).with_suffix('.png'))
plt.show()
```

### 共通化はあえてしない

特にプログラミングに慣れている人は前処理や描画の共通化をしたくなるが…

- ただ、もし前処理だけ変えたくなったら？
- 一部だけ変えたくなったときにライブラリ側を変更すると、他のスクリプトの再現性を壊す
- 1ファイルに全部書いておいて、まるごとコピペするのがベスト

そこで、1ファイル完結で書き、必要ならそのままコピペが一番トラブルが少ない。

### 最後に、これらを全部1つのリポジトリに入れる

以下のようなフォルダ構造にしている。

```
data/
	yymmdd_<slug>/       # 実験日と実験内容で分類
		**/*.csv         # 実験データファイル
scripts/
    yymm/                    # 年月で分類
        yymmdd_<slug>.py     # 解析スクリプト（1成果物1スクリプト）
pyproject.toml
```

- 今のところは、全ての生データと解析スクリプトをここに入れている。
	- プロジェクトごとにフォルダを作ってもよいが、「これどこに入れよう？」を毎回考えるのが面倒。
	- 結局日付での管理が最強で思い出しやすい。（参考: スマホのカメラロール）
		- 実験ノートに日付付きでメモしているので辿れる
- Claude codeなどを用いることで、他のスクリプトのデータだけ差し替えたものを作ったりできる。
	- プロンプト例: 「scripts/yymm/yymmdd_analysis1.py を参考にして、 data/yymmdd_exp1/exp1.csv を可視化するスクリプトを作成してください。」
- できればgitで管理する
	- バックアップのため。慣れていなければ定期的に全体をzipしてクラウドにバックアップしておくような運用でも、まあ、よい。
		- イミュータブルルールにより、バージョン管理の重要性が少ない。
	- `data` フォルダはgit管理してもしなくてもよい
		- データが軽量なのであればgit管理しておくとバックアップにもなるし同期が楽
		- 重いのであればLFSや別のクラウドストレージで管理するなどの方法を取ってもよい
	- コミットメッセージは適当
		- コミットメッセージで（内容に関係なくてよいので）日記をつけている。以外と記憶が連想で思い出しやすくてよい。
		- もちろんちゃんとメッセージを書いてもよい。

## AIとの適正もgood

スクリプトが1ファイルで完結していることにより、AIによるコードレビューや修正も用意。

- 「このファイルを直して」とそのまま渡せる
- 文脈が1ファイル内で閉じているため誤解が少ない
- claude codeなどのコーディングエージェントをわざわざ用いずとも、Web上のChatGPTやGeminiなどの画面にコピペすれば済む。

AI支援時代のスクリプト管理としても合理的。
このブログ記事を `CLAUDE.md` などに記載しておいてもよい。

## 差分が確認しづらい問題

「共通化をしない」「gitなどのバージョン管理ツールを使わずにコピペで履歴管理する」ことによって、どの部分を変更したのか忘れてしまったりする。

積極的にdiffをとろう。vscodeであれば右クリックでcompareできるし、コマンドラインだったらdiffコマンドが使える。winmergeなどを使ってもよいだろう。

## まとめ

* **1成果物＝1スクリプト（一対一ルール）** により、スクリプトが迷子にならない
* **スクリプトの変更は基本的に行わないイミュータブルルール** により、再現性を確保

## おまけ

### ファイルの実行が面倒な問題

毎回 `python` コマンドを実行するのが（jupyter notebookなどと比較して）面倒である問題
これに対しては、スクリプトファイルをwatchして保存時に自動的に実行する適当なスクリプトを用意している。

```python
import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os
import threading
from pathlib import Path
import shutil

class PythonFileChangeHandler(FileSystemEventHandler):
    def __init__(self, delay=0.5):
        super().__init__()
        self.delay = delay
        self.timers = {}
        self.last_py_run_time = None  # Last execution time of .py script

    def on_modified(self, event):
        # Cancel existing timer if present
        if event.src_path in self.timers:
            self.timers[event.src_path].cancel()
        # Set a new timer
        timer = threading.Timer(self.delay, self.on_modified_throttled, args=(event.src_path,))
        self.timers[event.src_path] = timer
        timer.start()

        if len(self.timers) > 5:
            for timer in self.timers.values():
                timer.cancel()
            self.timers.clear()

    def on_moved(self, event):
        # Cancel existing timer if present
        if event.dest_path in self.timers:
            self.timers[event.dest_path].cancel()
        # Set a new timer
        timer = threading.Timer(self.delay, self.on_modified_throttled, args=(event.dest_path,))
        self.timers[event.dest_path] = timer
        timer.start()

        if len(self.timers) > 5:
            for timer in self.timers.values():
                timer.cancel()
            self.timers.clear()

    def on_modified_throttled(self, file_path):
        # .venv配下は無視
        if ".venv" in Path(file_path).parts:
            return
        if Path(file_path).resolve() == Path(__file__).resolve():
            return
        self.timers.pop(file_path, None)
        ext = Path(file_path).suffix

        if ext == ".py":
            execute_py(file_path)
            self.last_py_run_time = time.time()
        elif ext == ".yaml" or ext == ".yml":
            print(f"YAML file changed: {file_path}")
            execute_py(file_path.replace(ext, ".py"))
            self.last_py_run_time = time.time()
        elif ext in [".png", ".jpg", ".svg"]:
            # Notify only if updated within 2 seconds after .py execution
            now = time.time()
            if self.last_py_run_time is not None and (now - self.last_py_run_time) <= 2:
                print(f" Updated: {file_path}")

def execute_py(file_path):
    try:
        print(f"Executing {file_path}...", end="", flush=True)
        env = os.environ.copy()
        env["MPLBACKEND"] = "Agg"
        result = subprocess.run(
            [
                "uv", "run", "python",
                "-W", "ignore:FigureCanvasAgg is non-interactive",
                file_path,
            ],
            capture_output=True,
            text=True,
            env=env,
            encoding='utf-8',
            errors='ignore',
        )

        if result.returncode == 0:
            print("done.")
        else:
            print(f"error! (code={result.returncode})")

        if result.stdout:
            print_boxed_output(result.stdout, "stdout")
        if result.stderr:
            print_boxed_output(result.stderr, "stderr")
    except Exception as e:
        print(f"Failed to execute {file_path}: {e}")

def print_boxed_output(text: str, title: str = "Output"):
    # Get terminal width, fallback to 60 if not available
    try:
        width = shutil.get_terminal_size().columns
    except Exception:
        width = 60
    min_width = 30
    width = max(width, min_width)
    # Box drawing
    head = f" {title} " + "─" * (width - len(f" {title} ") - 1) + "┐"  # -2 for right corner
    tail = " └" + "─" * (width - 3) + "┘"
    print(head)
    for line in text.rstrip().split("\n"):
        content = line.ljust(width - 5)  # │ と │ で2文字、先頭の│ とスペースで2文字
        print(f" │ {content} │")
    print(tail)

if __name__ == "__main__":
    path = os.path.join(os.getcwd(), "scripts")  # scripts directory
    if not os.path.exists(path):
        print(f"Error: scripts directory not found at {path}")
        exit(1)
    event_handler = PythonFileChangeHandler(delay=0.5)
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)

    print(f"Monitoring .py files in {path} for changes...")
    try:
        observer.start()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

```