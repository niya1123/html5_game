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
  spritesheet:{
    'human_ss': 'https://drive.google.com/open?id=1PuNgaP6votpN1iNsCNzQ3HY6XMvo3obX',
  }, 
   
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
     .setPosition(grid.span(0.5), grid.span(8.75));
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