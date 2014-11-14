var DarkBgLayer = cc.Layer.extend({
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init()
    },
    init:function(){    /////////////////////////////
        this.size = cc.winSize;
        this.addBackground()
        return true;
    },

    addBackground:function(){
        this.bg = new cc.Sprite(res.dark_background_png);
        this.bg.attr({
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0,
            rotation: 0
        });
        this.addChild(this.bg, 0);
    }



});