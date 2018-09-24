// グローバルに展開
phina.globalize();

//アセット
var ASSETS = {
    //画像
    image: {
        'human': '../img/human.png',
    },
    //スプライトシート
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
};//ASSETSの終了

/*
 * メインシーン
 */
phina.define("MainScene",{
    //継承
    superClass: 'DisplayScene',
    //コンストラクタ
    init: function(){
        //親クラス初期化
        this.superInt();
        //背景
        this.backgroundColor = 'skyblue';
        //スプライト画像作成
        var sprite = Sprite('human',32,32).addChildTo(this);
        //スプライトにフレームアニメーションをアタッチ
        var anime = FrameAnimation('human_ss').attachTo(sprite);
        // アニメーションを指定
        anime.gotoAndPlay('right_walk');
        //初期位置
        sprite.x = this.gridX.center();
        sprite.y = this.gridY.center();
        
    },
}); 

/**
 * メイン処理
 */
phina.main(function(){
    //アプリケーション生成
    var app = GameApp({
        // MainScene から開始
        startLabel: 'main',
        //アセット読み込み
        assets: ASSETS,
    });
    app.run();
});