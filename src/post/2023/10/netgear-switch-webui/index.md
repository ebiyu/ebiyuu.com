---
layout: blog
title: NETGEAR アンマネージドプラススイッチのWeb UIにアクセスすると拒否される問題の解決ログ
date: 2023-10-16
tags:
  - network
---

## 結論

MTU=1500に設定する必要がある。

## 状況

NETGEAR アンマネージドスイッチ (GS308E・GS108PEv3) にWebブラウザのUIでアクセスしようとしたところ、
"Connection Refused" と表示されてアクセスできない。
curlコマンドでもNG。pingは通る。

LAN内の他のPCでWebブラウザでのアクセスを試したところ、接続できた。

## 解決策

PC側のMTU設定を1500に変更したところ、正常に接続することができた。

<details>
<summary>nmcliでの設定例</summary>

(nmcliをつ)

```sh
nmcli con modify etherner1 802-3-ethernet.mtu 1500
nmcli con down etherner1
nmcli con up etherner1
```

</details>

MTUまわりの実験をした後に設定を戻していなかったので設定が変わっていたのが原因。

スイッチがMTU=1500しかサポートしておらず、それ以外に設定されている場合はTCPの接続を確立しない実装になっているっぽい。
(SYNパケットを送ると、ACK/RSTが返ってくる。)
そんな実装ありかよ……

## 参考

- [Re: GS108PE Web access refused \- NETGEAR Communities](https://community.netgear.com/t5/Managed-Switches/GS108PE-Web-access-refused/m-p/2126745)
