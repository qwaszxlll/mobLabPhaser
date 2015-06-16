function Parent(name){
    this.name = name;
    this.changeName = function(name){
        this.name=name;
    };
    this.base = {
        onStart: function(){
            console.log('started');
        }
    };
    this.init = function(){
        for (var key in this.base){
            if (!this[key]){
                this[key] = this.base[key];
            }
        }
    };
}
console.log("PARENT", Parent.prototype);
/*Parent.prototype.buildPrototype = function(){
    console.log("THIS: ", this);
    for(var key in this.functions) {
        console.log(this.functions);
        console.log("KEY: ", key);
        if(!this.functions.hasOwnProperty(key)) {
            continue;
        }
        if(typeof this.functions[key] === 'function') {
            console.log(this.prototype);
            this.__proto__[key] = this.functions[key];
        }
    }
}*/

function Child(name, age){
    Parent.call(this, name);
    this.age = age;
    this.changeAge = function(newAge){
      this.age = newAge;
    };
    this.onStart = function(){
        this.base.onStart();
        console.log('hahahahaa');  
    };
    this.changeAttr = function(thing){
        // console.log(Parent.prototype);
        // Parent.prototype.changeAttr.call(this,thing);
        this.changeName(thing.name);
        this.changeAge(thing.age);
    }
}

Child.prototype = Object.create(Parent.prototype);

Child.prototype.constructor = Child;

var testChild = new Child('Bob', 1);
testChild.init();
// testChild.buildPrototype();
console.log(testChild);
testChild.changeAttr({name: 'Aaron', age: 5});
// testChild.changeAge('5');
console.log(testChild);
testChild.changeName('George');
console.log(testChild);
testChild.onStart();
