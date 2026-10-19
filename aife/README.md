# BridgeWell World — AIFE 2026 版（/aife/）

AIFE 2026（シンガポール）展示用の英語ページです。トップページ（`../index.html`）と旧モデル（`../models/`）、旧QRコードとは独立しています。

## 構成

```
aife/
├─ index.html            英語ページ（model-viewer で3D表示＋AR）
├─ qr.html               このページ（…/aife/）のQRコードを表示
├─ css/aife.css          デザイン（トップページと同じ見た目・独立したファイル）
├─ js/aife.js            施設一覧・視点移動・AR非対応時の案内
└─ models/
   ├─ bridgewell_aife.glb    Web・Android AR用（glTF 2.0）
   ├─ bridgewell_aife.usdz   iPhone/iPad の AR Quick Look 用
   └─ facilities.json        施設名・英語説明・色・位置
```

## モデルを作り直す手順

1. Unityで `Assets/BridgeWellWorld/Scenes/BridgeWell_World_AIFE.unity` を保存しておく
2. メニュー **BridgeWell > Export AIFE Web Model (GLB)** を実行
   → `WebViewer/aife/models/` の `bridgewell_aife.glb` と `facilities.json` を書き出す（旧モデルには触れません）
3. USDZ を作る（Python 3 + numpy）
   ```
   python Tools/glb_to_usdz.py WebViewer/aife/models/bridgewell_aife.glb WebViewer/aife/models/bridgewell_aife.usdz
   ```

## 書き出し時の軽量化

- 球・カプセル・円柱を、大きさに応じた低ポリゴン版に置き換え（見た目はほぼ同じ）
- 同じグループ・同じ素材の部品を1つにまとめて描画回数を削減
- 施設名の看板は画像として焼き込み（正面＝Welcome看板側から読みやすい向き）
- 浮遊小島・ドローン・ホログラムなどの動きは、静止状態で書き出し
- 雲（シーンの `Sky`）は旧版と同じく含めない（ARで机の上に浮かないようにするため）

## 公開予定URL

`https://yamashitachisako.github.io/bridgewell-world-ar/aife/`
