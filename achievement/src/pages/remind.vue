<template>
  <div class="sub-router">
    <div class="bHeader">
      <span class="bTitle">提点设置</span>
      <!-- <div class="check-btns"> 
        <el-button v-if = "checkShow" type="text" @click="checkToggle(0)">收起<span class="el-icon-arrow-up el-icon--right"></span></el-button>
        <el-button v-else type="text" @click="checkToggle(1)">展开<span class="el-icon-arrow-down el-icon--right"></span></el-button>
      </div> -->
    </div>
    <div class="bBody">
      <div class="bBody-content right">
        <el-collapse-transition> 
          <div v-show = "checkShow" class="checkBox">
            <div class="catagory-lt" style="width:15%;margin-left:49px">
              <label class="bold">选择城市：</label>
              <div class="input-el">
                <el-select 
                    v-model="city"
                    @change="choseCity"
                    placeholder="请选择省份">
                  <el-option
                    v-for="item in cityData"
                    :key="item.cityCode"
                    :label="item.cityName"
                    :value="item.cityCode">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="check-btn"> 
              <el-button v-if="$store.state.permissions.permissions.remind.hasOwnProperty('addAndUpdateRemind')" @click="addTable()" type="primary">添加</el-button>
            </div>
            <!-- <div class="check-btn2"> 
                <el-button v-show = "checkShow" @click="checkToggle(2)" type="text">清空</el-button>
            </div> -->
          </div>
        </el-collapse-transition>
        <div class="tableDiv remindBox">
          <el-table ref="multipleTable" 
            v-loading="loading" 
            :data="tableData" 
            border
            tooltip-effect="dark" 
            :height = 'heightCtr'
            style="width: 100%;overflow-y:auto;border:1px solid #e5e5e5;border-bottom:0;">
            <el-table-column label="城市" prop="cityName" ></el-table-column>
            <el-table-column label="启用时间" prop="remindCycle"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span class="green" v-if="scope.row.status==1">启用</span>
                <span class="red" v-else>未启用</span>
              </template>
            </el-table-column>
            <el-table-column label="设定时间" prop="updateTime"> </el-table-column>
            <el-table-column label="阶段低位（>）">
              <template slot-scope="scope">
                <ul class="detailBox">
                  <li v-for="item in scope.row.detail" :key="item.id">{{item.remindStart}}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="阶段高端（≤）">
              <template slot-scope="scope">
                  <ul class="detailBox">
                    <li v-for="item in scope.row.detail" :key="item.id">{{item.remindEnd}}</li>
                  </ul>
              </template>
            </el-table-column>          
            <el-table-column label="提成比例">
              <template slot-scope="scope">
                <ul class="detailBox">
                  <li v-for="item in scope.row.detail" :key="item.id">{{item.royaltyRatio}}%</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                  <p style="margin-bottom:5px">
                    <!-- <el-button type="primary" v-if="$store.state.permissions.permissions.remind.hasOwnProperty('setRemindStatus')" plain @click="enable(scope.row)">{{scope.row.status == 0?"启用":"禁用"}}</el-button> -->
                   <el-button type="primary" v-if="($store.state.permissions.permissions.remind.hasOwnProperty('setRemindStatus')&&scope.row.status == 0)||scope.row.status == 0" plain @click="enable(scope.row)">启用</el-button>
                   <!-- <el-button type="primary" v-if="scope.row.status == 0" plain @click="enable(scope.row)">启用</el-button> -->
                  </p> 
                  <p><el-button type="primary" v-if="$store.state.permissions.permissions.remind.hasOwnProperty('addAndUpdateRemind')" plain @click="edit(scope.row)">编辑</el-button></p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bottomBox clearfix">
          <div class="bBody-pagination">
            <el-pagination
              @size-change="pageSizeChange"
              @current-change="pageCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalValue">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      class="remindDialog"
      title="添加提点设置"
      :visible.sync="allDialog"
      width="45%"
      :before-close="closeAll"
      :close-on-click-modal="false"
      :modal-append-to-body="false">
      <div style="width:100%;mix-height:80vh;">
        <ul class="addUl clearfix">
          <li>
            <label>城市：</label>
            <div>
              <el-select 
                    v-model="addCity"
                    @change="choseCity"
                    placeholder="请选择">
                  <el-option
                    v-for="item in cityData"
                    :key="item.cityCode"
                    :label="item.cityName"
                    :value="item.cityCode">
                  </el-option>
                </el-select>
            </div>
          </li>
          <li>
            <label>生效周期：</label>
            <div>
              <el-date-picker
                v-model="cycle"
                type="date"
                format='yyyy-MM-dd HH:mm:ss'
                @change="choseCycle"
                placeholder="请选择日期">
              </el-date-picker>
            </div>
          </li>
        </ul>
        <div class="grossProfit" style="width:100%;max-height:650px;position: relative;">
          <el-table
            class="commodity"
            :data="detail"
            max-height="470"
            :cell-style="{'text-align':'center'}"
            style="width: 100%">
            <el-table-column label="段位低位（>）">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remindStart" @change="addRow(scope.$index, scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="段位高位（≤）">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remindEnd"  @change="changeVal(scope.$index, scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="提成比例" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.royaltyRatio" @change="addRow1(scope.$index,scope.row)"></el-input>
                <span class="Bcent"></span>
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template slot-scope="scope">
                <el-button class="deletion" type="primary" plain size="mini" :disabled="isDisabled" icon="el-icon-remove-outline" @click="delData(scope.$index, scope.row)"></el-button>
                <el-button class="deletion" type="primary" plain size="mini"  icon="el-icon-circle-plus-outline" @click="addData(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAll">取 消</el-button>
        <el-button type="primary" @click="reviseDetail">确 定</el-button> 
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created (){
      this.getData();
      this.cityList()
    },
    data () {
      return {
        isRemindId:'',
        timeId:'',
        cycle:"",//生效周期
        time:"",
        input:'',//添加提点弹框
        allDialog:false,
        disabled:false,
        detail: [
          {
            remindStart:'',
            remindEnd:'',
            royaltyRatio: ''
          }, 
          {
            remindStart:'',
            remindEnd: '',
            royaltyRatio: ''
          },
          {
            remindStart:'',
            remindEnd: '',
            royaltyRatio: ''
          }
        ],
        city:'',//城市
        addCity:'',//添加、修改提点 城市
        cityData:[],
        checkShow: true,
       
        tableData: [],
        rowIndex: '-1',
        OrderIndexArr: [],

        pageSizes: [10, 15, 30, 40],
        pageSize: 10,
        currentPage: 1,
        totalValue: 0,
        loading: false,

        dialogShow:false,
        dialogVisible:false,
        priceDialogShow:false,
        dialogTableVisible:false,
        dialog:false,

        defaultProps: {
          children: 'children',
          label: 'label'
        },
        heightCtr: 'calc(100vh - 255px)'
      }
    },
    computed: {
      isDisabled(){
        if(this.detail.length<=1){
          return this.disabled = true
        }else{
          return this.disabled = false
        }
      }
    },
    mounted(){
      // if (document.querySelector('.el-table__body-wrapper')) {
      //   var that = this;
      //   document.querySelector('.el-table__body-wrapper').onscroll = function(){
      //     that.checkShow = false
      //   }
      // }
      // if (document.querySelector('.list_box')) {
      //   var that = this;
      //   document.querySelector('.list_box').onscroll = function(){
      //     that.checkShow = false
      //   }
      // }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      // checkShow(val){
      //   if(val){
      //     this.heightCtr = 'calc(100vh - 280px)'
      //   }else{
      //     this.heightCtr = 'calc(100vh - 239px)'
      //   }
      // }
    },
    methods: {
      changeVal (index,row) {//高位
        if(Number(row.remindStart)>=Number(row.remindEnd)){
          this.$message({
            type: 'error',
            message: "高位不能小于等于低位，请重新输入"
          });
          return
        }
        let numReg = /^[0-9]*[1-9][0-9]*$/;
        if(!numReg.test(row.remindEnd)){
            this.$message({
              type: 'error',
              message: "只能输入数字，请重新输入"
            });
            return
        }
        this.detail.map((item,i) => {
          if(this.detail[0].remindEnd!=''&&this.detail[0].remindStart==""){
            this.detail[0].remindStart=0
          }
          if(index == i && this.detail[i+1]) {
            this.detail[i+1].remindStart = this.detail[i].remindEnd;
          }
        })
      },
      addRow(index,row){//低位
        if(row.remindEnd!=""&&row.remindEnd!=""&&Number(row.remindStart)>=Number(row.remindEnd)){
          this.$message({
            type: 'error',
            message: "低位不能大于或等于高位，请重新输入"
          });
          return
        }
        let numReg =/^[0-9]+$/;///^[0-9]*[1-9][0-9]*$/;
        if(!numReg.test(row.remindStart)){
           this.$message({
              type: 'error',
              message: "只能输入数字，请重新输入"
            });
            return
        }
        this.detail.map((item,i) => {
          if(i > 0 &&(Number(this.detail[i].remindStart)<Number(this.detail[i-1].remindEnd))) {
            this.$message({
              type: 'error',
              message: "请正确输入数字"
            });
            return
          }
        })
      },
      addRow1(index,row){//比例
        let ratioReg = /(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,2}$)/
        if(!ratioReg.test(row.royaltyRatio)){
          this.$message({
            type: 'error',
            message: "请输入不能为负数，小于100且小数点最多保留两位"
          });
          return
        }
        // if (index == (this.detail.length-1)){
        //   if(row.remindStart && row.remindEnd && row.royaltyRatio != ''){
        //     var list ={
        //       remindStart:'',
        //       remindEnd:'',
        //       royaltyRatio: ''
        //     }
        //     this.detail.push(list)
        //   }
        //   this.detail[this.detail.length-1].remindStart = this.detail[this.detail.length-2].remindEnd;
        // }
      },
      delData(index,row){
        for(let i = 0;i<this.detail.length;i++){
          if(index == i){
            this.detail.splice(i,1)
          }
        }
      },
      addData(index,row){
        var list ={
          remindStart:'',
          remindEnd:'',
          royaltyRatio: ''
        }
        this.detail.push(list);
        this.detail.map((item,i) => {
          if(this.detail[0].remindEnd!=''&&this.detail[0].remindStart==""){
            this.detail[0].remindStart=0
          }
          if(index == i && this.detail[i+1]) {
            this.detail[i+1].remindStart = this.detail[i].remindEnd;
          }
        })
      },
      //初始化列表数据
      getData () {
        let ip = `/remindlist/getRemindList`;
        // let ip = `/api/api/remindlist/getRemindList`;
        this.$store.commit('setBid','2064');
        this.loading = true;
        this.$http.get(ip,{
          params:{
            cityId:this.city,
            pageNum:this.currentPage-1,
            pageSize:this.pageSize
        }})
        .then((res) => {
          this.loading = false;
          if(res.data.code == 0){
            res.data.result.forEach((item)=>{
              item.detail.forEach((item)=>{
                item.remindStart = Number(item.remindStart)/100
                item.remindEnd = Number(item.remindEnd)/100
                item.royaltyRatio=Number(item.royaltyRatio)/100;
              })
            })
            this.tableData = res.data.result;
            this.totalValue = res.data.total;
          }else{
            this.tableData =[]
          }
          
        }, (err) => {
          this.loading = false;
          console.log(err);
        })
      },
      search () {
        this.getData();
      },
      checkToggle(type){
        if(type != 2){
          this.checkShow = !this.checkShow
        }
        if(type == 2){
          this.city = ""
        }
        this.getData();
      },

      //城市筛选
      choseCity:function() {
        if(this.city!=""){
           console.log(this.city,"界面筛选城市")
           this.getData();
        }
        console.log(this.addCity,"添加时间")
      },
      cityList(){
        let ip = `http://gateway.lvzheng.com/xiaowei-api/iteminfo/getCityInfoByStatus`
        this.$http.get(ip,{
        })
        .then((res) => {
          this.cityData = res.data.result;
        }, (err) => {
          console.log(err);
        })
      },
      //生效周期
      choseCycle(){
        let y = this.cycle.getFullYear();
        let m = this.cycle.getMonth() + 1;
        let d = this.cycle.getDate();
        let h = this.cycle.getHours();
        let f = this.cycle.getMinutes();
        let s = this.cycle.getSeconds();
        this.time = y+"-"+this.add(m)+"-"+this.add(d)+" "+this.add(h)+":"+this.add(f)+":"+this.add(s);
      },
      add(m){
        return m<10?'0'+m:m 
      },
      pageSizeChange(val) {
        this.pageSize
        this.getData()
      },
      pageCurrentChange(val) {
        this.currentPage = val;
        this.getData()
      },
      
      
      enable(row){
        if(row.status==1){
          row.status=0;
          this.$confirm('是否禁用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false
          }).then(() => {
            let ip = `/remindlist/setRemindStatus`;
            // let ip = `/api/api/remindlist/setRemindStatus`;
            this.$store.commit('setBid','2066');
            this.$http.post(ip,{
              cityId:row.cityId,
              remindId:row.remindId,
              status:row.status
            }).then((res)=>{
              this.getData()
              this.$message({
                type: 'success',
                message: '禁用成功!'
              });
            },(err)=>{
              console.log(err)
            })
            
           
          }).catch(() => {
            row.status=1;
             closeOnClickModal:false
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });
          return 
        }
        if(row.status==0){
          row.status=1;
          this.$confirm('是否启用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false
          }).then(() => {
            let ip = `/remindlist/setRemindStatus`;
            // let ip =`/api/api/remindlist/setRemindStatus`;
            this.$store.commit('setBid','2066');
            this.$http.post(ip,{
              cityId:row.cityId,
              remindId:row.remindId,
              status:row.status
            }).then((res)=>{
              this.getData()
              this.$message({
                type: 'success',
                message: '启用成功!'
              });
            },(err)=>{
              console.log(err)
            })
          }).catch(() => {
            row.status=0;
            closeOnClickModal:false
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });
        } 
      },
      addTable(){
        this.isRemindId='';
        this.addCity="";
        this.cycle="";
        this.detail=[];
        let list ={
          remindStart:'',
          remindEnd:'',
          royaltyRatio: ''
        }
        for(var i =0;i<3;i++){
          this.detail.push({
          remindStart:'',
          remindEnd:'',
          royaltyRatio: ''
        })
        }
        this.allDialog=true;
      },
      //添加、修改 阶段高低位，比例
      reviseDetail(){
        if(this.addCity==""){
          this.$message({
            type: 'error',
            message: "请选择城市再提交"
          });
          return
        }else if(this.cycle==""||this.cycle==null){
            this.$message({
              type: 'error',
              message: "请选择周期再提交"
            });
            return
        }
        for(var i = 0;i<this.detail.length;i++){
          if(this.detail[i].remindStart!=""&&this.detail[i].remindEnd!=""&&this.detail[i].royaltyRatio==""||this.detail[i].remindStart!=""&&this.detail[i].remindEnd==""&&this.detail[i].royaltyRatio!="" ){//判断
            this.$message({
              type: 'error',
              message: "请填写完成"
            });
            return
          }
          if(i>0&&(Number(this.detail[i].remindStart)<Number(this.detail[i-1].remindEnd))){
            this.$message({
              type: 'error',
              message: "请正确输入数字"
            });
            return
          }
          if((Number(this.detail[i].remindStart)>Number((this.detail[i].remindEnd)))&&this.detail[i].remindEnd!=""){
            this.$message({
              type: 'error',
              message: "高位不能小于等于低位，请重新输入"
            });
            return
          }
          if((Number(this.detail[i].remindStart) == Number(this.detail[i].remindEnd)&&(this.detail[i].remindStart!=""&&this.detail[i].remindEnd!=""))){
            this.$message({
              type: 'error',
              message: "低位、高位不能相等，请重新输入"
            });
            return
          }
          //验证是否为数字
          let numReg = /^[0-9]+$/;
          if(!numReg.test(this.detail[i].remindStart)&&this.detail[i].remindStart!=""){
              this.$message({
                type: 'error',
                message: "只能输入数字，请重新输入"
              });
              return
          }
          if(!numReg.test(this.detail[i].remindEnd)&&this.detail[i].remindEnd!=""){
              this.$message({
                type: 'error',
                message: "只能输入数字，请重新输入"
              });
              return
          }
        }
        
        if(this.detail[this.detail.length-1].remindStart!=""&&this.detail[this.detail.length-1].remindEnd==""||this.detail[this.detail.length-1].royaltyRatio==""){
          this.detail.splice(this.detail.length-1,1)
        }
     
        // let num = "1"
        // let arr = JSON.parse(JSON.stringify(this.detail));
        // for(var i = 0;i<arr.length;i++ ){
        //   if(num==String(arr[i].royaltyRatio).indexOf('.')){
        //     arr[i].royaltyRatio=parseFloat(arr[i].royaltyRatio)*100
        //   }
        // }
        this.detail.map(item=>{
          item.remindStart = Number(item.remindStart)*100
          item.remindEnd = Number(item.remindEnd)*100
          item.royaltyRatio = Number(item.royaltyRatio)*100
        })
        this.allDialog=true;
        
        let ip =`/remindlist/addAndUpdateRemind`;
        // let ip =`/api/api/remindlist/addAndUpdateRemind`;
        this.$store.commit('setBid','2067');
        this.$http.post(ip,{
          cityId:this.addCity,
          remindCycle:this.time,
          id:this.timeId,
          // detail:arr,
          detail:this.detail,
          remindId:this.isRemindId
        }).then((res)=>{
          this.allDialog=false;
          if(res.data.code==0){
            this.$message({
              type: 'success',
              message: res.data.message
            });
          }
          this.getData()
        },(err)=>{
          this.allDialog=false;
          if(res.data.code!=0){
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
          console.log(err)
        })    
      },
      edit(row){
        this.allDialog = true;
        this.cycle = row.remindCycle;
        this.isRemindId = row.remindId;
        this.addCity = row.cityId;
        this.detail = row.detail;
        this.timeId = row.id;  
      },
      closeAll(){
          this.allDialog = false;
          this.getData()
      }
    }
  }
