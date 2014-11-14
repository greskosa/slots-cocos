var StatusBarLayer = cc.Layer.extend({
    totalBet:'0.00',
    balance:26458.04,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init()
    },
    init:function(){    /////////////////////////////
        this.size = cc.winSize;
        this.totalBetText = new cc.LabelTTF("Total bet: "+this.totalBet+globals.CURRENCY, "Verdana", 22);
        this.balanceText = new cc.LabelTTF("Balance: "+this.balance+globals.CURRENCY, "Verdana", 22);
        this.totalBetText.setColor(cc.color(255,255,255));
        this.balanceText.setColor(cc.color(255,255,255));
        this.totalBetText.x=110;
        this.totalBetText.y=this.size.height- 20;
        this.balanceText.x=this.size.width-135;
        this.balanceText.y=this.size.height- 20;
        this.addChild(this.totalBetText)
        this.addChild(this.balanceText)
        return true;
    },
    increaseTotalBet:function(add){
        this.totalBet=parseFloat(this.totalBet)+globals.BET_PRICE
        this.totalBet=this.totalBet.toFixed(2)
        this.totalBetText.setString("Total bet: " + this.totalBet+globals.CURRENCY);
    },
    updateBalance:function(){
        this.balance=parseFloat(this.balance)-globals.BET_PRICE
        this.balance= this.balance.toFixed(2)
        this.balanceText.setString("Balance: " + this.balance+globals.CURRENCY);
    }

});