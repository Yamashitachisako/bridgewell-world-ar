# BridgeWell World AR — Webビューア（サンプル版）

Unityで作った `BridgeWell_World_Town` を、スマートフォンのブラウザで3D表示し、対応端末ではARで机の上に置けるようにしたサンプルです。

## 仕組み

```
Unity (BridgeWell_World_Town)
   │  メニュー: BridgeWell > Export Web Model (GLB)
   ▼
WebViewer/models/bridgewell_town.glb   ← glTF 2.0 バイナリ（約3.2MB）
WebViewer/models/facilities.json       ← 施設名・説明・色・位置
   │
   ▼
index.html（Google model-viewer）
   ├─ 通常の3D表示：全端末（指で回転・拡大縮小）
   ├─ Android：WebXR（Chrome）または Scene Viewer でAR
   └─ iPhone/iPad：Quick Look でAR（GLBからUSDZをブラウザ内で自動変換）
```

| フォルダー / ファイル | 内容 |
|---|---|
| `index.html` | ビューア本体 |
| `css/style.css`, `js/app.js` | デザインと施設一覧・視点移動 |
| `models/` | Unityから書き出したモデルと施設データ |
| `qr.html` | 表示中のURL（または入力したURL）のQRコードを表示 |
| `start-local-server.bat` | Windowsでのローカル確認用サーバー |

## Unityからモデルを書き出し直す

1. Unityで `Assets/BridgeWellWorld/Scenes/BridgeWell_World_Town.unity` を開く（開いていなくても可）
2. メニュー **BridgeWell > Export Web Model (GLB)** を実行
3. `WebViewer/models/` の2ファイルが更新される（シーン自体は変更されません）

## Windows PCでの確認

1. `WebViewer/start-local-server.bat` をダブルクリック（Python 3 が必要）
   - 初回はWindowsファイアウォールの確認が出ます。スマホでも確認する場合は「プライベートネットワーク」を許可してください。
2. ブラウザ（Chrome / Edge）で `http://localhost:8000/` を開く
3. マウスドラッグで回転、ホイールで拡大縮小、施設カードのクリックでその施設に移動

> `index.html` をダブルクリックして直接開く（file://）と、モデルを読み込めません。必ずサーバー経由で開いてください。

## スマートフォンでの確認（同じWi-Fi）

1. PCで `start-local-server.bat` を起動し、表示された `http://192.168.x.x:8000/` を確認
2. PCのブラウザで `http://192.168.x.x:8000/qr.html` を開き、表示されたQRコードをスマホで読み取る
3. 指1本で回転、2本指で拡大縮小できます

> **この方法ではARは使えません。** ブラウザのARは安全な接続（HTTPS）が必要なためです。ARの確認は次の「公開」を行ってください。

## 公開（HTTPS・無料）— ARを試すために必要

おすすめは **GitHub Pages**（無料・HTTPS・.glbを正しい形式で配信）です。

1. GitHubで新しいリポジトリを作成（例: `bridgewell-world-ar`、Public）
2. `WebViewer` フォルダーの**中身**をリポジトリ直下にアップロード
   （ブラウザの「Add file > Upload files」にドラッグ＆ドロップでも可）
3. リポジトリの **Settings > Pages** で、Source を「Deploy from a branch」、Branch を `main` / `(root)` にして保存
4. 数分後に `https://<ユーザー名>.github.io/bridgewell-world-ar/` で公開されます
5. 公開URLの `qr.html` を開くと、そのURLのQRコードが表示されます。印刷・配布に使えます

その他の無料の選択肢：Netlify（フォルダーをドラッグ＆ドロップで公開）、Cloudflare Pages。

> 公開するとURLを知っている人は誰でも閲覧できます。社外秘の内容が含まれていないか確認してから公開してください。

## ARの動作（端末による違い）

| 端末 | 方式 | 備考 |
|---|---|---|
| Android（ARCore対応、Chrome） | WebXR → 失敗時は Scene Viewer | ページ内でそのままAR。机などの平面をスキャンしてタップで配置 |
| iPhone / iPad（iOS 12以降、Safari） | Quick Look | 別画面のAR表示。床・机に自動配置、ピンチで拡大縮小 |
| PC・AR非対応端末 | 3D表示のみ | 「AR非対応」のお知らせを表示 |

- 実寸は島の直径が約33cm（机に置けるサイズ）。AR内でピンチして大きさを変えられます。
- 島の下に透明な支えを入れてあり、ARでも机から少し浮いて見えます。

## 制約（このサンプル版で再現していないもの）

- **雲・ホログラムの動き**：静止したモデルとして書き出しています（雲は含めていません）
- **施設ラベル**：画像として島に固定しています。Unityのように常にカメラを向くことはなく、正面（Welcome看板側）から読みやすい向きです
- **光の見え方**：Unity(URP)のライトやブルームは引き継がれません。ブラウザ側の標準ライティングで表示します
- **iPhoneのAR**：USDZへの自動変換のため、発光（街灯・ラボの光）は弱く見える場合があります
- **建物タップでアプリを開く機能**：今回は未実装（`facilities.json` と GLB内の施設ノード名を使って次の段階で追加できます）

## 使用している外部ライブラリ（無料・オープンソース）

- [model-viewer](https://modelviewer.dev/) 4.0.0（Google, Apache-2.0）— `ajax.googleapis.com` から読み込み
- [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) 1.4.4（MIT）— `cdnjs.cloudflare.com` から読み込み
