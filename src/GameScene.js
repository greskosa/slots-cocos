var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.backgroundLayer = new BackgroundLayer();
        this.statusBarLayer = new StatusBarLayer();
        this.gameLayer = new  GameLayer();
        this.addChild(this.backgroundLayer,0);
        this.addChild(this.statusBarLayer,1);
        this.addChild(this.gameLayer,1);
    },
    onSpinPressed:function(){
        if(!this.gameLayer.canPressBtn)
            return false
        this.statusBarLayer.updateBalance()
        this.statusBarLayer.increaseTotalBet()
        this.gameLayer.rollIt()

}
});

