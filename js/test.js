// グローバルに展開
phina.globalize();
// アセット
var ASSETS = {
  // 画像
  image: {
    // 地面
    'ground': 'https://rawgit.com/alkn203/tomapiko_void/master/assets/image/ground.png',
    'human': './img/human.png',
  },
  spritesheet: {
    "human_ss":
    {
        //フレーム情報
        "frame": {
            "width": 32,
            "height": 32,
            "cols": 3,
            "rows": 4,
        },
        //アニメーション情報
        "animations": {
            //デフォの画像
            "default": {
                "frames": [3],
            },
            //左向き
            "left_walk": {
                "frames": [3,4,5],
                "next": "left_walk",
                "frequency": 4,
            },
            //右向き
            "right_walk": {
                "frames": [6,7,8],
                "next": "right_walk",
                "frequency": 4,
            },
            //上向き
            "up_walk": {
                "frames": [9,10,11],
                "next": "up_walk",
                "frequency": 4,
            },
            //下向き
            "down_walk": {
                "frames": [0,1,2],
                "next": "down_walk",
                "frequency": 4,
            },

        }//animationの終了
    }//human_ssの終了
  }//spritesheetの終了
};
// 定数
var SCREEN_WIDTH   = 640; // 画面横サイズ
var SCREEN_HEIGHT  = 640; // 画面縦サイズ
var PLAYER_SIZE    = 64;  // プレイヤーのサイズ
/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit({
      // 画面サイズ指定
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
    // 背景色
    this.backgroundColor = 'skyblue';
    // カスタムGrid
    var grid = Grid(SCREEN_WIDTH, 10);
    // thisを退避
    var self = this;
    // 繰り返し
    (10).times(function(i) {
      // 地面配置
      Ground().addChildTo(self).setPosition(grid.span(i), grid.span(9));
    });
     // プレイヤー作成
     this.player = Player().addChildTo(this)
     .setPosition(grid.span(0.5), grid.span(8.5));
  },
});
/*
 * プレイヤークラス
 */
phina.define("Player", {
    // 継承
    superClass: 'Sprite',
    // コンストラクタ
    init: function() {
      // 親クラス初期化
      this.superInit('human', PLAYER_SIZE, PLAYER_SIZE);
      // スプライトにフレームアニメーションをアタッチ
      FrameAnimation('human_ss').attachTo(this).gotoAndPlay('right_walk');
    },
  });
/*
 * 地面クラス
 */
phina.define("Ground", {
  // 継承
  superClass: 'Sprite',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit('ground');
    // 原点を左上に
    this.origin.set(0, 0);
  },
});
/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    // メインシーンから開始
    startLabel: 'main',
    // 画面サイズ指定
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    // アセット読み込み
    assets: ASSETS,
  });
  // 実行
  app.run();
});