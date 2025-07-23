---
layout: blog
title: ESP32のADCで連続読み出しをする
date: 2025-07-23
draft: false
tags:
---
ESP32のADCは、シングル読み取りモード（通常の `analogRead` ）の他に連続読み出しモードがある。
ADC側で一定周期でサンプリングを実施してくれるモードであり、今回はサンプリング間隔を一定にしたかったため利用した。

開発には PlatformIO + Arduino core を利用している。

## 概要をつかむ

[ADC API ドキュメント](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/adc.html を参照しながら実装する。

1. `analogContinous()` で初期化
	- `sampling_freq_hz` サンプリング周波数、最終的に出力されるデータ
	- `conversions_per_pin` 上のサンプリング周波数の1周期あたり、何回計測を行うか
2. `analogContinuousStart()` で連続読み出しを開始
3. `analogContinuousRead()` で計測した値を読み出す
	- 第二引数でタイムアウトを指定 (ms)
	- データが読み出せれば `true` 、タイムアウトが発生すれば `false` が返される。


スケッチ例は以下のようになる。
 以下の例では `sampling_freq_hz = 1000` 、  `conversions_per_pin = 20` なので、1kHzで`Serial.println` が呼ばれ、またそれぞれの計測では20回のサンプリングが実施されておりその平均が出力される。

```cpp
void setup() {
  Serial.begin(115200); // Initialize the serial port

  pinMode(A0, INPUT);  // Set pin A0 as input
  
  uint8_t pins[] = {A0};  // Define the pins to read
  size_t pinCount = sizeof(pins) / sizeof(pins[0]);
  uint32_t conversions_per_pin = 20;  // Set the number of conversions per pin
  uint32_t sampling_freq_hz = 1000;  // Set the sampling frequency in Hz

  // Start continuous analog reading
  analogContinuous(pins, pinCount, conversions_per_pin, sampling_freq_hz, NULL);
  analogContinuousStart();

  Serial.println("ADC initialization completed.");
}

void loop() {
  adc_continuous_data_t *buffer = nullptr;  // Buffer to hold ADC data

  if (analogContinuousRead(&buffer, 1000)) {
    // Read the latest data from the buffer
    adc_continuous_data_t *data = &buffer[0];

    Serial.println(data->avg_read_mvolts);
  }
}
```

なお、周波数指定の範囲は 20 kHz～2 MHz となっている（[esp\-idf/components/soc/esp32/include/soc/soc\_caps\.h at master · espressif/esp\-idf](https://github.com/espressif/esp-idf/blob/master/components/soc/esp32/include/soc/soc_caps.h#L138-L139)）。

## バージョンの問題

上記の方針でコードを書こうとしたが、 `analogContinous` などの関数が定義されておらずコンパイルエラーとなる。

調べてみたところ、ESP-IDFのバージョンがv3以降ではないとAPIが用意されていないっぽい。
- [ESP32 ADC Continuos mode? \- Projects / Programming \- Arduino Forum](https://forum.arduino.cc/t/esp32-adc-continuos-mode/1212920/3)

PlatformIOでインストールされているバージョンはv2系となっている。
PlatformIOでは最新のesp-idfが使えないらしい。
- 参照: [PlatformIOとEspressifの対立：コミュニティによる開発の現状](https://zenn.dev/kyjb/articles/6950231b231643)


PlatformIOフォークの[platformio/platform\-espressif32](https://github.com/platformio/platform-espressif32) では最新版がメンテナンスされている。

`platformio.ini` のplatform欄に以下のように記述する。

```ini
platform = https://github.com/pioarduino/platform-espressif32/releases/download/stable/platform-espressif32.zip
```

これでコンパイルを通すことができ、実際に動作することを確認することができた。

## References

- [ADC \- \- — Arduino ESP32 latest documentation](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/adc.html)
- [ESP32 ADC Continuos mode? \- Projects / Programming \- Arduino Forum](https://forum.arduino.cc/t/esp32-adc-continuos-mode/1212920/3)
- [PlatformIOとEspressifの対立：コミュニティによる開発の現状](https://zenn.dev/kyjb/articles/6950231b231643)
- [platformio/platform\-espressif32: Espressif 32: development platform for PlatformIO](https://github.com/platformio/platform-espressif32)
- [esp\-idf/components/soc/esp32/include/soc/soc\_caps\.h at master · espressif/esp\-idf](https://github.com/espressif/esp-idf/blob/master/components/soc/esp32/include/soc/soc_caps.h#L138-L139)