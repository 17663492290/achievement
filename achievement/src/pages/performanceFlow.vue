<template>
  <div class="sub-router dBox">
    <div class="bHeader">
      <span class="bTitle">业绩核算流水</span>
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
            <div class="catagory-lt" style="width:13%;margin-right:62px">
              <label for="commodityName" class="bold">周期：</label>
              <div class="input-el">
                <el-date-picker
                  v-model="cycle"
                  type="month"
                  value-format="yyyy-MM"
                  @change="choseCycle"
                  placeholder="请选择"
                  :clearable="clearable">
                </el-date-picker>
              </div>
            </div>
            <div class="catagory-lt" style="width:28%;">
              <label for="commodityName" class="bold">客户查询：</label>
              <div class="input-el input-select" style="width:280px;height:30px!important;position: relative;">
                <i v-if="this.imgOpen == true" class="imgI" style=""></i>
                <el-select
                  width="280"
                  v-model="customer"
                  filterable
                  remote
                  reserve-keyword
                  style="height:30px"
                  placeholder="请输入关键词"
                  @change="choseCustomer()"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  :clearable="clearable2">
                  <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    suffix-icon="el-icon-search">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="catagory-lt" style="width:28%">
              <label for="commodityName" class="bold">订单查询：</label>
              <div class="input-el input-select" style="width:280px;height:30px!important">
                <el-input id="commodityName" placeholder="请输入订单编号" @keyup.enter.native="keyWord()"  suffix-icon="el-icon-search" v-model="search_keyWord" clearable></el-input>
              </div>
            </div>
            <div v-if="this.isDep == true" class="catagory-lt" style="margin-left:49px">
              <label for="commodityName" class="bold">部门：</label>
              <div class="input-el">
                <el-select 
                    v-model="firstDepartment"
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
                    :disabled="isDisabled"
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
                  :disabled="isDisabled"
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
                  @change="chosePersonnel"
                  :disabled="isDisabled">
                  <el-option
                    v-for="item in ministryData"
                    :key="item.org_id"
                    :label="item.org_name"
                    :value="item.org_id">
                  </el-option>
                </el-select>
              </div>
              <div v-if="isPersonnel == true" class="input-el">
                <el-select
                  v-model="personnel"
                  placeholder="请选择"
                  @change="chosePeople"
                  :disabled="isDisabled">
                  <el-option
                    v-for="item in personnelData"
                    :key="item.empid"
                    :label="item.realname"
                    :value="item.empid">
                  </el-option>
                </el-select>
              </div>
            </div>
            <!-- <div class="check-btn"> 
                <el-button v-show = "checkShow" @click="checkToggle(2)" type="text">清空</el-button>
            </div> -->
          </div>
        </el-collapse-transition>
        <div class="tableBox">
          <el-table ref="multipleTable" 
            v-loading="loading" 
            :data="tableData" 
            tooltip-effect="dark" 
            :header-cell-style="Center"
            border
            :height = 'heightCtr'
            style="width: 100%;overflow-y:auto;border:1px solid #e5e5e5;border-bottom:0;" >
            <el-table-column label="时间" sortable prop="addTime" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column label="客户" sortable prop="customerName" show-overflow-tooltip></el-table-column>
            <el-table-column label="订单号" sortable prop="orderId" show-overflow-tooltip width="140"> </el-table-column>
            <el-table-column label="核算类型" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.calculateType == 0">业绩累加</span>
                <span class="red" v-if="scope.row.calculateType == 1">业绩扣除</span>
              </template>
            </el-table-column>
            <el-table-column label="核算事由" prop="calculateCause" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.calculateType == 0">
                    <span v-if="scope.row.calculateCause == 0">正常完款</span>
                    <span v-if="scope.row.calculateCause == 1">分批完款</span>
                    <span v-if="scope.row.calculateCause == 2">退单重结</span>
                    <span v-if="scope.row.calculateCause == 3">重新完款</span>
                    <span v-if="scope.row.calculateCause == 4">客户退款</span>
                    <span v-if="scope.row.calculateCause == 5">超额支出</span>
                    <span v-if="scope.row.calculateCause == 6">支出确认</span>
                    <span v-if="scope.row.calculateCause == 7">财务冲销</span>
                    <span v-if="scope.row.calculateCause == 8">佣金</span>
                    <span v-if="scope.row.calculateCause == 9">其它</span>
                </span>
                <span class="red" v-if="scope.row.calculateType == 1">
                    <span v-if="scope.row.calculateCause == 0">正常完款</span>
                    <span v-if="scope.row.calculateCause == 1">分批完款</span>
                    <span v-if="scope.row.calculateCause == 2">退单重结</span>
                    <span v-if="scope.row.calculateCause == 3">重新完款</span>
                    <span v-if="scope.row.calculateCause == 4">客户退款</span>
                    <span v-if="scope.row.calculateCause == 5">超额支出</span>
                    <span v-if="scope.row.calculateCause == 6">支出确认</span>
                    <span v-if="scope.row.calculateCause == 7">财务冲销</span>
                    <span v-if="scope.row.calculateCause == 8">佣金</span>
                    <span v-if="scope.row.calculateCause == 9">其它</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="核算业绩" width="130" :render-header="renderHeader" show-overflow-tooltip>
              <template slot-scope="scope">
                 <span class="red" v-if="Number(scope.row.calculateAchievement)<0">￥{{scope.row.calculateAchievement}}</span>
                 <span v-if="Number(scope.row.calculateAchievement)>0">￥{{scope.row.calculateAchievement}}</span>
              </template>
            </el-table-column>          
            <el-table-column label="核算成本" show-overflow-tooltip>
              <template slot-scope="scope">
                 <span class="red" v-if="Number(scope.row.calculateAmount)<0">￥{{scope.row.calculateAmount}}</span>
                 <span v-if="Number(scope.row.calculateAmount)>0">￥{{scope.row.calculateAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column label="核算毛利" show-overflow-tooltip>
              <template slot-scope="scope">
                 <span class="red" v-if="Number(scope.row.calculateProfit)<0">￥{{scope.row.calculateProfit}}</span>
                 <span v-if="Number(scope.row.calculateProfit)>0">￥{{scope.row.calculateProfit}}</span>
              </template>
            </el-table-column>
            <el-table-column label="关联订单" prop="unionOrderId" show-overflow-tooltip width="140"></el-table-column>
            <el-table-column label="备注" prop="remark" >
              <template slot-scope="scope">
                <el-popover
                  placement="left-end"
                  width="200"
                  trigger="hover">
                  <p style="word-wrap:break-word">{{scope.row.remark}}</p>
                  <div class="remarkBox" slot="reference">{{scope.row.remark}}</div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                  <span class="blue details" @click="viewDetails(scope.row)">查看详情</span>
                  <!-- <span class="blue details" @click="correctVisible = true">业绩修正</span> -->
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
      class="detailsDialog"
      title="订单毛利分析详情页"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeAll"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      >
      <div style="width:100%;mix-height:80vh;padding-bottom:15px;">
          <ul class="detailsUl clearfix">
            <li><span class="detailTitle">订单编号 : </span><span>{{tableDetails.orderId}}</span></li>
            <li><span class="detailTitle">客户名称 : </span><span>{{tableDetails.customerName}}</span></li>
            <li><span class="detailTitle">签单人 ： </span><span>{{tableDetails.ownerName}}</span></li>
            <li><span class="detailTitle">成交金额 : </span><span>￥{{tableDetails.totalPrice}}</span></li>
            <li>
              <i v-if="this.confirmTrans==true" class="confirm"></i>
              <i v-if="this.confirmTrans==false" class="unconfirm"></i>
            </li>
          </ul>
          <div style="max-height:570px;overflow-y:auto;border-top:1px solid #ebeef5">
            <div class="grossProfit inventory" style="width:100%;">
              <el-table
                v-loading="loading" 
                :data="tableData2"
                border
                tooltip-effect="dark"
                :span-method="mergeCell"
                style="width: 100%">
                <el-table-column label="商品明细">
                  <el-table-column prop="providerName" label="服务商" show-overflow-tooltip > </el-table-column>
                  <el-table-column prop="skuName" label="商品名称" show-overflow-tooltip >
                    <template slot-scope="scope">
                      {{scope.row.skuName}}
                    </template>
                  </el-table-column>
                  <el-table-column label="成本" width="118">
                    <template slot-scope="scope">
                      <span v-if="Number(scope.row.addCost>0)"> ￥{{scope.row.addCost}}</span>
                      <span class="red" v-if="Number(scope.row.addCost<0)"> ￥{{scope.row.addCost}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column  label="已完款" width="118">
                    <template slot-scope="scope">
                      <span v-if="Number(scope.row.hasFinishPrice)>0">￥{{scope.row.hasFinishPrice}}</span>
                      <span class="red" v-if="Number(scope.row.hasFinishPrice)<0">￥{{scope.row.hasFinishPrice}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="成交毛利" :render-header="renderHeader2" width="150">
                    <template slot-scope="scope">
                      <span v-if="Number(scope.row.initProfitAmount)>0">￥{{scope.row.initProfitAmount}}</span>
                      <span class="red" v-if="Number(scope.row.initProfitAmount)<0">￥{{scope.row.initProfitAmount}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="已支出" width="118">
                    <template slot-scope="scope">
                      <span v-if="Number(scope.row.payOutAmount)>0">￥{{scope.row.payOutAmount}}</span>
                      <span class="red" v-if="Number(scope.row.payOutAmount)<=0">￥{{scope.row.payOutAmount}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="毛利调整(累计)" width="118">
                    <template slot-scope="scope">
                      <span class="red" v-if="Number(scope.row.profitAdjust)>0">￥{{scope.row.profitAdjust}}</span>
                      <span class="red" v-if="Number(scope.row.profitAdjust)<=0">￥{{scope.row.profitAdjust}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="整单毛利" width="118">
                    <template slot-scope="scope">
                      <span class="red" v-if="Number(scope.row.totalProfitAmount)>0">￥{{scope.row.totalProfitAmount}}</span>
                      <span class="red" v-if="Number(scope.row.totalProfitAmount)<=0">￥{{scope.row.totalProfitAmount}}</span>
                    </template>
                  </el-table-column>
                </el-table-column> 
              </el-table>
            </div>
            <div class="grossProfit budgetRecord" style="width:100%;;margin-top:10px;">
              <el-table
                v-loading="loading" 
                :data="budgetData"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column label="收支记录">
                  <el-table-column prop="transactionTime" label="日期" show-overflow-tooltip  width="160"></el-table-column>
                  <el-table-column label="类型"  width="110" show-overflow-tooltip >
                    <template slot-scope="scope">
                      <span v-if="scope.row.transactionType == 200">全部支付</span>
                      <span v-if="scope.row.transactionType == 201">部分支付</span>
                      <span v-if="scope.row.transactionType == 300">全部退款</span>
                      <span v-if="scope.row.transactionType == 301">部分退款</span>
                      <span v-if="scope.row.transactionType == 1001">退单重结</span>
                      <span v-if="scope.row.transactionType == 2001">成本支出</span>
                      <span v-if="scope.row.transactionType == 2002">佣金</span>
                      <span v-if="scope.row.transactionType == 2004">其他支出</span>
                      <span v-if="scope.row.transactionType == 3000">支出确认</span>
                      <span v-if="scope.row.transactionType == 4000">完款流水冲销</span>
                      <span v-if="scope.row.transactionType == 4001">退款流水冲销</span>
                      <span v-if="scope.row.transactionType == 4002">成本支出冲销</span>
                      <span v-if="scope.row.transactionType == 4003">其他支出冲销</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="收支金额" show-overflow-tooltip width="118">
                    <template slot-scope="scope">
                      <span v-if="Number(scope.row.amount)<0" class="red">￥{{scope.row.amount}}</span> 
                      <span v-if="Number(scope.row.amount)>0">￥{{scope.row.amount}}</span> 
                      <span v-if="Number(scope.row.amount)==0"></span> 
                    </template>
                  </el-table-column>
                  <el-table-column label="核算业绩" show-overflow-tooltip width="118">
                    <template slot-scope="scope">
                        <span v-if="Number(scope.row.calculateAchievement)<0" class="red">￥{{scope.row.calculateAchievement}}</span> 
                        <span v-if="Number(scope.row.calculateAchievement)>0">￥{{scope.row.calculateAchievement}}</span> 
                    </template>
                  </el-table-column>
                  <el-table-column label="核算成本" show-overflow-tooltip width="118">
                    <template slot-scope="scope">
                        <span v-if="Number(scope.row.calculateAmount)<0" class="red">￥{{scope.row.calculateAmount}}</span> 
                        <span v-if="Number(scope.row.calculateAmount)>0">￥{{scope.row.calculateAmount}}</span> 
                    </template>
                  </el-table-column>
                  <el-table-column label="核算毛利" show-overflow-tooltip width="118">
                    <template slot-scope="scope">
                        <span v-if="Number(scope.row.calculateProfit)<0" class="red">￥{{scope.row.calculateProfit}}</span> 
                        <span v-if="Number(scope.row.calculateProfit)>0">￥{{scope.row.calculateProfit}}</span> 
                    </template>
                  </el-table-column>
                  <el-table-column   label="商品" >
                    <template slot-scope="scope">
                      <ul>
                        <li v-for="item in scope.row.skuDetail" :key="item.id">{{item.skuName}}</li>
                      </ul>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" >
                    <template slot-scope="scope">
                      <el-popover
                        placement="left-end"
                        width="200"
                        trigger="hover">
                        <p style="word-wrap:break-word">{{scope.row.remark}}</p>
                        <div class="remarkBox" slot="reference">{{scope.row.remark}}</div>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table-column> 
              </el-table>
            </div>
          </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer" style="padding:10px 20px 10px">
        
      </span> -->
    </el-dialog>
    <el-dialog
      title="业绩修正"
      :visible.sync="correctVisible"
      width="90%"
      :before-close="closeAll"
      :close-on-click-modal="true"
      :modal-append-to-body="false">
      <div style="width:100%;mix-height:80vh;">
          <p class="red correctTitle">可在下方输入框区域对退款涉及业绩及毛利进行调整，若要扣减业绩或毛利，需保持前面的负号 "-"</p>
          <div class="correctBox" style="width:100%;height:100px;overflow-y:auto;margin-top:10px;position: relative;">
            <el-table
              :data="correctData"
              tooltip-effect="dark"
              max-height="182"
              border
              :header-cell-style="Center"
              :cell-style="Center"
              style="width: 100%">
                <el-table-column prop="addTime" label="时间" width="160" show-overflow-tooltip ></el-table-column>
                <el-table-column prop="customerName" label="客户"  show-overflow-tooltip ></el-table-column>
                <el-table-column prop="orderId" label="订单编号" show-overflow-tooltip ></el-table-column>
                <el-table-column prop="calculateType" label="核算类型" width="90" show-overflow-tooltip ></el-table-column>
                <el-table-column prop="calculateCause" label="核算事由" width="90" show-overflow-tooltip ></el-table-column>
                <el-table-column label="核算业绩" width="120" show-overflow-tooltip >
                  <template slot-scope="scope">
                    <span class="sign red">-</span>
                    <el-input v-model="achievement" clearable> </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="核算成本" width="120" show-overflow-tooltip >
                  <template slot-scope="scope">
                    <span class="sign red">-</span>
                    <el-input v-model="cost" clearable> </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="calculateProfit" label="核算毛利" width="120" show-overflow-tooltip >
                  <template slot-scope="scope">
                    <span class="sign red">-</span>
                    <el-input v-model="profit" clearable> </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" >
                  <template slot-scope="scope">
                    <el-popover
                      placement="left-end"
                      width="200"
                      trigger="hover">
                      <p style="word-wrap:break-word">{{scope.row.remark}}</p>
                      <div class="remarkBox" slot="reference">{{scope.row.remark}}</div>
                    </el-popover>
                  </template>
                </el-table-column>
            </el-table>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeAll">取 消</el-button>
          <el-button type="primary" >确 定</el-button> 
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created (){
      this.empId = this.$route.query.empId;
      this.city = Number(this.$route.query.cityId);
      this.cycle = this.$route.query.cycleTime;
      this.choseFirst();
      this.cityList()
     
    },
    data () {
      return {
        imgOpen:true,
        time:"",
        clearable:false,
        clearable2:true,
        isDep:false,
        empId_:"",
        disabled:false,
        deptListId:"",
        isDepartment:false,
        isArea:false,
        isMinistry:false,
        isPersonnel:false,
        restaurants: [],

        addAll1: 0,
        addAll2: 0,
        th1: 0,
        th2: 0,
        options4: [],
        customer:"",
        list: [],
        achievement:'',//业绩input
        cost:'',//成本input
        profit:'',//利润
        timeout:  null,
        city:"",//城市
        cityData:[],
        cycle:"",//周期
        firstDepartment:'',//一级部门
        department:'',//部门
        area:"",//部门区域
        ministry:"",//部
        personnel:'',//人员
        firstData:[],
        departmentData:[],
        areaData:[],//部门区域数据
        ministryData:[],//部
        personnelData:[],
        correctData:[//修正表格
          {
            addTime:'2018-11-00 12:12:22',
            customerName:'北京一律科技有限公司1111111111111111',
            orderId:"58009281287185",
            calculateType:'业绩扣除',
            calculateCause:'客户退款',
            calculateAchievement:'4000',
            calculateAmount:'600',
            calculateProfit:'9000',
            remark:'1234566789899999'
          }
        ],
        confirmTrans:'',
        isConfirm:false,
        dialogVisible:false,
        correctVisible:false,
      
        checkShow: true,
        
        // rowIndex: '-1',
        // OrderIndexArr: [],
        // OrderIndexArr2: [],

        commodityName: '',
      
        tableData: [],
        tableDetails:[],
        tableData2:[],
        budgetData:[],
        dataDetail:[],
        search_keyWord:'',
        comState:'',

        pageSizes: [10, 15, 30, 40],
        pageSize: 10,
        currentPage: 1,
        totalValue: 0,
        loading: false,

        dialogShow:false,
        dialog:false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        heightCtr: 'calc(100vh - 295px)',
      }
    },
    computed: {
      isDisabled(){
        // if(this.departmentData.length == 0&&this.firstData.length!=0){
        //   return this.disabled = true
        // }else{
        //   return this.disabled = false
        // }
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
      // checkShow(val){
      //   if(val){
      //     this.heightCtr = 'calc(100vh - 310px)'
      //   }else{
      //     this.heightCtr = 'calc(100vh - 218px)'
      //   }
      // },
      // search_keyWord(val){
      //   console.log("执行搜索")
      //   this.getData()
      // },
    },
    methods: {
      Center({ row, rowIndex}) {
          return 'text-align:center'
      },
      renderHeader (h,{column}) { 
        return h(
          'div',
          [ 
            h('p',{style:'text-align:center;'}, column.label),
            h('p', {style:'text-align:center;'},["(按实际到账算)"])
          ]
        )
       },
      renderHeader2 (h,{column}) { 
        return h(
          'div',
          [ 
            h('p',{style:'text-align:center;'}, column.label),
            h('p', {style:'text-align:center;'},["(成交金额-成本)"])
          ]
        )
       },
      keyWord(){
        this.getData ()
      },
      //初始化列表数据
      getData () {
        let ip = `/kpidetail/queryKpiDetail`;
        // let ip = `/api/api/kpidetail/queryKpiDetail`;
        this.$store.commit('setBid','2063');
        this.loading = true;
       if(this.cycle==null||this.cycle==""){
           this.timeData()
           this.cycle+"-01 00:00:00";
           return
        }else if((this.cycle!=null&&this.cycle!="")&&this.cycle.length != 19){
          this.cycle=this.cycle+"-01 00:00:00";
        }
        this.$http.post(ip,{
            pageNum:this.currentPage-1,//页码
            pageSize:this.pageSize,
            empId:this.empId,
            orgIdOrEmpId:this.deptListId,
            addTime: this.cycle,
            customerId:this.customer,
            cityId: this.city ,
            orderId:this.search_keyWord
            //bid: '2032'
        }) .then((res) => {
          this.loading = false;
          this.totalValue = res.data.total;
          if(res.data.code == 0){
            this.tableData = res.data.result;
            this.tableData.map(item=>{
              item.calculateAchievement =Number(item.calculateAchievement)/100;
              item.calculateAmount =Number(item.calculateAmount)/100;
              item.calculateProfit =Number(item.calculateProfit)/100;
            })
            }else{
              this.tableData = [];
            }
          
        }, (err) => {
          this.loading = false;
          console.log(err);
        })
      },
      // getData2 () {
      //   let ip = `/kpidetail/queryKpiDetail`;
      //   // let ip = `/api/api/kpidetail/queryKpiDetail`
      //   // this.$store.commit('setBid','1340');
      //   this.loading = true;
      //   this.$http.post(ip,{
      //       pageNum:this.currentPage-1,//页码
      //       pageSize:this.pageSize,
      //       empId:this.empId,
      //       orgIdOrEmpId:this.deptListId,
      //       addTime: this.cycle,
      //       customerId:this.customer,
      //       cityId: this.city ,
      //       orderId:this.search_keyWord
      //       //bid: '2032'
      //   }) .then((res) => {
      //     this.loading = false;
      //     if(res.data.code == 0){
      //       this.empId = ""
      //       this.tableData = res.data.result;
      //       this.tableData.map(item=>{
      //         item.calculateAchievement =Number(item.calculateAchievement)/100;
      //         item.calculateAmount =Number(item.calculateAmount)/100;
      //         item.calculateProfit =Number(item.calculateProfit)/100;
      //       })
      //       this.totalValue = res.data.total;
      //     }else{
      //       this.tableData = []
      //     }
          
      //   }, (err) => {
      //     this.loading = false;
      //     console.log(err);
      //   })
      // },
      choseCustomer(){
        if(this.customer == ""){
          this.imgOpen = true
        }else{
          this.imgOpen = false
        }
        this.getData();
      },
      search () {
        this.getData();
      },
      //弹框确定按钮
      setComState (state){
        this.comState = state;  
        this.ab = 0 
      },
      //弹框取消按钮
      cancel (){
        this.lineFlag = false;
        this.dialogShow = false;
        // this.setStateIdList = [];
        this.comState = '';
      },

      checkToggle(type){
        if(type != 2){
          this.checkShow = !this.checkShow
        }
        if(type == 2){
          this.city="";
          this.cycle="";
          this.firstDepartment="";
          this.department="";
          this.area="";
          this.ministry="";
          this.search_keyWord = "";
          this.customer = ""
        }
        if(this.firstDepartment == ""){
          this.isDepartment = false;
          this.isArea = false;
          this.isMinistry = false;
        }
        this.getData();
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
      timeData(){
        let y = new Date().getFullYear();
        let m = new Date().getMonth() + 1;
        this.time = y+"-"+this.add(m);
        this.cycle=this.time+"-01 00:00:00";
      },
      add(m){
        return m<10?'0'+m:m 
      },
      choseCycle(){
        // if( this.cycle!=null&&this.cycle!=""){
        //   this.cycle=this.cycle+"-01 00:00:00";
        //   console.log(this.cycle,"1111111111111111111")
        //   this.getData();
        //   return
        // }
        this.getData();
        
      },
     //选择部门一级
      choseFirst:function() {
        let ip = `/loginAdmin/getLoginInfo`;
        // let ip =`/api/api/loginAdmin/getLoginInfo`;
        this.$http.get(ip,{
        }).then((res)=>{
          this.firstData = JSON.parse(res.data.result.deptAdmin)
          // this.city = Number(res.data.result.cityId);
          if( this.firstData.length == 0){
            this.isDep = false;
            this.heightCtr = 'calc(100vh - 260px)'
            this.deptListId = res.data.result.empId;
            // if(this.empId!=""){
            //   this.getData2()
            // }else{
            //   this.getData()
            // }
            this.getData()
          } else{
            this.firstDepartment = this.firstData[0].org_id;
            if(res.data.result.empType == 0 ){
              this.isDep = false;
              this.heightCtr = 'calc(100vh - 260px)'
            }else if(res.data.result.empType == 1 ){
              this.isDep = true;
              this.choseDepartment2(this.firstData[0].org_id)
              this.deptListId = this.firstDepartment;
            }
          } 
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
          if(this.firstDepartment!="" && (this.departmentData!=0||this.departmentData!=[])){
            this.isDepartment = true;
            
          }
          if((this.firstDepartment!="" && this.departmentData==0)||res.data.result==null||res.data.code==400003){
            this.isDepartment = false;
            this.isArea= false;
            this.isMinistry= false;
            this.isPersonnel= false;
          }
          this.deptListId = this.firstDepartment;
          if(this.departmentData.length == 0 && this.departmentData == "" ){
            this.isDepartment = false;
          }
           if(this.areaData.length == 0 && this.area==""){
            this.isArea = false;
          }
          if(this.ministryData.length == 0 && this.ministry == "" ){
             this.isMinistry= false;
          }
          if(this.personnelData==0 && this.personnel == ""){
            this.isPersonnel = false
          }
          // if(this.empId!=""){
          //   this.getData2()
          // }else{
          //   this.getData()
          // }
          this.empId="";
          this.getData()
        }, (err) => {
          console.log(err);
        })
      },
      //保留empid
      choseDepartment2:function(dep) {
        let ip = `/kpistatistical/getChildOrganzie`;
        // let ip = `/api/api/kpistatistical/getChildOrganzie`;
        this.firstDepartment = dep;
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
           if(this.firstDepartment!="" && (this.departmentData!=0||this.departmentData!=[])){
            this.isDepartment = true;
            
          }
          if((this.firstDepartment!="" && this.departmentData==0)||res.data.result==null||res.data.code==400003){
            this.isDepartment = false;
            this.isArea= false;
            this.isMinistry= false;
            this.isPersonnel= false;
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
          if(this.personnelData==0 && this.personnel == ""){
            this.isPersonnel = false
          }
          this.deptListId = this.firstDepartment;
          // if(this.empId!=""){
          //   this.getData2()
          // }else{
          //   this.getData()
          // }
          this.getData()
        }, (err) => {
          console.log(err);
        })
      },
      //选择部门区
      choseArea:function() {
        let ip = `/kpistatistical/getChildOrganzie`;
        // let ip = `/api/api/kpistatistical/getChildOrganzie`;
        this.empId="";
        this.area="";
        this.ministry="";
        this.personnel='';
        this.areaData=[];
        this.ministryData=[];
        this.personnelData=[];
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
            this.isArea=false;
            this.isMinistry= false;
            this.isPersonnel= false;
          }
          if(this.areaData.length == 0 && this.area==""){
            this.isArea = false;
          }
          if(this.ministryData.length == 0 && this.ministry == "" ){
             this.isMinistry= false;
          }
          if(this.personnelData==0 && this.personnel == ""){
            this.isPersonnel = false
          }
          this.deptListId = this.department;
          this.getData();
        }, (err) => {
          this.loading = false;
          console.log(err);
        })
      },
      //选择部
      choseMinistry(){
        let ip = `/kpistatistical/getChildOrganzie`;
        // let ip = `/api/api/kpistatistical/getChildOrganzie`;
        this.empId="";
        this.ministry="";
        this.personnel='';
        this.personnelData=[];
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
            this.isMinistry = false;
            this.isPersonnel = false
          }
          if((this.area!=""&&this.ministryData==0)||res.data.result==null||res.data.code==400003){
            this.isMinistry = false
          }
          if(this.ministryData.length == 0 && this.ministry == "" ){
             this.isMinistry= false;
          }
          if(this.personnelData==0 && this.personnel == ""){
            this.isPersonnel = false
          }
          this.deptListId = this.area;
          this.getData();
        }, (err) => {
          this.loading = false;
          console.log(err);
        })
      },
      //部门  人员
      chosePersonnel(){
        let ip = `/kpistatistical/getEmpByOrgId`;
        // let ip = `/api/api/kpistatistical/getEmpByOrgId`;
        this.empId="";
        this.personnel='';
        this.$http.get(ip,{
          params:{
            deptId:this.ministry
          }
        })
        .then((res) => {
          this.personnelData = JSON.parse(res.data.result);
          if(this.ministry!=""&&(this.personnelData!=0||this.personnelData!=[])){
            this.isPersonnel = true
          }
          if((this.ministry!=""&&this.personnelData==0)||res.data.result==null||res.data.code==400003){
            this.isPersonnel = false
          }
          if(this.personnelData==0 && this.personnel == ""){
            this.isPersonnel = false
          }
          this.deptListId = this.ministry
          // this.personnelData.length==0?(this.isPersonnel=false):(this.isPersonnel=true)
          this.getData();
        }, (err) => {
          console.log(err);
        })
      },
      chosePeople(){
        this.empId="";
        this.deptListId = this.personnel;
        this.getData();
      },
      remoteMethod(query) {//客户查询
        if (query !== '') {
          this.loading = true;
          let ip = `/kpidetail/searchCompanyList`;
          // let ip = `/api/api/kpidetail/searchCompanyList`;
          this.$store.commit('setBid','2063');
          this.$http.get(ip,{
            params:{
              name:query
            }
          }).then((res)=>{
            if( res.data.result!=null&&res.data.result.length){
              this.list = [];
              res.data.result.forEach((item) =>{
                let obj = {};
                obj.value = item.id;
                obj.label = item.name;
                this.list.push(obj)
              });
            }
            setTimeout(() => {
              this.loading = false;
              this.options4 = this.list.filter(item => {
                return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
              });
            }, 200);

          },(err)=>{
            console.log(err)
          })         
        } else {
          this.options4 = [];
        }
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      viewDetails(row){
        this.dialogVisible = true;
        this.loading = true;
        let ip =`/order/getOrderDetail`;
        // let ip =`/api/api/order/getOrderDetail`;
        this.$store.commit('setBid','2063');
         this.$http.get(ip,{
           params:{
             orderId:row.orderId
           }
         }) .then((res) => {
           this.loading = false;
          if(res.data.code == 0 ){
            
            this.tableDetails = res.data.result;
            this.tableDetails.totalPrice =Number(this.tableDetails.totalPrice)/100

            res.data.result.detail.map((item)=>{
              item.hasFinishPrice=Number(this.tableDetails.hasFinishPrice)/100;
              item.initProfitAmount=Number(this.tableDetails.initProfitAmount)/100;
              item.payOutAmount=Number(this.tableDetails.payOutAmount)/100;
              item.profitAdjust=Number(this.tableDetails.profitAdjust)/100;
              item.totalProfitAmount=Number(this.tableDetails.totalProfitAmount)/100;
              item.rowspan = 0;
              item.costTotal = Number(item.costTotal)/100
            })
            this.tableData2 = res.data.result.detail;
            this.tableData2.map((item,index)=>{
              if(item.productType==1){
                item.addCost =Number(item.skuCount)*Number(item.costTotal)
              }
              if(item.productType==2){
                let num = 'false'
                this.tableDetails.packageInfo.map((list,sunIndex)=>{
                  if(item.packageId === list.packageId){
                    num = list.packageCount;
                  }
                })
                if (num != 'false') {
                  item.addCost =Number(item.skuCount)*Number(item.costTotal)*Number(num)
                } else {
                  item.addCost =Number(item.skuCount)*Number(item.costTotal)
                }
              }
            })
            this.tableData2.map((item,index) => {
              let num = 1,isOne = true
              this.tableData2.map((list,sonIndex) => {
                if (index != sonIndex && item.providerId == list.providerId) {
                  item.addCost+=list.addCost;
                }
                if (index < sonIndex && item.providerId == list.providerId) {
                  num++
                } 
                if (index > sonIndex && item.providerId == list.providerId) {
                  isOne = false
                }
              })
              if (isOne) {
                item.rowspan = num
              }
              return item
            })
            // if(res.data.code==0){
            //   this.loading = true;
              let ip =`/ordertranslist/getOrderTransList`;
              // let ip = `/api/api/ordertranslist/getOrderTransList`;
              this.$store.commit('setBid','2063');
              this.$http.get(ip,{
                params:{
                  orderId:row.orderId
                }
              }).then((res)=>{
                if(res.data.code == 0){
                   this.loading = false;
                  this.confirmTrans = res.data.result.confirmTrans;
                  this.budgetData = res.data.result.vos; 
                  this.budgetData.map(item=>{
                    item.amount = Number(item.amount)/100;
                    item.calculateAchievement = Number(item.calculateAchievement)/100;
                    item.calculateProfit = Number(item.calculateProfit)/100;
                    item.calculateAmount = Number(item.calculateAmount)/100;
                  })
                }else{
                  this.budgetData = []
                }
              },(err)=>{
                this.loading = false;
                console.log(err);
              })
            // }else{
            //   this.budgetData = []
            // }
          }else{
            this.loading = false;
            this.tableData2 = []
          }
        }, (err) => {
          this.loading = false;
          console.log(err);
        })
      },
      // 合并单元格
      mergeCell({row,column,rowIndex,columnIndex}) {
        if (columnIndex === 0||columnIndex === 2) {
          if (row.rowspan) {
            return {
              rowspan: row.rowspan,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 1
            }
          }
        }
        if(columnIndex === 3||columnIndex === 4||columnIndex === 5||columnIndex === 6||columnIndex === 7){
          if (rowIndex == 0) {
            return {
              rowspan:this.tableData2.length,
              colspan:1
            };
          }
          return {
              rowspan:this.tableData2.length,
              colspan:0
          };
        }
        
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
      closeAll(){
        this.correctVisible = false;
        this.dialogVisible = false
      },
      
    }

  }
</script>
<style lang="less" scoped>
  .imgI{
    background:url('../assets/images/sou.jpg') no-repeat;
    display:inline-block;
    width:14px;height:14px;
    position: absolute;right:19.5%;top:30%
  }
  .remarkBox{
    width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
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
  
  .list_box{
    border-top: 2px solid #ccc;
    float: left;
    width:100%;
    overflow-y: auto
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
  .check-btn{position: absolute;right:23px;bottom:18px}
  .catagory-lt,.catagory-mid,.catagory-rt{margin-top: 25px;display: inline-block;}
  .catagory-lt { line-height: 30px; }
  .catagory-lt{
    width:53.97%;
    margin: 0 0.5% 8px 0;
    
    .input-el{
      width: 120px;
      height: 30px;
      margin-right: 1%;
      .el-date-editor.el-input{
        width:100%
      }
    }
    .input-select .el-select{
      width:238px
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
    bottom:0;
    right: 0;
    background-color: #fff;
    padding:16px;
    text-align: center;
    width: 100%;
    z-index:2000;
  }
  .bottomBox{
    float:  left;
    background-color: #fff;
    width: 100%;
    height:100%;
  }
  .details{
    cursor: pointer;
  }
  
  .detailsUl li{
    float:left;
    padding:10px 0;
    margin-right:10.5%;
    font-size: 13px;
    .detailTitle{
      color:#000;
      font-weight: 600
    }
  }
  .detailsUl{
    position: relative;
  }
  .detailsUl li i{
    position: absolute;
    right:20px;
    top:0;
    display: inline-block;
    width:208px;
    height:102px;
    z-index: 2002;
  }
  .detailsUl li i.confirm{
    background: url(../assets/images/confirm.png) no-repeat center
  }
  .detailsUl li i.unconfirm{
    background: url(../assets/images/unconfirm.png) no-repeat center
  }
  .detailsUl li:last-child{
    margin-right:0
  }
  .clearfix:after {
    content: "020";
    display: block;
    height: 0;
    clear: both;
  }
  .clearfix {
      zoom: 1;
  }
  .red{
    color:#FF0000
  }
  .correctTitle{
    margin: 5px 0 10px 0;
  }
  .sign{
    position: absolute;
    left:16px;
    top:14px;
  }
</style>
<style lang="less">
  .sub-router .el-input__inner{
    height: 30px !important;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
