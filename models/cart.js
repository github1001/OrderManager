module.exports = function Cart(oldCart){
    this.items = oldCart.items || {},
    this.ttlQty = oldCart.ttlQty || 0,
    this.ttlPrice=oldCart.ttlPrice || 0;

    this.add = function(item, id){
        var itemsGroup = this.items[id];
        if(!itemsGroup){
            itemsGroup=this.items[id]={item:item, qty:0, price:0};
        }
        itemsGroup.qty++;
        itemsGroup.price=itemsGroup.item.price*itemsGroup.qty;
        this.ttlQty++;
        this.ttlPrice+=itemsGroup.item.price;
    }
    this.itemsArr = function(){
        var arr =[];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };

    this.removeOne = function(id){
        this.items[id].qty--;
        this.items[id].price-=this.items[id].item.price;
        this.ttlQty--;
        this.ttlPrice-=this.items[id].item.price;

        if(this.items[id].qty<=0){
            delete this.items[id];
        }

    };

    this.removeAll = function(id){
            this.ttlQty-=this.items[id].qty;
            this.ttlPrice-=this.items[id].price;

            delete this.items[id];

    };

};