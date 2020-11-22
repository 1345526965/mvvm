//发布订阅模式  先有订阅  再有发布[fn1，fn2，fn3]
//绑定的方法  都有一个update属性
function Dep(){
    this.subs = []
}
// 添加订阅
Dep.prototype.addSub = function(sub){
    this.subs.push(sub)
}

// 添加通知
Dep.prototype.notify = function(){
    this.subs.forEach(sub=> sub.update())
}


//watcher 订阅者
function Watcher(fn){ //Watch是一个类  通过这个类创建的实例都拥有update
    this.fn = fn

}
Watcher.prototype.update = function(){
    this.fn()
}
let watcher = new Watcher(function(){
    console.log(1)
})
let dep = new Dep()
dep.addSub(watcher)  //将watch放到了数组中[watcher.update]
dep.addSub(watcher)  //将watch放到了数组中[watcher.update]
console.log(dep.subs)  //发布 dep.subs中的每一项

// 通知
dep.notify()