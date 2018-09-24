// グローバルに展開
phina.globalize();

// 定数
var ASSETS = {
  image: {
    bg: "http://jsrun.it/assets/a/G/5/Y/aG5YD.png",
    human:  './img/human.png',
  },
};
var SCREEN_WIDTH  = 465;              // スクリーン幅
var SCREEN_HEIGHT = 465;              // スクリーン高さ
var SPEED         = 4;

/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',

  // 初期化
  init: function(options) {
    // super init
    this.superInit(options);

    // 背景
    this.bg = Sprite("bg").addChildTo(this);
    this.bg.origin.set(0, 0); // 左上基準に変更

    // プレイヤー
    this.player = Sprite('human',32,32).addChildTo(this);
    this.player.setPosition(400, 400);
    this.player.frameIndex = 4;  //デフォで左向き
  },

  // 更新
  update: function(app) {
    var p = app.pointer;

    if (p.getPointing()) {
      var diff = this.player.x - p.x;
      if (Math.abs(diff) > SPEED) {
        // 右に移動
        if (diff < 0) {
          this.player.x += SPEED;
          this.player.scaleX = -1;
        }
        // 左に移動
        else {
          this.player.x -= SPEED;
          this.player.scaleX = 1;
        }

      }
    }
    else {
      // 待機
      this.player.frameIndex = 4;
    }
  }
});

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    startLabel: 'main',   // MainScene から開始
    width: SCREEN_WIDTH,  // 画面幅
    height: SCREEN_HEIGHT,// 画面高さ
    assets: ASSETS,       // アセット読み込み
  });

  app.enableStats();

  // 実行
  app.run();
});