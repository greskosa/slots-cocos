var GameLayer = cc.Layer.extend({
    totalBet:'0.00',
    balance:26458.04,
    picHeight:104,
    picScale:0.45,
    rects:[],
    reelCells:[],
    reelsCount:5,
    reelCellsPaddingX:20,
    reelCellsPaddingY:10,
    visibleSpriteCount:3,
    cellMarginX:12,
    cellMarginY:6,
    rolling:false,
    canPressBtn:true,
    startCellIndexUpdateRender:0,
    initArray:[0,1,2,3,4,5,6,7,8,9,10,11],
    reelArrays:[],
    currentGameWinningOrder:[],
    nextGameWinningOrder:[9, 9, 9, 9, 9],
    seekColumnIndex:-1,
    winAnimations:{},
    turtle:null,
    typesToPngAnimation:{
        five_of_anim:res.five_of_anim,
        general_anim:res.general_anim
    },
    animationTimesPlay:6,
    currentAnimationTime:0,
    clippingNodeSize:{
        width:250,
        height:145
    },
    winSprites:[],
    speedStep:0.06,
    stopCentralPosition:{start:0,end:0},

    //area for cutting
//    clipingNodeSize:{height:146,width:250}
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init()
    },
    init:function(){    /////////////////////////////
        this.size = cc.winSize;
        this.addGameFieldBg()
        this.prepareFrames()
        this.prepareFramesOrder()
        this.drawSprites()
        this.schedule(this.update)
        var avarage=-(this.picHeight+this.cellMarginY)*this.picScale
        this.stopCentralPosition.start=avarage-1.5
        this.stopCentralPosition.end=avarage+1.5
        return true;
    },
    shape:function () {
           var shape = new cc.DrawNode();
           var width=this.clippingNodeSize.width
           var height=this.clippingNodeSize.height
           var figure = [cc.p(0, 0),cc.p(width, 0),
                      cc.p(width, -height),
                      cc.p(0, -height)];
          var green = cc.color(0, 255, 0, 255);
          shape.drawPoly(figure, green, 3, green);
          shape.setPosition(cc.p(0,0))
          return shape;
    },
    clipper:function () {
            var node=   new cc.ClippingNode();
            node.width=this.clippingNodeSize.width
            node.height=this.clippingNodeSize.height
            node.setPosition(cc.p(this.reelCellsPaddingX,this.reelCellsPaddingY))
            node.setAnchorPoint(cc.p(0, -1))
            return node
    },
    addGameFieldBg:function(){
        var pos = cc.p( this.size.width / 2-70  ,  this.size.height / 2);
        this.gameWindow= new cc.Node()
        this.gameWindow.width=286
        this.gameWindow.height=164
        this.gameWindow.setAnchorPoint(cc.p(0.5,0.5));
        this.gameWindow.setPosition(pos);
        //4. create a background image and set it's position at the center of the screen
        this.spritebg = new cc.Sprite(res.game_field_bg_png);
        this.spritebg.setAnchorPoint(0, 0);
        this.spritebg.setScale(0.4);
        this.spritebg.setPosition(cc.p(0,0));
//        spritebg.setOpacity(0.7);
        this.gameWindow.addChild(this.spritebg);
        this.addChild(this.gameWindow);
    },
    shuffleArray:function(o) {
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },
    copyArray:function( array ) {
        var copy = [];
        for( var i = 0 ; i < array.length; i++) {
            copy.push( array[i] );
        }
        return copy;
    },
    prepareFrames:function(){
        for (var i=1;i<=12;i++){
            var margin=(i-1)*this.picHeight;
            this.rects.push(cc.rect(0,margin,95,this.picHeight))
        }
    },
    prepareFramesOrder:function(){
        for(var v=0;v<this.reelsCount;v++){
            var arr=this.shuffleArray(this.copyArray(this.initArray))
            this.reelArrays[v]=(arr)
        }
    },
    getRandomIndex:function(){
        return parseInt(Math.random() * (this.rects.length-1)) ;
    },
    drawSprites:function(){
//        previous version!
//        var l=new cc.Node( )
//        l.width=240
//        l.height=146
//        l.setAnchorPoint(cc.p(0, -1))
//        l.setPosition(cc.p(this.reelCellsPaddingX+80,this.reelCellsPaddingY+75))
//        this.addChild(l)
        var clipperReelsZone = this.clipper();
        clipperReelsZone.stencil = this.shape();
        this.gameWindow.addChild(clipperReelsZone,3);


        for(var column=0;column<this.reelsCount;column++){
            for(var row=0;row<this.visibleSpriteCount+1;row++){
                var reelCell=new ReelCell(row,column,this)
                clipperReelsZone.addChild(reelCell,40)
                this.reelCells.push(reelCell)
            }
        }
    },
    rollIt:function(){
        if(this.canPressBtn){
            this.canPressBtn=false
            cc.audioEngine.playEffect(res.roll_mp3)
            this.rolling=true
            this.setUpNextGameWinningOrder()
        }
    },
    setUpNextGameWinningOrder:function(callback){
        var self=this
        this.currentGameWinningOrder=this.copyArray(this.nextGameWinningOrder)
        this.nextGameWinningOrder=[]
        setTimeout(function(){ //example of async operation; must be request to the server
            for(var x=0;x<self.reelsCount;x++){
                var randomIndex=self.getRandomIndex()
                self.nextGameWinningOrder.push(randomIndex)
            }
            self.setUpSeekColumn()
        },1300)
    },
    update:function(){
        if(!this.rolling)
            return
        var reelCellsLength=this.reelCells.length
        for(var oo=this.startCellIndexUpdateRender;oo<reelCellsLength;oo++){
            this.reelCells[oo].updatePosition()
        }
    },

    setUpSeekColumn:function(){
        this.seekColumnIndex++;
    },

    onReelStop:function(){
//        console.log(this.reelCells[this.startCellIndexUpdateRender].getPosition().y)
        //if we found win sprite in last column reset vars
        if((this.visibleSpriteCount+1)*this.reelsCount-this.startCellIndexUpdateRender==this.visibleSpriteCount+1){
            //all reels were stoped
            this.rolling=false
            this.showWinAnimation(function(){
                this.clearWinAnimation()
                this.canPressBtn=true
            }.bind(this))
            this.startCellIndexUpdateRender=0
            this.seekColumnIndex=-1

        }else{//move to the next column
            this.startCellIndexUpdateRender+=(this.visibleSpriteCount+1)
            this.setUpSeekColumn()
        }
        cc.audioEngine.playEffect(res.stop_mp3)
    },
    showWinAnimation:function(callback){
        var self=this;
        var winCompination=[{type:'five_of_anim',position:{x:this.size.height/2+5,y:this.size.width/2-75}},{type:'five_of_anim',position:{x:this.size.height/2+54,y:this.size.width/2-120}},
            {type:'general_anim',position:{x:this.size.height/2+57,y:this.size.width/2-167}},{type:'general_anim',position:{x:this.size.height/2+161,y:this.size.width/2-167}}]
        var winCompinationLength=winCompination.length
        for(var winIndex=0;winIndex<winCompinationLength;winIndex++){
            var animationFrames=[]
                var type=winCompination[winIndex].type
                if(!this.winAnimations[type]){
                    for(var x=0;x<17;x++){
                           var animFrame=new cc.SpriteFrame(this.typesToPngAnimation[type],cc.rect(x*120,0,120,120))
                           animationFrames.push(animFrame)
                    }
                    var animation=new cc.Animation(animationFrames, 0.07)
                    this.winAnimations[type]=animation
                }
                var runningAction = new cc.RepeatForever(new cc.Sequence(new cc.Animate(this.winAnimations[type]), cc.CallFunc.create(function(){
                                                            self.currentAnimationTime++
                                                            if(self.currentAnimationTime==winCompinationLength*self.animationTimesPlay){
                                                                self.currentAnimationTime=0
                                                                self.winAnimations={}
                                                                if(callback) callback()
                                                            }
                                                            })));
                var sprite = new cc.Sprite(res.sprite0)
                sprite.attr({
                    x:winCompination[winIndex].position.x,
                    y:winCompination[winIndex].position.y,
                    scale:0.5
                })
                sprite.runAction(runningAction)
                this.winSprites.push(sprite)
                this.addChild(sprite,600)

        }
     },
    clearWinAnimation:function(){
        var winSpritesLength=this.winSprites.length
        for(var i=0;i<winSpritesLength;i++){
            this.winSprites[i].removeFromParent(true)
        }
        this.winSprites=[]
    }


});