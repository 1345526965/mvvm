function Zhufeng(options = {}){
    this.$options = options   //将所有属性挂载至options中
    //this._data
    var data = this._data = this.$options.data
    observe(data)
    // 数据代理
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
     new Compile(options.el,this)
}

//vm.$options
// 观察对象给对象增加ObjectDefineProperty
function Observe(data){   //这里写我们的主要逻辑
    for(let key in data){   //把打他属性通过object
        let val = data[key]
        observe(val)
        //.defineProperty的方式  定义属性
        Object.defineProperty(data,key,{
            enumerable:true,
            get(){
               return val
            },
            set(newVal){
                if(newVal === val){
                    return
                }
                val = newVal
                observe(newVal)  //用于第二层劫持
                console.log(val)
            }

        })

    } 
      
}
// 编译
function Compile(el,vm){
    // el 表示替换的范围
    vm.$el = document.querySelector(el)
    // console.log('-------vm.$el-------',vm.$el.firstChild)
    // 文档碎片
    let fragment = document.createDocumentFragment()
    // 放置内存（文档碎片）(页面抽出)
    while(child = vm.$el.firstChild){
             fragment.appendChild(child)
    }
    // 解析文档碎片的dom节点
    replace(fragment,vm)
    
    // 页面添加文档碎片 vm.$el 相当与dom节点
    vm.$el.appendChild(fragment)
}
// 解析文档碎片的dom节点
function replace(fragment,vm){
       Array.from(fragment.childNodes).forEach(function(node){
            let text = node.textContent
            let reg = /\{\{(.*)\}\}/
            if(node.nodeType === 3 && reg.test(text)){
                 console.log(Object.prototype.toString.call(RegExp.$1) ) //RegExp.$1 配置正则的内容 a.a  b
                 let arr = RegExp.$1.split('.')
                 let val = vm
                 arr.forEach(function(k){  //取this.a.a this.b
                    val = val[k]
                 })
                //  {{a.a}}替换成a.a  {{b}}替换成b
                node.textContent = text.replace(/\{\{(.*)\}\}/,val)
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