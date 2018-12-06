#  JS event loop以及宏任务微任务

JavaScript是一门单线程的语言。

JavaScript的处理过程：

1. JavaScript执行**执行栈**中的代码
2. 若遇到异步代码，交与异步模块处理
3. JavaScript执行执行栈接下来的代码
4. 异步模块处理完成，将回调函数压入**任务队列**
5. JavaScript执行完执行栈里的代码
6. JavaScript执行完任务队列中的代码。
7. 进入渲染逻辑。



**宏任务**就是执行栈优先级的任务，它可能会引起渲染的更新，例如set的异步事件，I/O，rendering。

**微任务**就是任务队列优先级的任务，它们按压入时间顺序先后被JavaScript引擎先后执行，在下一次宏任务执行之前必须情况当前任务队列。例如Promise，MutationObserver。

***(注：上诉宏任务微任务的举例在不同的浏览器中的归类不尽相同)***



所以JavaScript的even loop机制就是

1. 执行完执行栈的宏任务
2. 执行完任务队列的微任务
3. 进入渲染逻辑，等待执行栈新任务。

***(注：Nodejs中的event loop与浏览器中的不尽相同)***



测试题

```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

Promise.resolve().then(function() {
  console.log('promise3');
}).then(function() {
  console.log('promise4');
});

console.log('script end');
```

  

  

  

  

```js
//script start 宏任务
//script end 宏任务
//promise1 微任务 任务队列 1任务
//promise3 微任务 任务队列 2任务
//promise2 微任务 任务队列 3任务
//promise4 微任务 任务队列 4任务
//渲染逻辑
//setTimeout 下一个宏任务
```



***（有机会更新async异步函数存在的情况下的执行过程）***

--- 

[JavaScript 运行机制详解：再谈Event Loop - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

[译文：JS事件循环机制（event loop）之宏任务、微任务](https://segmentfault.com/a/1190000014940904)

[JavaScript 异步、栈、事件循环、任务队列](https://segmentfault.com/a/1190000011198232)

