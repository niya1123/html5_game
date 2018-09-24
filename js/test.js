// グローバルに展開
phina.globalize();
// アセット
var ASSETS = {
  // 画像
  image: {
    // 地面
    'ground': 'https://rawgit.com/alkn203/tomapiko_void/master/assets/image/ground.png',
    'human': './img/human.png',
    'monster': './img/Monster.png',
  },
  spritesheet:{
    'human_ss': 'https://api.myjson.com/bins/1bu3s4',
    'slime': 'https://api.myjson.com/bins/gkuis',
  }, 
   
};
// 定数
var SCREEN_WIDTH   = 640; // 画面横サイズ
var SCREEN_HEIGHT  = 640; // 画面縦サイズ
var PLAYER_SIZE    = 64;  // プレイヤーのサイズ
var PLAYER_SPEED   = 6;   // プレイヤーの速度
var ENEMY_SIZE     = 64;
var ENEMY_MAX_NUM  = 6;
var ENEMY_INTERVAL = 300;
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
     //敵グループ
     this.enemyGroup = DisplayElement().addChildTo(this);
     //最初の敵生成
     this.generateEnemy();
  },
  //更新処理
  update: function(app){
    var enemys = this.enemyGroup.children;
    if(app.frame % ENEMY_INTERVAL === 0 && enemy.length < ENEMY_MAX_NUM){
        this.generateEnemy();
    }  
  },
  //タッチの処理
  onpointstart: function(){
    this.player.reflectX();
  },
  //敵生成処理
  generateEnemy: function(){
    var x = this.gridX.span(Random.randint(2,14));
    var y = this.gridY.span(Random.randint(2,3));
    Enemy().addChildTo(this.enemyGroup).setPosition(x,y);
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
      //移動
      this.physical.velocity.x = PLAYER_SPEED;
    },
    //更新処理
    update: function(){
        //画面左
        if(this.left < 0){
            this.left = 0;
            this.reflectX();
        }
        //画面右
        if(this.right > SCREEN_WIDTH){
            this.right = SCREEN_WIDTH;
            this.reflectX();
        }
    },
    //反転処理
    reflectX: function(){
        //移動方向反転
        this.physical.velocity.x *= -1;
        //向き反転
        this.scaleX *= -1;
    },
});

/**
 * 敵クラス
 */
phina.define("Enemy",{
    superClass: 'Sprite',

    init: function(){
        this.superInit('monster', ENEMY_SIZE, ENEMY_SIZE);
        FrameAnimation('slime').attachTo(this).gotoAndPlay('slime-left');
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