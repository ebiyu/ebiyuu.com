---
layout: blog
title: GASでのHtmlServiceがJavaScriptを壊すバグ
date: 2026-06-08
draft: false
tags:
  - GAS
---

*Special thanks to claude Opus 4.8.*

## 結論（先に要点だけ）

Google Apps Script のウェブアプリ（`createHtmlOutputFromFile`）では、インライン `<script>` 内で次の **3要素が揃うと、配信時にコードが破壊される**。

1. オブジェクトリテラル `{ ... }` の中であること
2. その値に、`/` を含むテンプレートリテラルがあること（例：`` `${a}/${b}` ``）
3. その**後方**に、別の `/` を含む文字列の値があること（例：`"c/d"`）

このとき GAS の配信時サニタイズがテンプレートリテラル内の `/` を正規表現の開始と誤認し、後方の `/` までを巻き込んで以降のトークン判定をずらす。結果、後ろにある別の文字列（`"https://..."` など）の `//` を行コメントと誤認して行末ごと削除し、**閉じられない文字列**が残る。ブラウザ（Firefox）ではこうなる。

```
Uncaught SyntaxError: "" string literal contains an unescaped line break
```

### 環境

- 2026/06/08 16:00現在
- Google Apps Script ウェブアプリ（`createHtmlOutputFromFile`、IFRAME サンドボックス）
- デプロイは webブラウザへ入力、Claspでのデプロイでも同様の結果
- 確認ブラウザ：Firefox（`SyntaxError: "" string literal contains an unescaped line break`）

### 最小再現

`Code.gs`

```js
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}
```

`Index.html`

```html
<!DOCTYPE html>
<html>
<head></head>
<body>
<script>
  function f(){
    var a = "a", b = "b";
    var o = {
      param1: `${a}/${b}`,   // /入りテンプレートリテラル
      param2: "c/d"          // 後方の /入り文字列
    };
    return "https://example.com/";
  }
  document.body.textContent = f();
</script>
</body>
</html>
```

`doGet` で上記を返すウェブアプリをデプロイし `/exec` を開くと、期待は `https://example.com/a/bc/d` の表示だが、実際は画面が出ず `SyntaxError`。

devtoolで見た実際のソース（抜粋）がこれ。

```
param1:`$\x7ba\x7d\/$\x7bb\x7d`,\\n      param2: \\\x22c\/d\\\x22\\n    \x7d;\\n    return \\\x22https:\\n  \x7d\\n  document.body.textContent \x3d f()
```

`return "https:` で切り詰められ、`//example.com/...` 以降と閉じクォートが消えている。


### 直し方

トリガーである「テンプレートリテラル内の生 `/`」を消すだけでいい。

```javascript
// before
dates: `${a}/${b}`,

// after（連結に変える）
dates: a+"/"+b,

// もしくはエスケープ（テンプレートリテラルでも \/ は / と同じ）
dates: `${a}\/${b}`,
```

URL 側の `//` を `\/\/` にエスケープしても症状は止まるが、それは結果を消しているだけ。根っこはテンプレートリテラルの `/` なので、そちらを断つほうが確実で、ファイル内の他のテンプレートリテラルでの再発も防げる。

---

## 余談：ここにたどり着くまで

デバッグはClaudeに逐次状況を報告しながら行った。
このチャット履歴をもとに、Claudeにデバッグ記録を生成してもらった。

### きっかけ

開発していたカレンダー追加URLを組み立てる関数を足したら、ページが真っ白になった。足したのはこんなコード（抜粋）。

```javascript
function gcalUrl(rec){
  const day  = String(rec.date||"").replace(/-/g,"");
  const s    = String(rec.start||"").replace(":","")+"00";
  const e    = String(rec.end||"").replace(":","")+"00";
  const eq   = eqName(rec.equipId)||rec.equip||"装置";
  const text = eq+(rec.who ? `（${rec.who}）` : "");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: text,
    dates: `${day}T${s}/${day}T${e}`,
    ctz: "Asia/Tokyo",
    location: eq
  });
  if(rec.note) p.set("details", rec.note);
  return "https://calendar.google.com/calendar/render?" + p.toString();
}
```

`node --check` には通る。**構文的には完全に有効なES6**。なのにブラウザでは構文エラー。ここが出発点だった。

### エラーの意味

