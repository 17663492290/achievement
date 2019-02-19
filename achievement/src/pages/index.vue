<template>
  <div class="sub-router">
    <div class="bHeader">
      <span class="bTitle">业绩提成总表</span>
      <!-- <div class="check-btns"> 
        <el-button v-if = "checkShow" type="text" @click="checkToggle(0)">收起<span class="el-icon-arrow-up el-icon--right"></span></el-button>
        <el-button v-else type="text" @click="checkToggle(1)">展开<span class="el-icon-arrow-down el-icon--right"></span></el-button>
      </div> -->
    </div>
    <div class="bBody">
      <div class="bBody-content right">
        <el-collapse-transition> 
          <div v-show = "checkShow" class="checkBox">
            <div class="catagory-lt" style="width:15%;margin:15px 68px 0 49px;">
              <label class="bold">选择城市：</label>
              <div class="input-el">
                <el-select 
                    v-model="city"
                    @change="choseCity"
                    placeholder="请选择城市">
                  <el-option
                    v-for="item in cityData"
                    :key="item.cityCode"
                    :label="item.cityName"
                    :value="item.cityCode">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="catagory-lt" style="width:13%;margin-right:92px">
              <label for="commodityName" class="bold">周期：</label>
              <div class="input-el">
                <el-date-picker
                  v-model="cycle"
                  type="month"
                  value-format='yyyy-MM'
                  @change="choseCycle"
                  placeholder="请选择"
                  :clearable="clearable">
                </el-date-picker>
              </div>
            </div>
            <div class="catagory-lt" v-if="this.isDep == true">
              <label for="commodityName" class="bold">部门：</label>
              <div class="input-el">
                <el-select 
                    v-model="firstDepartment"
                    value-key='org_name'
                    @change="choseDepartment"
                    placeholder="请选择">
                  <el-option
                    v-for="item in firstData"
                    :key="item.org_id"
                    :label="item.org_name"
                    :value="item.org_id">
                  </el-option>
                </el-select>
              </div>
              <div v-if="isDepartment == true" class="input-el">
                <el-select 
                    v-model="department"
                    @change="choseArea"
                    placeholder="请选择">
                  <el-option
                    v-for="item in departmentData"
                    :key="item.org_id"
                    :label="item.org_name"
                    :value="item.org_id">
                  </el-option>
                </el-select>
              </div>
              <div v-if="isArea == true" class="input-el">
                <el-select
                  v-model="area"
                  @change="choseMinistry"
                  placeholder="请选择">
                  <el-option
                    v-for="item in areaData"
                    :key="item.org_id"
                    :label="item.org_name"
                    :value="item.org_id">
                  </el-option>
                </el-select>
              </div>
              <div v-if="isMinistry == true" class="input-el">
                <el-select
                  v-model="ministry"
                  placeholder="请选择"
                  @change="choseDep">
                  <el-option
                    v-for="item in ministryData"
                    :key="item.org_id"
                    :label="item.org_name"
                    :value="item.org_id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="catagory-lt" style="width:10%;margin-left:3%">
              <el-button v-if="$store.state.permissions.permissions.index.hasOwnProperty('insert')" type="primary" @click="choseFile">归档</el-button>
            </div>
            <!-- <div class="check-btn"> 
                <el-button v-show = "checkShow" @click="checkToggle(2)" type="text">清空</el-button>
            </div> -->
          </div>
        </el-collapse-transition>
        <div class="tableDiv tableDivBox">
          <el-table ref="multipleTable" 
            v-loading="loading" 
            :data="tableData" 
            border
            tooltip-effect="dark" 
            :height = 'heightCtr'
            style="width: 100%;overflow-y:auto;border-bottom:0;">
            <el-table-column width="1"></el-table-column>
            <el-table-column label="城市" sortable prop="cityName"></el-table-column>
            <el-table-column label="部门" sortable prop="depName"></el-table-column>
            <el-table-column label="员工" sortable prop="empName"> </el-table-column>
            <el-table-column prop="totalAchievement" label="签单业绩" sortable>
              <template slot-scope="scope">
                <span v-if="Number(scope.row.totalAchievement>0)">￥{{scope.row.totalAchievement}}</span>
                <span class="red" v-if="Number(scope.row.totalAchievement<=0)">￥{{scope.row.totalAchievement}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalProfit" label="签单毛利" sortable>
              <template slot-scope="scope">
                <span v-if="Number(scope.row.totalProfit>0)">￥{{scope.row.totalProfit}}</span>
                <span class="red" v-if="Number(scope.row.totalProfit<=0)">￥{{scope.row.totalProfit}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="monthCommission" label="本月提成" sortable>
              <template slot-scope="scope">
                <span v-if="Number(scope.row.monthCommission>0)">￥{{scope.row.monthCommission}}</span>
                <span class="red" v-if="Number(scope.row.monthCommission<=0)">￥{{scope.row.monthCommission}}</span>
              </template>
            </el-table-column>          
            <!-- <el-table-column label="上月修正" sortable>
              <template slot-scope="scope">
                <span class="red">-{{scope.row.correctCommission}}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="合计提成" sortable prop="finalCommission"></el-table-column> -->
            <el-table-column prop="profitRatio" label="毛利率" sortable >
              <template slot-scope="scope">
                <span v-if="Number(scope.row.profitRatio)>0">{{scope.row.profitRatio}} %</span>
                <span class="red" v-if="Number(scope.row.profitRatio)<=0">{{scope.row.profitRatio}} %</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                 <el-button type="text" @click="checkDetails(scope.row)">查看明细</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div v-if="tableData == false" class = "no-data">Loading</div> -->
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
  </div>
</template>

<script>
  export default {
    created (){
      this.timeData()
      this.choseFirst();
      this.cityList(); 
    },
    data () {
      return {
        clearable:false,
        isDep:true,
        time:'',
        firstName:'',
        depName:'',
        areaName:'',
        ministryName:'',
        deptListId:"",
        isDepartment:false,
        isArea:false,
        isMinistry:false,
        city:"",//城市
        cityData:[],
        cycle:"",//周期
        firstDepartment:'',//一级部门
        department:'',//部门
        area:"",//部门区域
        ministry:"",//部
        firstData:[],
        departmentData:[],
        areaData:[],//部门区域数据
        ministryData:[],
      
        checkShow: true,
 
        indexPrev:0,
        ishover: -1,
        commodityCategory: '',
        commodityName: '',
        tableData: [],

        pageSizes: [10, 15, 30, 40],
        pageSize: 10,
        currentPage: 1,
        totalValue: 0,
        loading: false,

        // dialogShow:false,
        // dialogVisible:false,
        // priceDialogShow:false,
        // dialogTableVisible:false,
        dialog:false,
    
        defaultProps: {
          children: 'children',
          label: 'label'
        },

        categoryId:'',
        heightCtr: 'calc(100vh - 255px)'
      }
    },
    mounted(){
      // if (document.querySelector('.el-table__body-wrapper')) {
      //   var that = this;
      //   document.querySelector('.el-table__body-wrapper').onscroll = function(){
      //     that.checkShow = false
      //   }
      // }
    },
    watch: {
      // checkShow(val){
      //   if(val){
      //     this.heightCtr = 'calc(100vh - 307px)'
      //   }else{
      //     this.heightCtr = 'calc(100vh - 239px)'
      //   }
      // }
    },
    methods: {
      timeData(){
        let y = new Date().getFullYear();
        let m = new Date().getMonth() + 1;
        this.time = y+"-"+this.add(m);
        this.cycle=this.time;
      },
      add(m){
        return m<10?'0'+m:m 
      },
      //初始化列表数据
      getData () {
        let ip = `/kpistatistical/query`;
        // let ip =`/api/api/kpistatistical/query`;
        this.$store.commit('setBid','2063');
        this.loading = true;
        if(this.cycle==null||this.cycle==""){
           this.timeData()
           this.cycle+"-01 00:00:00"
           return 
        }else if((this.cycle!=null&&this.cycle!="")&&this.cycle.length != 19){
          this.cycle=this.cycle+"-01 00:00:00";
        }
          this.$http.post(ip,{
            cityId:this.city,
            pageNum:this.currentPage-1,//页码
            pageSize:this.pageSize,
            cycleTime:this.cycle,
            orgIdOrEmpId:this.deptListId
          }).then((res) => {
            this.loading = false;
            this.totalValue = res.data.total;
            if(res.data.code == 5555){
              this.$message({
                type: 'error',
                message: "请先设置提点设置"
              });
            }
            if( res.data.code == 0){
              res.data.result.map((item) => {
                item.totalAchievement = Number(item.totalAchievement)/100;
                item.totalProfit = Number(item.totalProfit)/100;
                item.monthCommission = Number(item.monthCommission)/100;
                item.profitRatio = Number(item.profitRatio)/100
              })
              this.tableData =  res.data.result;
              console.log(this.tableData)
            }else{
              this.tableData = []
            }
            
          }, (err) => {
            this.loading = false;
            console.log(err);
          })
      },
      checkToggle(type){
        if(type != 2){
          this.checkShow = !this.checkShow
        }
        if(type == 2){
          this.city=1;
          this.timeData()
          this.department="";
          this.area="";
          this.ministry=""
        }
        if(this.firstDepartment == ""){
          this.isDepartment = false;
          this.isArea = false;
          this.isMinistry = false;
        }
        this.getData();
      },
      //选择周期
      choseCycle(value){
        this.getData()                  
      },
      //城市筛选
      choseCity:function() {
        this.getData() 
      },
      cityList(){
        let ip = `http://gateway.lvzheng.com/xiaowei-api/iteminfo/getCityInfoByStatus`
        this.$http.get(ip,{ })
        .then((res) => {
          this.cityData = res.data.result;
        }, (err) => {
          console.log(err);
        })
      },
      //选择部门一级
      choseFirst:function() {
        let ip = `/loginAdmin/getLoginInfo`;
        // let ip =`/api/api/loginAdmin/getLoginInfo`;
        this.$http.get(ip,{
        }).then((res)=>{
          this.firstData = JSON.parse(res.data.result.deptAdmin)
          this.city = Number(res.data.result.cityId);
          if( this.firstData.length == 0){
            this.isDep = false;
            this.deptListId = res.data.result.empId
          }else{
            this.firstDepartment = this.firstData[0].org_id;
            if(res.data.result.empType == 0 ){
              this.isDep = false;
            }else if(res.data.result.empType == 1 ){
              this.isDep = true;
              this.choseDepartment(this.firstData[0].org_id)
              this.deptListId = this.firstDepartment;
            }
          }         
          // this.getData()
        },(err)=>{
          console.log(err)
        })

      },
      choseDepartment:function(dep) {
        let ip = `/kpistatistical/getChildOrganzie`;
        // let ip = `/api/api/kpistatistical/getChildOrganzie`;
        this.firstDepartment = dep
        this.area="";
        this.ministry="";
        this.areaData=[];
        this.ministryData=[];
        this.$http.get(ip,{ 
          params:{
            deptId:this.firstDepartment
          }
        })
        .then((res) => {
          this.departmentData = JSON.parse(res.data.result)
          if(this.firstDepartment!="" && (this.departmentData!=""||this.departmentData!=0||this.departmentData!=[])){
            this.isDepartment = true;
          }
          if((this.departmentData==0&&this.firstDepartment!="")||res.data.result==null||res.data.code==400003){
             this.isDepartment = false;
             this.isArea = false;
             this.isMinistry= false;
          }
          if(this.departmentData.length == 0 && this.departmentData == "" ){
            this.isDepartment = false;
          }
           if(this.areaData.length == 0 && this.area==""){
            this.isArea = false;
          }
          if(this.ministryData.length == 0 && this.ministry == "" ){
             this.isMinistry= false;
          }
          this.deptListId = this.firstDepartment;
          this.getData();
        }, (err) => {
          console.log(err);
        })
      },
      choseArea:function() {
        let ip = `/kpistatistical/getChildOrganzie`;
        // let ip = `/api/api/kpistatistical/getChildOrganzie`;
        this.area="";
        this.ministry="";
        this.areaData=[];
        this.ministryData=[];
        this.$http.get(ip,{ 
          params:{
            deptId:this.department
          }
        })
        .then((res) => {
          this.loading = false;
          this.areaData = JSON.parse(res.data.result)
          if(this.department!=""&&(this.areaData!=0||this.areaData!=[])){
             this.isArea=true
          }
          if((this.department!=""&&this.areaData==0)||res.data.result==null||res.data.code==400003){
             this.isArea = false;
             this.isMinistry= false;
          }
          if(this.areaData.length == 0 && this.area==""){
            this.isArea = false;
          }
          if(this.ministryData.length == 0 && this.ministry == "" ){
             this.isMinistry= false;
          }
          this.deptListId = this.department;
          this.getData();
        }, (err) => {
          this.loading = false;
          console.log(err);
        })
        
      },
      choseMinistry(){
        let ip = `/kpistatistical/getChildOrganzie`;
        // let ip = `/api/api/kpistatistical/getChildOrganzie`;
        this.ministry="";
        this.$http.get(ip,{
          params:{
             deptId:this.area
          }
        })
        .then((res) => {
          this.loading = false;
          this.ministryData = JSON.parse(res.data.result);
          if(this.area!=""&&(this.ministryData!=0||this.ministryData!=[])){
            this.isMinistry = true
          }
          if((this.area!=""&&this.ministryData==0)||res.data.result==null||res.data.code==400003){
            this.isMinistry = false
          }
          if(this.ministryData.length == 0 && this.ministry == "" ){
             this.isMinistry= false;
          }
          this.deptListId = this.area;
          this.getData();
        }, (err) => {
          this.loading = false;
          console.log(err);
        })
        
      },
      choseDep(){
        this.deptListId = this.ministry;
        this.getData()
      },
      pageSizeChange(val) {
        this.pageSize =val;
        //console.log(`每页 ${val} 条`);
        this.getData()
      },
      pageCurrentChange(val) {
        this.currentPage = val;
         this.getData()
      },
      checkDetails(row){
        let {href} = this.$router.resolve({
          path: "/performanceFlow",
          query: {
            empId:row.empId,
            cityId:row.cityId,
            cycleTime:row.cycleTime,
          }
        });
        window.open(href, '_blank');
      },
      choseFile(){
        let ip =  `/kpistatistical/insert`;
        // let ip = `/api/api/kpistatistical/insert`;
        this.$store.commit('setBid','2065');
        if(this.city==""){
          this.$message({
            type: 'error',
            message: "请选择城市再归档"
          });
          return
        } 
        if(this.cycle==""){
          this.$message({
            type: 'error',
            message: "请选择周期再归档"
          });
          return
        }
        this.$http.post(ip,{
          cityId:this.city,
          cycleTime:this.cycle
        }).then((res)=>{
          if(res.data.code == 0){
            this.$message({
              type: 'success',
              message: "归档成功"
            });
            return
          }else if(res.data.code ==11||res.data.code ==12||res.data.code == 400001||res.data.code == 400003||res.data.code == 500000){
            this.$message({
              type: 'error',
              message: res.data.message
            });
            return
          }
        },(err)=>{
          console.log(err)
        })
      },
  
    }
  }
</script>
<style lang="less" scoped>
  .el-date-editor--daterange.el-input__inner{
    width:0px;
    width:97%;
    line-height: 14px;
  }
  .no-data{
    text-align: center;
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #ccc;
    font-size: 13px;
    color: #909399;
  }
  .bHeader{
    box-sizing: border-box;
    height: 35px;
    line-height: 35px;
    .bTitle{
      color:#232736;
      font-size: 18px;
    }
  }

  .check-btn{
    float:right;
    .el-button{
      margin-left:5px;
      padding: 2px 4px;
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
  .bBody{background-color: #fff;}
  .bBody-nav{padding:7px 15px 7px;background-color:#fffeed;}
  .bBody-content{ border-top:1px solid #e5e5e5;}
  .checkBox{position: relative;}
  .check-btn{position: absolute;right:23px;bottom:28px}
  .catagory-lt,.catagory-mid,.catagory-rt{margin-top: 10px;display: inline-block;}
  .catagory-lt { line-height: 30px; height:30px;}
  .catagory-lt{
    width:41.97%;
    margin-bottom:11px;
    .input-el{
      width:120px;height:30px;margin-right:1%;
      .el-date-editor.el-input{
        width:100%
      }
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

  .bottomBox{
    float:  left;
    background-color: #fff;
    width: 100%;
  }
  // .bBody-none{
  //   text-align: center;
  //   padding: 20px 0;
  //   font-size: 14px;
  //   color: #ccc;
  // }
  .red{
    color:#FF0000
  }
</style>
