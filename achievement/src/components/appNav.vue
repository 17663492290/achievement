<template>
    <ul class="nav">
      <!-- <router-link v-for="(item,index) in $store.state.permissions.navLists" :key="index" :to="{ path: item.path }" @click.native="setTitle(item.name)" tag="li" active-class="active"> -->
      <router-link v-for="(item,index) in navLists" :key="index" :to="{ path: item.path }" tag="li" active-class="active">
        
        <a>{{ item.name }}</a>
      </router-link> 
    </ul>
</template> 

<script>
export default {
  props: {
    'isShow': 'boolean'
  },
  data () {
    return {
       navLists: [
       {
        name: '绩效查询',
        path: '/index',
        active: true
        },
        {
          name: '提点设置',
          path: '/remind',
          active: false
        }
       ],
    }
  },
  watch:{
    $route(to,from){
      
    }
  },
  methods: {
    setTitle(name){
      document.title = name
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .nav {
    background: #232736;
    color: #a3b7d2;
    height: 40px;
    line-height: 40px;
    /*width: 100%;*/
    padding: 0 20px;
  }
  .nav li{
    text-align: center;
    height: 40px;
    line-height: 40px;
    float: left;
    cursor: pointer;
  }
  .nav li:hover a {
    color: #05b7ff;
  }
  .nav li a {
    display: block;
    min-width: 30px;
    padding: 0 15px;
    font-size: 14px;
    color: #a3b7d2;
  }
  .nav li.active {
    background: #000;
  }
  .nav li.active a {
    color: #05b7ff;
  }
</style>
