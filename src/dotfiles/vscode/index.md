---
layout: dotfiles.njk
title: dotfiles
---
VSCode: GUIのエディタ。

あまり設定はしていません。
なぜなら環境ごとに再現するのが面倒だったり、同期機能があるものの不安定で気付いたら同期が切れていたり、また環境ごとに設定を変えたかったり……

## 設定

`settings.json` に記述しているもののうち、重要なもの（こだわりのあるもの）だけ載せます。

```json
{
    // 空白文字を表示する
    "editor.renderWhitespace": "all",
    "editor.renderControlCharacters": true,
    
    // 親ディレクトリのgitリポジトリを検出する。モノレポの子ディレクトリをVSCodeで開く時などに便利。
    "git.openRepositoryInParentFolders": "always",

    // ターミナルでpythonのvenvが有効にならない(uvを主に使っていて、uv runをするので不要)
    "python.terminal.activateEnvironment": false,
    
    // ファイルツリーまわりの設定
    // ファイルツリーのフォルダをクリックしただけでは開かない。フォルダを選択する際に邪魔なので。ダブルクリックで開く。
    "workbench.tree.expandMode": "doubleClick",
	// ファイルツリーのインデントを見やすく
    "workbench.tree.renderIndentGuides": "always",
    "workbench.tree.indent": 15,
    // ファイルツリーの挙動変更
    "explorer.autoReveal":"focusNoScroll",
    // フォルダの省略表示をしない
    "explorer.compactFolders": false,
    
    // ターミナルまわりの設定（お節介機能の削除）
    // sticky scrollは不安定なので無効化
    "terminal.integrated.stickyScroll.enabled": false,
    // Ctrl+Pなどがターミナルで効くようになる
    "terminal.integrated.sendKeybindingsToShell": true,
}
```

## 拡張機能

拡張機能は最低限にしています。入れるのが面倒なので……

- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
- [Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)

あと言語ごとの拡張などは都度必要になるたびに入れる運用としています。

