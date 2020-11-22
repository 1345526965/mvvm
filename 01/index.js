let obj = {}
Object.defineProperty(obj,'school',{
    configurable:true,
    // writable:true, //set
    enumerable:true,
    // value:'abc'   //get
    get(){ //获取obj.school的值时  会调用get方法
           return 'zfpx'
    },
    set(val){    //obj.school = 'zfpx2'   会调用set方法
        console.log(val)
    }
})
// delete obj.school
// obj.school = 'knf'
for(let key in obj){
    console.log(key)
}