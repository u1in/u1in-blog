# Javascript的值传递方式

> ♫我记得那瞬间，相拥一起不會疲倦♫

今天也没遇到什么麻烦，就是想记录一下JavaScript的传值方式

一个例子

```js
function setName(obj) {
  obj.name = 'Nicholas';
  obj = new Object();
  obj.name = 'Greg';
}

var person = new Object();
setName(person);
alert(person.name); // Nicholas
```

按照平常的理解，obj是一个person的引用，指向同一块内存。一开始为person添加了一个属性，而后给person赋了一个空的对象，再重新给person添加了一个字段。所以最后person里面应该是只有一个属性name: 'Greg'，的对象。

但是事实不是这样。。*（我已经习惯了，Js嘛。。）*

所以Js啊，你到底是什么传递方式啊？？？？

---

再引入一个更好解释的例子

```js
function changeStuff(a, b, c) {
  a = a * 10;
  b.item = "changed";
  c = {item: "changed"};
}

var num = 10;
var obj1 = {item: "unchanged"};
var obj2 = {item: "unchanged"};

changeStuff(num, obj1, obj2);

console.log(num);
console.log(obj1.item);    
console.log(obj2.item);
```

猜猜看吧。。。结果。。

```js
10
changed
unchanged
```

你怎么又。。哎。。

假设Js传参的方式是传值调用的话，那么传入函数的应该是实参的副本。也就是a，b，c是num，obj1，obj2的拷贝。所以a，b，c无论怎么改变，num，obj1，obj2都不会改变。

**但是此处obj1改变了**

所以Js的参数传递**应该**不是值传递

那么是不是传引用调用呢。传引用调用就是说，a，b，c和num，obj1，obj2指向同一块内存，任何一个值的改变都会改变对应内存的值。

看起来也不是，因为num，obj2没有改变它的值。

---

**Js又不是值传递，又不是引用传递，那还有什……没错正是传共享调用(Call by sharing)**

什么是传共享调用呢。

跟传引用调用类似，传引用调用是把内存的地址赋给形参。

传共享调用就是 传引用它的指针给形参。也就是把num，obj1，obj2本身的值传给a，b，c而不是前三者指向的内存块。

**代码分析：**

```js
var num = 10;
var obj1 = {item: "unchanged"};
var obj2 = {item: "unchanged"};
```

![代码分析1](https://camo.githubusercontent.com/e52954db2af54e73761dda4813de1ebb85a04eca/687474703a2f2f6f683179776a7971662e626b742e636c6f7564646e2e636f6d2f626c6f672f323031372d30322d31392d49732d4a6176615363726970742d612d706173732d62792d7265666572656e63652d6f722d706173732d62792d76616c75652d6c616e67756167652d322e706e67)

调用函数

```js
changeStuff(num, obj1, obj2);
```

![代码分析2](https://camo.githubusercontent.com/a1c778280c8be3e39fc6b4e5cb8353cc1be08af2/687474703a2f2f6f683179776a7971662e626b742e636c6f7564646e2e636f6d2f626c6f672f323031372d30322d31392d49732d4a6176615363726970742d612d706173732d62792d7265666572656e63652d6f722d706173732d62792d76616c75652d6c616e67756167652d332e706e67)

可以看出a是num的值的拷贝。b，c就是obj1，obj2的拷贝。b，obj1是同样的指针指向同一块内存。c，obj2同理。

执行函数体

```js
a = a * 10;
b.item = "changed";
c = {item: "changed"};
```

![代码分析3](https://camo.githubusercontent.com/3a91a6fb0ba0c3d2414389f6d8f0b5cc551515f4/687474703a2f2f6f683179776a7971662e626b742e636c6f7564646e2e636f6d2f626c6f672f323031372d30322d31392d49732d4a6176615363726970742d612d706173732d62792d7265666572656e63652d6f722d706173732d62792d76616c75652d6c616e67756167652d352e706e67)

由图可知

b.item的修改会导致对应内存地址的数据的改变。

c是被赋予一个全新的地址块的指针了。

---

细心的同学一想，什么啊，你这个不就是传值调用嘛。。

**a传的是num的值的拷贝，b传的是obj（一个指针）的拷贝，c也是一个指针的拷贝。**

所以其实JavaScript还是传值调用的。只是要知道传的到底是什么值，就好理解多了。

---
我大概的总结就是。

**等号右边是基本数据类型的赋值，就是实实在在的传一个值给变量。**

**等号右边是对象的赋值，是传一个对象的指针给变量。**

看看下面这些题，应该能豁然开朗一些吧。

```js
var a = [1,2,3];

var b = a;

a = [4,5,6];

alert(b); //[1,2,3]
```

等号右边是[1,2,3]，是数组，也是对象。所以a是这个对象的一个指针。然后把var b = a；所以b也是一个指向[1,2,3]的指针，a和b的值是一样的。然后再a = [4,5,6]，这时候把一个全新的指针赋值给了a，覆盖掉了原来的指针。但是b还是指向[1,2,3]的指针，所以alert(b)也就是[1,2,3]

```js
var a = [1,2,3];

var b = a;

a.pop();

alert(b); //[1,2]
```

一开始a是一个指向[1,2,3]的指针，然后b跟a一样是一个指向[1,2,3]的指针，然后a进行了pop()操作，也就是[1,2,3].pop()。所以b指向的地址里面的数据也就变成了[1,2]



现在应该清晰了很多了吧。

下面再来一个阿里的面试题吧

```js
var a = 1;

var obj = {
    b: 2
};
var fn = function () {};
fn.c = 3;

function test(x, y, z) {
    x = 4;
    y.b = 5;
    z.c = 6;
    return z;
}
test(a, obj, fn);
alert(a + obj.b + fn.c);
```

答案在html注释里面啦，祝会是你心目中的答案。

<!-- 答案: 12-->

---

参考资料：
[JavaScript 是传值调用还是传引用调用？ · Issue \#32 ](https://github.com/nodejh/nodejh.github.io/issues/32)
[Js的引用赋值与传值赋值 - xixi_xixi - 博客园](https://www.cnblogs.com/telnetzhang/p/5714920.html)
