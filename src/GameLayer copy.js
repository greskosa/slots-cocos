var GameLayer = cc.Layer.extend({
    totalBet:'0.00',
    balance:26458.04,
    picHeight:104,
    picScale:0.45,
    rects:[],
    reelCells:[],
    reelsCount:5,
    reelCellsPaddingX:20,
    reelCellsPaddingY:8,
    visibleSpriteCount:3,
    cellMarginX:12,
    cellMarginY:8,
    rolling:false,
    startCellIndex:0,
    initArray:[0,1,2,3,4,5,6,7,8,9,10,11],
    reelArrays:[],
    currentGameWinningOrder:[],
    nextGameWinningOrder:[11,0,2,6],
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
        this.prepareReelsOrder()
        this.drawSprites()
        this.schedule(this.update)
        return true;
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
        this.symbols_anim_png = cc.textureCache.addImage(res.symbols_anim_png);

        var sprite=new cc.Sprite(this.symbols_anim_png)

        for (var i=1;i<=12;i++){
            var margin=(i-1)*this.picHeight;
            this.rects.push(cc.rect(0,margin,95,95))
        }

    },
    prepareReelsOrder:function(){
        for(var v=0;v<this.reelsCount;v++){
            var arr=this.shuffleArray(this.copyArray(this.initArray))
            this.reelArrays[v]=(arr)
        }
    },
    getRandomIndex:function(){
        return parseInt(Math.random() * (this.rects.length-1)) ;

    },
    drawSprites:function(){
        var l=new cc.Node( )
        l.width=240
        l.height=146
        l.setAnchorPoint(cc.p(0, -1))
        l.setPosition(cc.p(this.reelCellsPaddingX,this.reelCellsPaddingY))
        this.gameWindow.addChild(l,1)

        for(var column=0;column<this.reelsCount;column++){
            for(var row=0;row<this.visibleSpriteCount+1;row++){
                var reelCell=new ReelCell(row,column,this)
//                reelCell.init()
                 l.addChild(reelCell)
                this.reelCells.push(reelCell)
            }
        }
    },
    rollIt:function(){
        if(!this.rolling){
            cc.audioEngine.playEffect(res.roll_mp3)
            this.rolling=true
            this.setUpNextGameWinningOrder()
        }
    },
    setUpNextGameWinningOrder:function(callback){
        var self=this
        setTimeout(function(){ //example of async operation; must be request to the server
            for(var x=0;x<self.reelsCount;x++){
                self.nextGameWinningOrder.push(self.getRandomIndex())
                console.log(self.nextGameWinningOrder)
                self.setStopReels()
            }
        },4000)
    },
    update:function(){
        if(!this.rolling)
            return
        var reelCellsLength=this.reelCells.length
        for(var oo=this.startCellIndex;oo<reelCellsLength;oo++){
//            console.log(this.reelCells[0].getPosition())
            this.reelCells[oo].updatePosition()
        }
    },

    setStopReels:function(){
//        console.log('setStopReels')
        this.reelCells[this.startCellIndex].isNeedToStop=true
    },
    onReelStop:function(){
        var self=this
        if((this.visibleSpriteCount+1)*this.reelsCount-this.startCellIndex==this.visibleSpriteCount+1){
            this.rolling=0
            this.startCellIndex=0

        }else{
            this.startCellIndex+=(this.visibleSpriteCount+1)
            setTimeout(function(){
                self.setStopReels()
            },250)
        }
    }
});