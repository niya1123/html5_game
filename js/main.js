// グローバルに展開.
phina.globalize();

// アセットの登録.
var ASSETS = {

  // 画像.
  image: {
    // 地面.
    'ground': 'https://rawgit.com/alkn203/tomapiko_void/master/assets/image/ground.png',
    // プレイヤー.
    'human': './img/human.png',
    // 敵
    'monster': './img/Monster.png',
  },// 画像の終わり.

  // スプライトシート.
  spritesheet: {
    'human_ss': 'https://api.myjson.com/bins/1bu3s4',
    'monster_ss':
    {
      'frame': {
        'width': 48,
        'height': 48,
        'cols': 12,
        'rows': 8
      },
      'animations': {
        'slime-left':{
          'frames': [15,16,17],
          'next': 'slime-left',
          'frequency': 4
        },
      }// animationの終わり.
    }// monsterの終わり. 
  }// スプライトシートの終わり.
};

// 定数
var SCREEN_WIDTH   = 640; // 画面横サイズ
var SCREEN_HEIGHT  = 640; // 画面縦サイズ
var PLAYER_SIZE    = 64;  // プレイヤーのサイズ
var PLAYER_SPEED   = 6;   // プレイヤーの速度
var GROUND_HEIGHT  = 64;  // 地面の縦サイズ
var JUMP_POWOR     = 20;
var GRAVITY        = 1.5;
var ENEMY_SIZE     = 64;
var ENEMY_MAX_NUM  = 2;
var ENEMY_INTERVAL = 15;
var ENEMY_SPEED    = 6;
var HIT_RADIUS     = 16;  // 当たり判定用の半径


/**
 * メインシーン
 */
phina.define('MainScene',{
  //継承
  superClass: 'DisplayScene',

  // コンストラクタ.
  init: function(){
    // 親クラスの初期化.
    this.superInit({
      //画面サイズを指定
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    // 背景色
    this.backgroundColor = 'skyblue';

    // カスタムGrid
    var grid = Grid(SCREEN_WIDTH, 10);
    var self = this;
    // 繰り返して,地面を生成.
    (10).times(function(i) {
      // 地面配置
      Ground().addChildTo(self).setPosition(grid.span(i), grid.span(9));
    });

    // プレイヤーの作成
    this.player = Player('human').addChildTo(this);

    var lplayer = this.player;
    // プレイヤーの初期位置の設定.
    lplayer.x = grid.span(0.5);
    lplayer.y = grid.span(8.75);

    //敵グループ
    this.enemyGroup = DisplayElement().addChildTo(this);
    //最初の敵生成
    this.generateEnemy();

    // 画面上をクリックした時の動き.
    this.onpointend = function(){
      // プレイヤーが床の上なら
      if(lplayer.isGround){
        // 上方向に速度を与える（ジャンプ）
        lplayer.physical.velocity.y = -JUMP_POWOR;
        // 重力復活
        lplayer.physical.gravity.y = GRAVITY;
        // フラグ変更
        lplayer.isGround = false;
      }
    }// onpointedの終わり.

  }, // コンストラクタの終了.

  // 更新処理(毎フレームごとの)
  update: function(app){
    var enemys = this.enemyGroup.children;
    if(app.frame % ENEMY_INTERVAL === 0 && enemys.length < ENEMY_MAX_NUM){
        this.generateEnemy();
    }
    // 敵とプレイヤーの辺り判定
    this.hitEachOther();
  },// updateの終了
  
  //敵生成処理
  generateEnemy: function(){
    var x = this.gridX.span(Random.randint(1,15));
    var y =this.gridY.span(13.85);
    Enemy().addChildTo(this.enemyGroup).setPosition(x,y);
  },

  hitEachOther: function(){
    var player = this.player;
    // var self = this;
    // 敵をループ
    this.enemyGroup.children.each(function(enemy) {
      // 判定用の円
      var c1 = Circle(player.x, player.y, HIT_RADIUS); 
      var c2 = Circle(enemy.x, enemy.y, HIT_RADIUS); 
      console.log("p: "+player.bottom);
      console.log("e: "+enemy.top);
      // 円判定
      if (Collision.testCircleCircle(c1, c2) && player.bottom - enemy.top < 20) {
        console.log('hit!');
        enemy.remove();
      }
    });  
  },
  
});

/**
 * プレイヤークラス
 */
phina.define('Player',{
  // 継承
  superClass: 'Sprite',

  // コンストラクタ
  init: function(image){
    
    // 親クラスの初期化.
    this.superInit(image, PLAYER_SIZE, PLAYER_SIZE);

    this.setInteractive(true);

    // フレームアニメーションのアタッチ.
    this.playerAnimation = FrameAnimation('human_ss').attachTo(this).gotoAndPlay('right_walk');
    
    //初速度
    this.physical.velocity.x = PLAYER_SPEED;

    // 地面の上かどうか.
    this.isGround = true;
  }, // コンストラクタの終わり.

  // 毎フレームごとに処理されるもの.
  update: function(){
    // 画面端に行くと反対方向に進める.
    if (this.left < 0 || this.right > SCREEN_WIDTH) {
      this.physical.velocity.x *= -1;
      this.scaleX *= -1;
    }

    //地面ライン
    var y = SCREEN_HEIGHT - GROUND_HEIGHT; 
    // 地面
    if (this.bottom > y) {
      // console.log(this.x);
      // console.log("hi")
      // y方向の速度と重力を無効にする
      this.physical.velocity.y = 0;
      this.physical.gravity.y = 0;
      // // 位置調整
      this.y = SCREEN_HEIGHT-78;
      // フラグ立て
      this.isGround = true;
    }
  },// updateの終わり.
}); // プレイヤークラスの終わり.

/**
 * 敵クラス
 */
phina.define("Enemy",{
  superClass: 'Sprite',

  init: function(){
      this.superInit('monster', ENEMY_SIZE, ENEMY_SIZE);
      this.setInteractive(true);
      FrameAnimation('monster_ss').attachTo(this).gotoAndPlay('slime-left');
      this.physical.velocity.x = ENEMY_SPEED + Random.randint(-10, 10);
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
          // FrameAnimation('monster').attachTo(this).gotoAndPlay('slime-left');
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
  onpointstart: function(){
      this.remove();
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
    // 原点を左上
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