var Product = require('../models/products');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pizzaPapa');


var prods =[
    
   new Product({
   image:'images/Peperoni.jpg',
   label:'The Big Pepperoni',
   description:'Huge pie cut into 8 extra-large slices. Authentic, soft & foldable New York-style dough, topped with Marinara pizza sauce and lots of crispy American pepperoni with hints of fennel and chilli',
   price:12
}),

new Product({
    image:'images/NewYorkers.jpg',
    label:'The Big Cheese',
    description:'Huge pie cut into 8 extra-large slices. Authentic, soft & foldable New York-style dough, topped with Marinara pizza sauce & lots of stretchy mozzarella',
    price:8
 })

];

var finish=0;
for(var a=0;a<prods.length;a++){
    prods[a].save(function(err,result){
        finish++;
        if(finish == prods.length){
            close();
        }

    });
    
}

function close(){
mongoose.disconnect();
}