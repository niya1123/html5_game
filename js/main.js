// グローバルに展開
phina.globalize();

// 定数
var ASSETS = {
  image: {
    bg: "http://jsrun.it/assets/a/G/5/Y/aG5YD.png",
    human:  './img/human.png',
  },
  //スプライトシート
  spritesheet: {
    'human_ss': 'http://kindai-csg.com/js/spritesheet.json',
  }//spritesheetの終了
};
var SCREEN_WIDTH  = 465;              // スクリーン幅
var SCREEN_HEIGHT = 465;    
/*
 * メインシーン
 */
phina.define("MainScene", {
    // 継承
    superClass: 'DisplayScene',
    // コンストラクタ
    init: function() {
      // 親クラス初期化
      this.superInit();
      // 背景
      this.bg = Sprite("bg").addChildTo(this);
      this.bg.origin.set(0, 0); // 左上基準に変更
      // スプライト画像作成
      var sprite = Sprite('human', 64, 64).addChildTo(this);
      // スプライトにフレームアニメーションをアタッチ
      var anim = FrameAnimation('human_ss').attachTo(sprite);
      // アニメーションを指定する
      anim.gotoAndPlay('right_walk');
      // 初期位置
      sprite.x = this.gridX.center();
      sprite.y = this.gridY.center();
      // 更新イベント
      sprite.update = function() {
        // 移動
        sprite.x -= 2;
      };
    },
  });
  /*
   * メイン処理
   */
  phina.main(function() {
    // アプリケーションを生成
    var app = GameApp({
      // MainScene から開始
      startLabel: 'main',
      width: SCREEN_WIDTH,  // 画面幅
      height: SCREEN_HEIGHT,
      // アセット読み込み
      assets: ASSETS,
    });
    // fps表示
    //app.enableStats();
    // 実行
    app.run();
  });