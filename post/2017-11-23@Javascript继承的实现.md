# Javascript的继承的实现

> 先前我们说到，JavaScript设计的时候没有类的概念，所以也就没有继承，设计师用一个prototype来完成来JavaScript的继承机制，那么我们就来举例说明JavaScript继承实现的机制吧

例如这里有一个动物的构造函数

```js
function Animal(){
　　　　this.species = "动物";
　　}
```

还有一个猫的构造函数

```js
function Cat(name,color){
　　　　this.name = name;
　　　　this.color = color;
　　}
```

我们要用代码实现 猫继承自动物

也就是实现 cat.species == "动物" //true

**方法一： 构造函数绑定**

使用call或者apply，将Animal函数绑定在Cat函数的上下文中

```js
function Cat(name,color){
　　　　Animal.apply(this, arguments);
　　　　this.name = name;
　　　　this.color = color;
　　}
　　var cat1 = new Cat("大毛","黄色");
　　alert(cat1.species); // 动物
```

**方法二: 使用prototype模式**

回顾一下我们的要实现的就是

**cat.species == "动物" //true**

那么我们就让所有猫引用一个共同的对象，那就是prototype最初的设计想法

我们知道，prototype是一个对象，被它所在的对象的所有子类继承，那么我们就让Cat的prototype里面有一个species = "动物"，那么所有new出来的对象里面，就都有这个属性了。

```js
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
var cat1 = new Cat("大毛","黄色");
alert(cat1.species); // 动物
```

这样子Cat.prototype里面就有了species字段了。

注意第二行 Cat.prototype.constructor = Cat; 为什么要这样做，这又是一个故事

**方法三： 直接继承prototype**

这种方法其实是上一种的改进，上一种方法中。我们Cat.prototype = new Animal()的赋值操作中，虽然完成了给引用过去，还会把Animal中的一些属性给实例，这些是一些多余的东西。我们其实不必要。我们关注的就是Animal的prototype属性。只要把这个里面的属性放到Cat.prototype里面，就能够实现Cat的所有子类具有Animal的属性了。

所以我们只要的是Cat.prototype.species = "动物"，就可以实现我们的目标了。我们把Animal改写一下。

```js
function Animal(){ }
　　Animal.prototype.species = "动物";
```

```js
Cat.prototype = Animal.prototype;
Cat.prototype.constructor = Cat;
var cat1 = new Cat("大毛","黄色");
alert(cat1.species); // 动物
```

然后Cat的prototype指向Animal.prototype然后调用Cat.prototype.species其实就是指向Animal.prototype.species了。

这一种方法跟前面的比，Cat.prototype里面就只有我们需要的.species属性，没有其他的。

但是这么做，根据上面的说明，会有一个严重的问题

Cat.prototype 跟 Animal.prototype是一个引用的关系，所以我们在Cat.prototype.constructor = Cat的时候，其实也把Animal.prototype.constructor也修改了，这个无疑是致命的，所以这个继承是不合格的。

所以我们还要改进

**方法四：利用空对象作为中介**

由于直接继承prototype会影响到父类的属性，所以我们引入一个空对象。

```js
var F = function(){};
F.prototype = Animal.prototype;
Cat.prototype = new F();
Cat.prototype.constructor = Cat;
```

F作为一个空对象，几乎不占内存。然后我们用new操作符，创造出一个新的对象，这样子修改Cat.prototype.constructor也不会修改到父类的属性。

这个方法也就是第二个和第三个方法的融合。

整合一下，写出一个函数

```js
function extend(Child, Parent) {

　　　　var F = function(){};
　　　　F.prototype = Parent.prototype;
　　　　Child.prototype = new F();
　　　　Child.prototype.constructor = Child;
　　　　Child.uber = Parent.prototype;
　　}
```

Child.uber = Parent.prototype只是用来指示父类原型的，记录用。

**方法五： 拷贝继承**

>大神说，哇你整天搞什么花里胡哨的，让我来

需求：cat.species == "动物"

分析：Cat.prototype.species = "动物" = Animal.prototype.species;

操作：直接赋值啊，搞什么花里胡哨的。

```js
function extend2(Child, Parent) {
　　　　var p = Parent.prototype;
　　　　var c = Child.prototype;
　　　　for (var i in p) {
　　　　　　c[i] = p[i];
　　　　　　}
　　　　c.uber = p;
　　}
```

所以继承，就很像是，在子类的prototype里面放进父类的方法属性，然后子类的一个属性指向父类，就好了。

---

参考资料：
[Javascript面向对象编程（二）：构造函数的继承 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)