</script>
<style lang="less" scoped>
  .bHeader{
    box-sizing: border-box;
    height: 35px;
    line-height: 35px;
    .bTitle{
      color:#232736;
      font-size: 18px;
    }
  }
  .custom-tree-node {
    display: inline-block;
    width: 100%;
    line-height: 27px;
    padding-left: 10px;
    .btn-content {
      position: absolute;
      right: 0px;
    }
    .el-button {
      padding: 2px 0px;
    }
  }
  .list_box{
    border-top: 2px solid #ccc;
    float: left;
    width:100%;
    overflow-y: auto
  }
  .check-btn{
    float:right;
    position: absolute;
    right:10%;bottom:12px;
    .el-button{
      margin-left:5px;
      padding: 2px 4px;
      width:100px;
      height:32px;
      background:rgba(0,151,230,1);
      border-radius:3px;
    }
  }
  .check-btns{
    float: right;
    height: 50px;
  }
  .sub-router{
    position: fixed;
    top: 102px;
    left: 1.5%;
    width: 97%;
    right: 0;
    min-width: 1280px;
    overflow: hidden;
  }
  .right{
    width: 100%;
    height:calc(100vh - 162px);
    box-sizing: border-box;
  }

  .focus{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .bBody{background-color: #fff;}
  .bBody-nav{padding:7px 15px 7px;background-color:#fffeed;}
  .bBody-content{ border-top:1px solid #e5e5e5;}
  .checkBox{position: relative;}
  .check-btn2{position: absolute;right:16px;bottom:8px}
  .catagory-lt,.catagory-mid,.catagory-rt{margin-top:13px;display: inline-block;}
  .catagory-lt { line-height: 30px; height:30px;}
  .catagory-lt{
    width:41.97%;
    margin-bottom:13px;
    .input-el{
      width:120px;height:30px;margin-right:1%
    }
    .commodityStuta_Box{
      height: 31px;
    }
  }
  .catagory-lt label{
    display: inline-block;
  }
  .catagory-lt div{
    display: inline-block;
  }
 .catagory-lt2{
    margin:25px 0px 0 0px;
    display: flex;
    float: left;
    width:120px;
    line-height: 30px;
  }
  .clearfix:after{
    visibility:hidden;
    display:block;
    font-size:0;
    content: " ";
    clear:both;
    height:0;
  }
  .clearfix{
    *zoom:1;
  }
  .bBody-pagination{
    position: fixed;
    bottom: 10px;
    right:0;
    background-color: #fff;
    padding:7px;
    text-align: center;
    width: 100%;
    z-index:2000;
  }
  .parentAside{
    padding:22px;
  }
  .openBtn{
    float:left;
    width:8px;
    height:100%;
    display :flex;
    display:-webkit-flex;
    align-items:center;
    -webkit-align-items:center; 
    justify-content:center; 
    padding:1px;
    text-align:center;
    background-color:#eee;
    color:#aaa;
    border-radius: 3px;
    cursor: pointer;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    width:0px;
  }
  .list_box{
    li{
      border-bottom:1px solid #f0f0f0;
      padding:20px 0;
      margin: 0 30px;
    }
    h1{
      font-size:18px;
    }
    .list_content{
      font-size:12px;
      margin:16px 0;
      line-height:22px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .list-icons{
      color: #aaa;
      font-size: 14px;
    }
    .line3{
      span{
        line-height:20px;
      }
       .icon{
          display: inline-block;
          width:15px;
          height:15px;
          vertical-align: middle;
          margin-right:3px;
      }
    } 
  }

  .bottomBox{
    float:  left;
    background-color: #fff;
    width: 100%;
  }
  .bBody-none{
    text-align: center;
    padding: 20px 0;
    font-size: 14px;
    color: #ccc;
  }
  .addUl li{
    font-size: 13px;
    float:left;
    width:48%;
    margin:20px 0;
    label{
      float:left;
      margin-left:2%;
      margin-top: 3px;
    }
    div{
      float:left;
      width:150px;
    }
  }
  .addUl li:first-child{
    margin-right:6%;
    width:46%
  }
  .addUl li:last-child{
    div{
      width:200px
    }
  }
  .deletion{
    padding: 4px 7px;
    font-size: 13px;
  }
  .detailBox li{
    border-bottom:1px solid #e5e5e5 ;
    padding:5px 0
  }
  .detailBox li:last-child{
    border-bottom:none
  }
  .green{
    color:#00CB56
  }
  .red{
    color:#FF0000
  }
  .Bcent{
    position:absolute;
    right:17px;
    bottom:10px;
    display: inline-block;
    width:14px;
    height:16px;
    background: url(../assets/images/Bcent.png) no-repeat center
  }
</style>
