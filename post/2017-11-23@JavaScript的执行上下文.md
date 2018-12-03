# Javascript的执行上下文

> 网络写手。。

直接上代码

```js
console.log(a);

//输出结果：
//a is not defined
```

```js
console.log(a);
var a;

//输出结果：
//undefined
```


```js
console.log(a);
var a = 10;

//输出结果
//undefined
```

第一个输出正常，因为a的的确确没定义。

那为什么第二个输出看起就已经知道了a的存在呢

为什么第三个输出已经知道了a的存在但是不知道a的值呢？

所以我们猜js在运行一段代码之前，是要做一些准备工作的。

在此直接说明一下js的‘准备工作’都做了什么

+ 建立variableObject对象
  + 建立arguments对象，检查当前上下文中的参数，建立该对象下的属性以及属性值
  + 检查当前上下文中的函数声明：
    + 每找到一个函数声明，就在variableObject下面用函数名建立一个属性，属性值就是指向该函数在内存中的地址的一个引用
    + 如果上述函数名已经存在于variableObject下，那么对应的属性值会被新的引用所覆盖。
  + 检查当前上下文中的变量声明：
    + 每找到一个变量的声明，就在variableObject下，用变量名建立一个属性，属性值为undefined。
    + 如果该变量名已经存在于variableObject属性中，直接跳过(防止指向函数的属性的值被变量属性覆盖为undefined)，原属性值不会被修改。
+ 初始化作用域链
+ 确定上下文中this的指向对象

这就是我们常说的**变量声明提升**、**函数声明提升**了。

上述三个例子就挑第三个说吧

```js
console.log(a);
var a = 10;

//输出结果
//undefined
```

就相当于

```js
var a = undefined;
console.log(a); //undefined
a = 10;
```

想必之前的例子也就能看懂了

再给一个例子

```js
console.log(foo);   
function foo(){
    console.log("函数声明");
}
var foo = "变量";
```

```js
function foo(){
    console.log("函数声明");
}
var foo; // 监测到variableObject里面存在了foo，跳过
console.log(foo)// 打印函数体
foo = "变量"; //函数被覆盖
//此时要是console.log(foo)
//结果是 “变量”
```

所以执行上下文里面记录了当前环境下的一些变量，函数，this的指向。为下面的赋值，调用函数的操作奠定基础。

---

简单说一下call()

call()的用法：

function.call(Object)

就是把让function在Object的执行上下文里面，进行赋值调用等操作。

也就是function里面的this，就会变成Object了。因为function是运行在Object的上下文里面。

就像你请了一个木匠，只是木材自己提供罢了。

---

参考资料：

[深入理解javascript原型和闭包（8）——简述【执行上下文】上](http://www.cnblogs.com/wangfupeng1988/p/3986420.html)

[深入理解javascript原型和闭包（9）——简述【执行上下文】下](http://www.cnblogs.com/wangfupeng1988/p/3987563.html)

[深入理解javascript原型和闭包（11）——执行上下文栈
](http://www.cnblogs.com/wangfupeng1988/p/3989357.html)

[Javascript - 执行上下文](https://segmentfault.com/a/1190000005727668)

[如何理解和熟练运用js中的call及apply？](https://www.zhihu.com/question/20289071)

[js中是函数声明先提升还是变量先提升](http://bbs.csdn.net/topics/392018835)
