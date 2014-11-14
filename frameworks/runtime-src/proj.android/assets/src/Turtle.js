var Turtle = cc.Sprite.extend({
    heightStep:141,
    widthStep:158,
    widthFrameCount:6,
    scaleValue:1,
    frames:[],
    changePositionStep:0.75,
    xTranitionCoef:1,
    ctor:function(onAnimationComplete){
        this.size = cc.winSize;
        this.setStartPosition()
        this.onAnimationComplete=onAnimationComplete;
        this._super(res.bet_sprite_png);
        this.setAnchorPoint(0.5,0.5)
        this.setScale(this.scaleValue)
        this.setRotation(50)
        this.setPosition(this.startPosX,this.startPosY)
        this.createFrames()
        this.renderAnimation()
    },
    getCurrentRect:function(i){
        i=i||0
        var y=parseInt(i/this.widthFrameCount)
        var x=i%this.widthFrameCount
        return cc.rect(x*this.widthStep,y*this.heightStep, this.widthStep,this.heightStep)
    },
    createFrames:function(){
        for (var i=0;i<24;i++){
            this.frames.push(new cc.SpriteFrame(res.turntle_png,this.getCurrentRect(i)))
        }
    },
    renderAnimation:function(){
        var animation=new cc.Animation(this.frames, 0.06)
        var animate=new cc.Animate(animation)
        var action= new cc.RepeatForever(animate)
        this.runAction(action)
    },
    setXCoef:function(){
        if(this.isXAxis){
            this.xTranitionCoef=this.getRandom(0.6,1.5)
        }else{
            this.xTranitionCoef=this.getRandom(1.5,2.5)
        }

    },
    getRandomInt:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandom:function(min, max) {
        return Math.random() * (max - min) + min;
    },
    setStartPosition:function(){
        this.isXAxis=this.getRandomInt(0,1)
        if(this.isXAxis){
            this.startPosX=this.getRandomInt(this.size.width/2,this.size.width)
            this.startPosY=this.size.height+150
        }else{
            this.startPosX=this.size.width+100;
            this.startPosY=this.getRandomInt(this.size.height/2,this.size.height)
        }
        this.setXCoef()
        this.scaleValue=1
    },
    updatePosition:function(){
        this.startPosX-=this.changePositionStep*this.xTranitionCoef
        this.startPosY-=this.changePositionStep
        this.scaleValue+=0.001
        this.setPosition(this.startPosX,this.startPosY)
        this.setScale(this.scaleValue)
        if(this.startPosX&&this.startPosY<-100)
            this.onAnimationComplete()
    }

})