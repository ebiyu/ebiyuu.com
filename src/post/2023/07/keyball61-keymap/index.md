---
layout: blog
title: keyball61のキーマップが固まってきた
date: 2023-07-15
tags:
  - gadget
---

[Keyball61を組んだ](/post/2023/06/keyball61/) のつづき。

いろいろと試行錯誤してキーマップが固まってきたので紹介する。


## キーマップ

Remapでキーマップしていたが、キーマップが固まってきたのでQMK firmwareでキーマップを定義してみた。

[keymap\.c](https://github.com/ebiyuu1121/keyball/blob/main/qmk_firmware/keyboards/keyball/keyball61/keymaps/ebiyuu1121/keymap.c)

- Layer1: テンキーレイヤ
- Layer2: マウス用レイヤ
- Layer3: カーソル用レイヤ

のイメージで組んでいる。

ポイントとしては

- スクロールはLayer3に割り当てている。
- vimmerなので左手親指にescキーを置いている
- 右手の親指にはBackspace/Enterを置いている。誤爆すると怖いキーなのでLong tapキーは入れていない
- 右下に `-` キーを置いている(指じゃなくて手のひらで押す)
- 片手でマウスを操作するために、右下にLayer2/3のキーを置いている。
- Layer2に `ctrl` ( + `shift` ) + `tab` を置いて、ブラウザ等のタブ切り替えが楽にできるようにしている
- 数字を楽に入力したいので、テンキーレイヤを用意
  - Layer2に置いている左手テンキーはいま実験中。左手テンキーで慣れればLayer1を削除できる
- Layer3の左側にトラックボール関係の調整キーを導入

```c
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
  [0] = LAYOUT_universal(
    KC_ESC   , KC_1     , KC_2     , KC_3     , KC_4     , KC_5     ,                                  KC_6     , KC_7     , KC_8     , KC_9     , KC_0     , KC_EQL   ,
    KC_TAB   , KC_Q     , KC_W     , KC_E     , KC_R     , KC_T     ,                                  KC_Y     , KC_U     , KC_I     , KC_O     , KC_P     , KC_BSLS  ,
    KC_LCTL  , KC_A     , KC_S     , KC_D     , KC_F     , KC_G     ,                                  KC_H     , KC_J     , KC_K     , KC_L     , KC_SCLN  , KC_QUOT  ,
    KC_LSFT  , KC_Z     , KC_X     , KC_C     , KC_V     , KC_B     , KC_LBRC  ,            KC_RBRC  , KC_N     , KC_M     , KC_COMM  , KC_DOT   , KC_SLSH  , MO(3)    ,
    _______  , _______  , KC_LALT  , KC_LGUI  ,MO(1), LT(2,KC_SPC), LT(3,KC_ESC),           KC_BSPC  , KC_ENT   , _______  , _______  , _______  , _______  , LT(2, KC_MINS)
  ),

  [1] = LAYOUT_universal(
    _______  , _______  , _______  , _______  , _______  , _______  ,                                  _______  , _______  , _______  , _______  , _______  , _______  ,
    _______  , _______  , KC_7     , KC_8     , KC_9     , _______  ,                                  _______  , KC_7     , KC_8     , KC_9     , _______  , _______  ,
    _______  , _______  , KC_4     , KC_5     , KC_6     , _______  ,                                  _______  , KC_4     , KC_5     , KC_6     , _______  , _______  ,
    _______  , KC_0     , KC_1     , KC_2     , KC_3     , _______  , _______  ,            _______  , KC_0     , KC_1     , KC_2     , KC_3     , KC_DOT   , _______  ,
    _______  , _______  , _______  , _______  , _______  , _______  , _______  ,            KC_BSPC  , KC_ENT   , _______  , _______  , _______  , _______  , _______
  ),

  [2] = LAYOUT_universal(
    _______  , KC_F1    , KC_F2    , KC_F3    , KC_F4    , KC_F5    ,                                  KC_F6    , KC_F7    , KC_F8    , KC_F9    , KC_F10   , KC_F11   , 
    _______  , _______  , KC_7     , KC_8     , KC_9     , _______  ,                                  _______  , _______  , _______  , _______  , _______  , KC_F12   ,
    _______  , _______  , KC_4     , KC_5     , KC_6     , _______  ,                                  _______  , KC_BTN1  , KC_BTN3  , KC_BTN2  , _______  , _______  ,
    _______  , KC_0     , KC_1     , KC_2     , KC_3     , _______  , _______  ,             _______ , _______  ,RCS(KC_TAB), _______ , C(KC_TAB), _______  , _______  ,
    _______  , _______  , _______  , _______  , _______  , _______  , _______  ,             KC_BTN4 , KC_BTN5  , _______  , _______  , _______  , _______  , KC_GRAVE
  ),

  [3] = LAYOUT_universal(
    _______  , _______  , _______  , _______  , _______  , _______  ,                                  _______  , _______  , _______  , _______  , _______  , _______  ,
    _______  , _______  , _______  , _______  , _______  , _______  ,                                  KC_HOME  , KC_PGDN  , KC_PGUP  , KC_END   , _______  , _______  ,
    _______  , _______  , CPI_D1K  , CPI_D100 , CPI_I100 , CPI_I1K  ,                                  KC_LEFT  , KC_DOWN  , KC_UP    , KC_RIGHT , _______  , _______  ,
    _______  , _______  , _______  , SCRL_DVI , SCRL_DVD , _______  , KBC_SAVE ,            KBC_RST  , _______  , _______  , _______  , _______  , _______  , _______  ,
    _______  , _______  , _______  , _______  , _______  , _______  , _______  ,            KC_DEL   , KC_ENT   , _______  , _______  , _______  , _______  , _______
  ),
};

```

## Automatic Mouse Layer

結果的に導入しなかったが、記録として残しておく。

1. [かみだいさんのファームウェア](https://github.com/kamiichi99/keyball/blob/main/qmk_firmware/keyboards/keyball/readme.md)が有名。
2. QMKのファームウェアを0.19以上に上げることで公式での対応が可能([参考](https://wonwon-eater.com/keyball44/))

今回は後者をやってみた。

結果的に、誤爆が頻発したのでやめた。


## テンティング

キーマップとは直接関係ないけど前書き忘れたので。

[Amazonで売っていたタブレットスタンド](https://www.amazon.co.jp/gp/product/B083LTGX1N/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1) を2つ買ってみた。

0度・30度・60度どれもそれぞれよさそうだった。

## References

- [Keyball61ユーザーがKeyball44も作ってみた │ wonwon eater](https://wonwon-eater.com/keyball44/)
- [keyballの自動マウスレイヤーに戻る・進むボタンを追加する方法｜twoboy](https://note.com/twoboy03/n/n791f11d7f261)
- [Keyball39を使いこなすために必要なセッティング │ wonwon eater](https://wonwon-eater.com/keyball39/)
- [Tavi's Travelog \- QMKファームウェアの書き込み by Ubuntu \- Claw44 ビルドログ03](http://blog.tavi-travelog.net/2020/04/24/claw44-buildlog-03)
- [keyball/qmk\_firmware/keyboards/keyball/readme\.md at main · kamiichi99/keyball](https://github.com/kamiichi99/keyball/blob/main/qmk_firmware/keyboards/keyball/readme.md)

