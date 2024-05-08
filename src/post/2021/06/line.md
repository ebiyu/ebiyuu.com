---
layout: blog
title: "LINEのトーク履歴を解析する"
date: 2021-06-07T19:04:17+09:00
---

LINE のトーク履歴を解析して、累計通話時間・メッセージ数をグラフ化するコードを書いたのでせっかくなので公開する。

解析してみると新しい発見があっておもしろいかもしれない。

## ソースコード(gist)

トーク履歴をエクスポートした txt ファイルを同じフォルダに配置してから実行してください。

```python
import re
import datetime
import matplotlib.pyplot as plt

data = []

filename = input("input filename (before \".txt\") > ")

with open(filename + ".txt", "r", encoding="utf_8_sig") as f:
    lines = f.read().split('\n')

if m := re.match(r"\[LINE\] Chat history with (.*)", lines[0]):
    YOU = m.groups()[0]
elif m := re.match(r"\[LINE\] (.*?)とのトーク履歴", lines[0]):
    YOU = m.groups()[0]
else:
    print("cannot detect name")
    exit()

for line in lines:
    if m := re.match(r"(\d\d\d\d)\/(\d+)\/(\d+)", line):
        y, m, d = m.groups()
        if len(data) == 0:
            data.append({
                "date": datetime.date(int(y), int(m), int(d)),
                "chat": {
                    "me": 0,
                    "you": 0,
                }, 
                "call": {
                    "me": 0,
                    "you": 0,
                },
            })
        else:
            data.append({
                "date": datetime.date(int(y), int(m), int(d)),
                "chat": {
                    "me": data[-1]["chat"]["me"],
                    "you": data[-1]["chat"]["you"],
                },
                "call": {
                    "me": data[-1]["call"]["me"],
                    "you": data[-1]["call"]["you"],
                },
            })
    elif m := re.match(r"\d+:\d+\t(.*?)\t", line):
        is_me = m.groups()[0] != YOU
        if len(data) == 0:
            continue

        if is_me:
            data[-1]["chat"]["me"] += 1
        else:
            data[-1]["chat"]["you"] += 1
        if m := re.search(r"Call time ((\d+):)?(\d+):(\d+)", line) or re.search(r"通話時間 ((\d+):)?(\d+):(\d+)", line):
            _, h, m, s = m.groups()
            if is_me:
                data[-1]["call"]["me"] += int(h or 0) + int(m or 0) / 60 + int(s or 0) / 3600
            else:
                data[-1]["call"]["you"] += int(h or 0) + int(m or 0) / 60 + int(s or 0) / 3600

fig = plt.figure()
ax1 = fig.add_subplot(211)

plt.stackplot(
    list(map(lambda row:row["date"], data)),
    list(map(lambda row:row["call"]["me"], data)),
    list(map(lambda row:row["call"]["you"], data)),
    colors=["blue", "red"],
)
plt.legend(["ME", "YOU"], loc="upper left")
plt.xlabel("date")
plt.ylabel("time [h]")
plt.grid()

ax2 = fig.add_subplot(212)

plt.stackplot(
    list(map(lambda row:row["date"], data)),
    list(map(lambda row:row["chat"]["me"], data)),
    list(map(lambda row:row["chat"]["you"], data)),
    colors=["blue", "red"],
)
plt.legend(["ME", "YOU"], loc="upper left")
plt.xlabel("date")
plt.ylabel("count")
plt.grid()

plt.tight_layout()
plt.savefig(filename + ".png")
plt.show()
```

