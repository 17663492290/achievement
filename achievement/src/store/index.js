import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
    state:{
        permissions:{
            permissions:{
                index:{
                    insert:''
                },
                remind:{
                    setRemindStatus:'',
                    addAndUpdateRemind:'',
                },
            },
            employer:{}            
        },
        bid:''
    },
    mutations:{
        initPermission(state,n){//这里的state对应着上面这个state
            state.permissions = n?n:{};
            //你还可以在这里执行其他的操作改变state
        },
        setBid(state,n){
            if(n){
               state.bid = n
            }else{
               state.bid = ''
            }
                    
        }
        
    },
})