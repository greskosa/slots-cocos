var BackgroundLayer = cc.Layer.extend({
    turtleInerval:5000,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init()
    },
    init:function(){    /////////////////////////////
        var self=this
        this.size = cc.winSize;
        this.menu = new cc.Menu();
        this.menu.x = 0;
        this.menu.y = 0;
        this.addChild(this.menu, 1);
        this.addBackground()
        this.addSpinBtn()
        this.schedule(this.update)
        this.turtle=new Turtle(function(){
        //                   this.removeFromParent(true)
           self.turtleUpdate=false
           this.setStartPosition()
           self.renderTurtle()
        })
        this.renderTurtle()
        self.addChild(self.turtle,0)
        this.startMusic()
        return true;
    },
    startMusic:function(){
        cc.audioEngine.playMusic(res.background2_mp3,true)
        cc.audioEngine.setMusicVolume(0.4)
    },
    addBackground:function(){
        this.bg = new cc.Sprite(res.background_png);
        this.bg.attr({
            x: this.size.width / 2,
            y: this.height / 2,
            scale: 0.5,
            rotation: 0
        });
        this.bg.setAnchorPoint(0.5,0.5)
        this.addChild(this.bg, 0);
    },

    addSpinBtn:function(){
        var btnTexture = cc.textureCache.addImage(res.spin_sprite_png);
        var spinSprite=new cc.Sprite(btnTexture, cc.rect(2,12,392,399))
        var spinPressedSprite=new cc.Sprite(btnTexture, cc.rect(2,894,392,399))
        var spinBtn= new cc.MenuItemSprite(
            spinSprite,// normal state image
            spinPressedSprite, //select state image
            function(){
                this.getParent().onSpinPressed()
            }, this);
        spinBtn.setScale(0.3)
        spinBtn.setAnchorPoint(1,0.5)
        spinBtn.x=this.size.width-30
        spinBtn.y=this.size.height/2
        this.menu.addChild(spinBtn)
    },
    update:function(){
         if(this.turtleUpdate)
            this.turtle.updatePosition()
     },
    renderTurtle:function(){
           var self=this
           setTimeout(function(){
               self.turtleUpdate=true
           },this.turtleInerval)
       }

});