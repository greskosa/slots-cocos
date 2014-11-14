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
//    initSpeedStep:0.0,
    speedStep:0.04,

    ctor:function(row,column,gameLayer){
        this.gameLayer=gameLayer
        this.row=row
        this.initRow=row
        this.column=column
        this.initColumn=column

        this._super(res.symbols_anim_png,this.getCurrentRect());
        this.posX=column*(gameLayer.picHeight+gameLayer.cellMarginX)*gameLayer.picScale
        this.posY=-row*(gameLayer.picHeight+gameLayer.cellMarginY)*gameLayer.picScale
        this.setPosition(this.posX,this.posY)
        this.setAnchorPoint(0, 1);
        this.setScale(gameLayer.picScale)
        this.redLineY=parseInt(gameLayer.picHeight*gameLayer.picScale)
        this.bottomCellY=-gameLayer.visibleSpriteCount*(gameLayer.picHeight+gameLayer.cellMarginY)*gameLayer.picScale
    },
    getCurrentRect:function(){
        var index=this.gameLayer.reelArrays[this.column][this.row]
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
        var pos=this.getPosition()
        if(pos.y>=this.redLineY){
            this.increaseRow()
            this.setTextureRect(this.getCurrentRect())
            this.resetY()
            cc.log('reset')
        }
        else
            this.setPosition(pos.x,pos.y+this.gameLayer.picHeight*this.speedStep)

        if(this.isNeedToStop&&this.getPosition().y<=3&&this.getPosition().y>0)
        {
//            console.log('FIRE!!')
                this.gameLayer.onReelStop()
                this.isNeedToStop=false
        }

    },
    resetY:function(){
        this.setPosition(this.posX,this.bottomCellY)
    }
})