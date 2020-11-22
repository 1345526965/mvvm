function Zhufeng(options = {}){
    this.$options = options   //将所有属性挂载至options中
    //this._data
    var data = this._data = this.$options.data
    observe(data)
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
function observe(data){
    return new Observe(data)
}