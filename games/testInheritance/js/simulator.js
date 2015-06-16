var Parent = {
    name: '',
    age: 0,
    init: function(child) {
        for(var key in this){
            if(!this.hasOwnProperty(key)) {
                continue;
            }
            if (!child[key]){
                child[key] = this[key];
            }
        }
    },
    changeName : function(name){
        this.name = name;
    }
}

var Child = {
    parent: Parent,
    init: function(name, age) {
        this.parent.init(this);
        this.name = name;
        this.age = age;
    },
    changeName: function(name) {
        this.parent.changeName(name);
    },
    changeAttr: function(thing) {
        this.parent.changeName(thing.name);
        this.age = thing.age;
    }
}

Child.init('Bob', 5);
console.log(Child);
Child.changeName('Aaron');
console.log(Child);
console.log(Parent);
// var testChild = new Child('bob', 1);
// // testChild.buildPrototype();
// Child.changeAttr({name: 'Aaron', age: 5});
// Child.changeAge('5');

// console.log(testChild);
// console.log(testChild.age);