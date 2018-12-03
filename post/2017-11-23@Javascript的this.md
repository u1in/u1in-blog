# Javascript的this

> 当我问Js what is this?
>
> 它回答It depends的时候，我是崩溃的

JavaScript的this真的是一个百变泽鲁斯一样的东西。***它的取值，看函数被调用执行的时候才能确定，函数定义的时候，我们是确定不了的。***

总的来说this的取值，分四种情况。

**情况1: 构造函数中的this**

如《Javascript继承及引出的一系列问题》里面提到的，构造函数就是new后面接的一个函数，用来创建对象实例的。

例如：

```js
function Myfunc(value,number){
    this.value = value;
    this.number = number;
}

var a = new Myfunc(100,1);
a.value; //100
a.number;//1
```

此时的this指向a，我们可知，构造函数中的this，在构造函数实例化后，指向实例的对象。

> 至于为什么可以参见这一篇

**情况2: 函数作为对象中的一个属性时的this**

```js
var obj = {
    value: 100,
    number: function(){
        return this.value;
    },
};
obj.number();
```

此时this在一个对象的属性中，**且！是！被！这！个！对！象！调！用！执！行！的！时！候！** this指向这个对象

如果函数是在一个对象中**定义**的，但是是被赋值到另一个对象中**调用**的，那么它的this指向的就是调用这个函数的对象。

```js
var obj = {
    value: 100,
    number: function(){
        return this.value;
    },
};
var obj2 = {
	value: 50,
	number: undefined,
};
obj2.number = obj.number;
obj2.number(); //50
```

此时this指向调用它的obj2。

还有一种情况

```js
var obj = {
    value: 100,
    number: function(){
        return this.value;
    },
};
var value = 20;
var f1 = obj.number;
f1(); //20
```

此时obj里面的函数被赋值给了f1，f1是谁的对象呢，看样子它前面并没有 Object. 的格式。

其实这个时候f1是全局的属性，它是全局对象window的属性，所以this这个时候就指向window，所以返回的也是window.value，f1也可以写成window.f1。那就跟上面的一样了。

所以总的来说 函数作为对象中的一个属性，其中的this指向的是***调用它的对象***

**情况3: 函数用call或者apply调用**


**情况4: 全局函数or普通函数**

永远是window

```js
var value = 80;
function myFunc(){
    return this.value;
}
myFunc(); //80
```

注意一种情况

```js
var value = 90;
var obj = {
    value: 10,
    number: function(){
        return function(){
            return this.value;
        }()
    }
}
obj.number() //90
```

这个时候我们虽然是在一个对象里面用了定义了一个函数，也是用这个对象调用的这个函数，但是这个函数最终返回的是一个普通函数，所以this指向window。

其实也可以理解为，this就在一个普通函数中，只不过这个函数是我们用代码变换成的，上面那个是我们手敲的。普通函数就是普通函数，this就是window。

---

参考资料：
[深入理解javascript原型和闭包（10）——this - 王福朋 - 博客园](http://www.cnblogs.com/wangfupeng1988/p/3988422.html)
[Javascript的this用法 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html)
