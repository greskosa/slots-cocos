var ReelCell = cc.Sprite.extend({
    redLineY:null,
    bottomCellY:null,
    posX:null,
    posY:null,
    picHeight:null,
    isNeedToStop:false,
    row:null,
    initRow:null,
    column:null,
    initColumn:null,
    rowNumber:null,
    isWinningSprite:false,
//    initSpeedStep:0.0,

    ctor:function(row,column,gameLayer){
        this.gameLayer=gameLayer
        this.row=row
        this.initRow=row
        this.column=column
        this.initColumn=column

        this._super(res.symbols_anim_png,this.getCurrentRect());
        this.posX=column*(gameLayer.picHeight+gameLayer.cellMarginX)*gameLayer.picScale

        this.posY=-row*(gameLayer.picHeight+gameLayer.cellMarginY)*gameLayer.picScale
//        if(column==0){
//            console.log(this.posY)
//        }
        this.setPosition(this.posX,this.posY)
        this.setAnchorPoint(0, 1);
        this.setScale(gameLayer.picScale)
        this.redLineY=gameLayer.picHeight*gameLayer.picScale-5
        this.bottomCellY=-gameLayer.visibleSpriteCount*(gameLayer.picHeight+gameLayer.cellMarginY)*gameLayer.picScale
    },
    getCurrentRect:function(){

        var index=this.gameLayer.reelArrays[this.column][this.row]
        //  setup  winning sprite in current column
        if (this.column==this.gameLayer.seekColumnIndex&&index==this.gameLayer.currentGameWinningOrder[this.column]&&!this.isWinningSprite){
            this.isWinningSprite=true
        }

        return this.gameLayer.rects[index]
    },
    increaseRow:function(){
        var result=this.row+this.gameLayer.visibleSpriteCount+1
        if(result>this.gameLayer.rects.length-1){
            this.row=this.initRow
        }else{
            this.row=this.row+this.gameLayer.visibleSpriteCount+1
        }
    },
    updatePosition:function(){
        var currentPos=this.getPosition()
        if(currentPos.y>=this.redLineY){
            this.increaseRow()
            this.setTextureRect(this.getCurrentRect())
            this.resetY()
        }
        else
            this.setPosition(currentPos.x,currentPos.y+this.gameLayer.picHeight*this.gameLayer.speedStep)
        //stop current column if  current position of win sprite is good!!!
        if(this.column==this.gameLayer.seekColumnIndex&&this.isWinningSprite){
            var y=this.getPosition().y
            if(y>this.gameLayer.stopCentralPosition.start&&y<this.gameLayer.stopCentralPosition.end)
                   {
                       this.isWinningSprite=false
                       this.gameLayer.onReelStop()
                   }
        }
    },
    resetY:function(){
        this.setPosition(this.posX,this.bottomCellY)
    },
    correctYPosition:function(){

    }
})