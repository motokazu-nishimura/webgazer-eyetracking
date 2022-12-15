# webgazer-eyetracking
[WebGazer.js](https://webgazer.cs.brown.edu/)を使ったアイトラッキングのサンプルです。
キャリブレーションの操作と、アイトラッキング中のタブを録画し重ね合わせるためのデータを生成できます。

ユーザビリティテストでアイトラッキング計測するためのツールです。詳細は以下を参照してください。
https://zenn.dev/motokazu/articles/ba65d6be70370c

# 設定方法
[WebGazer.js](https://webgazer.cs.brown.edu/)から、WebGazer.jsをダウンロードして取得して、eyetracking.htmlがあるディレクトリに配置してください。


# 起動方法
pythonのHTTPサーバーなどを起動し、ブラウザで eyetracking.html を開きます。

```zh
python -m http.server
```

# 使用方法
ブラウザで eyetracking.html を開きます。

## キャリブレーション
`start calibration`をクリックして、キャリブレーションを開始します。9つ表示される黄色い点に目線とマウスカーソルを合わせてクリックするのを全てに対して2回ずつ行ってください

## タブ録画
`record`をクリックすると、録画を開始できます。録画を終了すると自動的に、動画ファイル(webm)がダウンロードされます。