`string literal contains an unescaped line break` は Firefox のメッセージで、**通常のクォート文字列（`"…"` や `'…'`）の途中に行終端文字がある**ときだけ出る。テンプレートリテラルは内部に改行を許すので、このエラーは出さない。つまり犯人はバッククォートではなく、「普通のクォート文字列が閉じる前に行終端に達している」こと。だが手元のコードにそんな文字列は見当たらない。

### 外した仮説 その1：不可視文字

最初に疑ったのは、コピペや日本語入力で紛れ込む不可視の行終端文字（生のCR、`U+2028`、`U+2029`）。これらは diff では改行に見えないのに JS では行終端扱いになり、文字列内にあるとこのエラーになる。ファイル走査スクリプトまで作ったが、該当なし。ハズレ。

### 外した仮説 その2：GAS が `//` を削っている

次に「実際に配信されたコード」を見た。問題の行はこう切れていた。

```
  if(rec.note)p.set("details",rec.note);
  return "https:
}
```

`return "https:` で切れ、`//calendar...` 以降が閉じクォートごと消えている。`//` を行コメントと誤認して行末まで削った典型的な症状だ。「GAS のサニタイズが文字列内の `//` を削っているのでは」と考えた。状況証拠（手元は無傷・配信物だけ破損）も揃っていた。

だがこれもハズレ。最小再現で覆った。

```html
<script>
  var u = "https://example.com/test";
  document.body.textContent = u;
</script>
```

これは普通に表示された。GAS は `//` を含む文字列をちゃんと配信する。

### 方針転換：差分を二分探索

ここで推測をやめた。確実なのは矛盾だけ——「最小再現の `//` は無事、実コードの `//` は壊れる」。同じ `//` なのに片方だけ壊れるなら、原因は `//` 自体ではなく_差分_にある。あとは最小再現を実コードへ一歩ずつ近づけ、壊れた瞬間に足した要素を犯人にすればいい。`clasp push` → `/exec` の同じ経路で二分探索した。

| テスト                 | 内容                                            | 結果      |
| ------------------- | --------------------------------------------- | ------- |
| 最小                  | `"https://..."` 単独                            | 動く      |
| `dates` の `/` を別文字に | `` `${day}T${s}/${day}T${e}` `` の `/` を `X` に | 動く      |
| トップレベルに2変数          | `/`入りテンプレートリテラル + `/`入り文字列をオブジェクト無しで並べる       | 動く      |
| `{ dates }` 単独      | オブジェクトに `/`入りテンプレートリテラル1個だけ                   | 動く      |
| `{ a, dates }`      | 手前にプロパティを足す                                   | 動く      |
| `{ dates, ctz }`    | `/`入りテンプレートリテラルの**後方**に `/`入り文字列を足す           | **壊れる** |

最後の一手で再現した。あとは要素を削って、冒頭の「3条件」まで絞り込んだ。

### 二分探索が示したこと

結果はすべて、冒頭のメカニズム（誤読した正規表現が後方の `/` まで飲み込んでトークン判定をずらす）と整合した。

- テンプレートリテラルが無い／`/` を含まない → 誤読が始まらない → 壊れない
- 後方に `/` を含む文字列が無い → 誤読した「正規表現」が終端を見つけられない → 壊れない（トップレベルでも、後方の `/`文字列が無い構成では再現しなかった）
- 3つ揃って初めて、ずれが `//` を含む後続文字列まで届いて破壊する

## 教訓

- **「構文的に正しい」と「実際に動く」は別物。** 手元ではなく「実際に配信されたソース」を見るのが決定打だった。
- **エラーメッセージは正確に読む。** 「文字列内の行終端」という意味を取り違えなければ、テンプレートリテラルが無関係だと早く切れたはず。
- **推測で犯人を決めない。** 二回外したあと、最小再現の二分探索に切り替えて一直線に進んだ。「壊れる構成」と「壊れない構成」の差分を一つずつ詰めるのが結局いちばん速い。
- **最小再現は資産。** 30行近いコードが十数行・3条件まで削れ、そのままバグ報告の本体になった。

## 環境

- Google Apps Script ウェブアプリ（`createHtmlOutputFromFile`、IFRAME サンドボックス）
- デプロイは clasp
- 確認ブラウザ：Firefox（`SyntaxError: "" string literal contains an unescaped line break`）

クライアントJSはブラウザで動くので本来 ES6 テンプレートリテラルは問題なく動く。ところが GAS は配信前にインラインJSをサニタイズしており、その処理がテンプレートリテラルを取りこぼす、というのが落とし穴だった。