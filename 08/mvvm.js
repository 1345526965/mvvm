function Zhufeng(options = {}){
    this.$options = options   //将所有属性挂载至options中
    //this._data
    var data = this._data = this.$options.data
    observe(data)
    // 数据代理  this代理了this._data  this.a代理了this._data.a
    for(let key in data){
        Object.defineProperty(this,key,{
            enumerable:true,
            get(){
                return this._data[key]
            },
            set(newVal){
                this._data[key] = newVal
            }
        })
    }
    // 编译
    console.log('-----this-------',this)
    // 计算
    initComputed.call(this)
     new Compile(options.el,this)
}
// 计算
function initComputed(){  //具有缓存功能的
    let vm = this
    let computed = this.$options.computed //Object.keys  {name:1,age:2}=>[name,age]
    Object.keys(computed).forEach(function(key){
        Object.defineProperty(vm,key,{  //computed[key]  将computed中的key放置this中
             get:typeof computed[key] === 'function'? computed[key]:computed[key]
        })
    })
    console.log('----computed---',Object.keys(computed))
}
//vm.$options
// 观察对象给对象增加ObjectDefineProperty
function Observe(data){   //这里写我们的主要逻辑
    let dep = new Dep()
    for(let key in data){   //把打他属性通过object
        let val = data[key]
        observe(val)
        //.defineProperty的方式  定义属性
        Object.defineProperty(data,key,{
            enumerable:true,
            get(){
                console.log('------get------',val)
                Dep.target && dep.addSub(Dep.target) //[watcher]
               return val
            },
            set(newVal){
                console.log('------set------',val)
                if(newVal === val){
                    return
                }
                val = newVal
                observe(newVal)  //用于第二层劫持
                dep.notify()  //让所有的watch的update方法执行即可
                
            }

        })

    } 
      
}
// 编译
function Compile(el,vm){
    // el 表示替换的范围
    vm.$el = document.querySelector(el)
    // console.log('-------vm.$el-------',vm.$el)
    // 文档碎片
    let fragment = document.createDocumentFragment()
    // 放置内存（文档碎片）(页面抽出)
    while(child = vm.$el.firstChild){
             fragment.appendChild(child)
    }
    // 解析文档碎片的dom节点
    replace(fragment,vm)
    
    // 页面添加文档碎片 vm.$appendChild代表就是dom节点
    vm.$el.appendChild(fragment)
}
// 解析文档碎片的dom节点
function replace(fragment,vm){
       Array.from(fragment.childNodes).forEach(function(node){
            let text = node.textContent
            let reg = /\{\{(.*)\}\}/
            /*
            文本判断
            */
            if(node.nodeType === 3 && reg.test(text)){
                 console.log(Object.prototype.toString.call(RegExp.$1) ) //RegExp.$1 配置正则的内容 a.a  b
                 let arr = RegExp.$1.split('.')
                 let val = vm
                //  console.log('------arr----val--',arr,val)
                 arr.forEach(function(k){  //取this.a.a this.b
                    console.log('------val-----',val)
                    val = val[k]  //用于替换
                    // console.log('---k---------val[k]------',k,val[k])
                 })
                 //双向绑定数据触发set的替换
                 new Watcher(vm,RegExp.$1,function (newVal) {
                    node.textContent = text.replace(/\{\{(.*)\}\}/,newVal)
                     
                 } )
                 //替换的逻辑
                //  {{a.a}}替换成a.a  {{b}}替换成b
                node.textContent = text.replace(/\{\{(.*)\}\}/,val)
            }
            /*
            标签判断
            */
            if(node.nodeType ===1){
                //元素节点
                let nodeAttrs = node.attributes //获取当前dom节点的属性
                Array.from(nodeAttrs).forEach(function (attr) {
                    let name = attr.name  // type = "text"
                    let exp = attr.value  //v-model="b"
                    console.log('----exp-----',exp,vm)
                    if(name.indexOf('v-') == 0){ //v-model
                        node.value = vm[exp]
                        console.log('----node.value-----',vm[exp])
                    }
                    new Watcher(vm,exp,function(newVal){
                         node.value = newVal //watcher触发时会自动将内容放到输入框内
                    })
                    // 输入框的值映射至vm中
                    node.addEventListener('input',function(e){
                        let newVal = e.target.value
                        vm[exp] = newVal
                    })
                })
            }
            if(node.childNodes){
                replace(node,vm)
            }
       })
}
// 添加观察者
function observe(data){
    if(typeof(data) != 'object'){
        return
    }
    // return new Observe(data)
    return  Observe(data)
}

/* 
发布订阅
*/
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

/*
watcher  
vm 代表data中的字段对象    a:{a:1}
data：{
  a:{a:1}
}
*/
function Watcher(vm,exp,fn){ //Watch是一个类  通过这个类创建的实例都拥有update
    this.fn = fn
    this.vm = vm
    this.exp = exp  //添加到订阅中


    // 获取exp中的值
    Dep.target = this
    let val = vm
    let arr = exp.split('.')
    arr.forEach(function (k) {  //this.a.a  默认调用get方法
        val = val[k]
    })
    Dep.target = null

}
Watcher.prototype.update = function(){
    let val = this.vm
    let arr = this.exp.split('.')
    arr.forEach(function (k) {   //this.a.a  
        console.log('----触发worker----')
        val = val[k]   
    })
    this.fn(val) //newVal
    
}