# Javascript继承以及引出的一系列问题

> Javascript 没有子类和父类的概念，也没有"类"（class）和"实例"（instance）的区分，全靠一种很奇特的"原型链"（prototype chain）模式，来实现继承。    ———— 《JavaScript继承机制的设计思想》

很久以前在看JavaScript的时候，想学习原型链（prototype chains）的时候，被搞得头晕脑涨，最近有时间再回顾的时候，仿佛懂了这么一点东西。写下总结怕忘了。

首先的一个问题，JavaScript没有子类父类的机制，但是JavaScript有继承机制，那么JavaScript是怎么实现继承的机制的呢。

故事要从很久很久开始说起了。

***为什么JavaScript所有数据类型都是对象***

JavaScript创造之初只是为了浏览器对网页进行一些简单的操作，验证输入什么的。那一年，正式OOP发展的最兴盛的一年。所以JavaScript的设计者跟随潮流，把JavaScript里面所有的数据类型都设置成为了对象。所有数据类型都是对象的话，就必须要有一个继承的机制，但是JavaScript作为一个简单的脚本语言，设计者并不打算引入类的概念，这样子就会增加了当时JavaScript的入门难度，不利于JavaScript的推广。

***JavaScript自己的new***

由于JavaScript没有类的概念，所以不能像别的oop语言一样，使用new+类实例化一个对象。设计师参考了java,c++等语言，设计JavaScript的new命令。JavaScript的new命令后面跟着的是一个**构造函数**

```js
function DOG(name){
    this.name = name;
}
```

对构造函数使用new操作，就会生成一个实例。

```js
var dogA = new DOG('大毛');
alert(doaA.name); //大毛
```

其中为什么this.name的this会变成dogA，那又是另一个故事了。

> [JavaScript的this
](http://ulin.coding.me/ulin/tech/2017/11/23/Javascript的this/)

其中new的具体操作，那又是另一个故事了。

但是new有一个缺点就是，每一个实例的属性都是自己的，无法共享。

```js
function DOG(name){
    this.name = name;
    this.species = '犬科';
}
```

生成两个实例对象

```js
var dogA = new DOG('大毛');
var dogB = new DOG('二毛');
```

这两个实例中的this.species是互相独立的。修改其中的一个并不会更改其他实例中的属性。

每一个实例的species都是一样的，但是有很多份，无疑浪费了很多内存，很多资源。

考虑到这一点，设计师决定为构造函数设置一个prototype属性。

prototype是一个属性，这个属性的值是一个对象。也就是说，prototype类似这样

```js
{
    prototype: {
        toString: function(){ …… },
        bind: function(){ …… },
        call: function(){ …… }
    }
}
```

实例对象一旦创建，将自动引用prototype对象的属性方法。也就是说，实例对象的属性方法有两种，一种是本地的，一种是引用的。

一旦引入了prototy这种机制，我们重写一下上面的DOG构造函数。

```js
function DOG(name){
　　　　this.name = name;
　　}
　　DOG.prototype = { species : '犬科' };

　　var dogA = new DOG('大毛');
　　var dogB = new DOG('二毛');

　　alert(dogA.species); // 犬科
　　alert(dogB.species); // 犬科
```

这样，dogA和dogB共享prototype里面的species属性。只要修改prototype里的species，两个实例的species都会改变。

这样子，看起来好像dogA和dogB跟DOG就是继承的关系了。

其实，也不过就是添加了一条所有实例对象都引用的一个对象prototype。

***prototype就是所有子类都要引用的一个对象***

补充一点就是：prototype里面默认有一个属性constructor，它的值也就是构造函数。也就是Function === Function.prototype.constructor。

但是不要过度相信constructor因为它是可以改变的。但是我们编程的习惯就是把它指向构造函数。所以一旦我们改了这个属性值，记得把它改回来。

---

参考资料：

[Javascript继承机制的设计思想 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html)
