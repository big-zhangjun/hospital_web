<template>
  <div class="homePage">
    <div class="filter">
      <el-form ref="form" :model="form" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="信息查询：">
              <el-input size="mini" v-model="form.info" placeholder="请输入患者姓名/申请医生"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请机构：">
              <el-select style="width: 100%;" size="mini" v-model="form.applyOrgId" placeholder="请选择">
                <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态：">
              <el-select style="width: 100%;" size="mini" v-model="form.status" placeholder="请选择">
                <el-option v-for="item in statusList" :key="item.name" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请时间：">
              <el-date-picker style="width: 100%;" v-model="form.applyTime" type="datetimerange" size="mini"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="会议时间：">
              <el-date-picker style="width: 100%;" v-model="form.meetTime" type="datetimerange" size="mini"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-top: 6px;text-align: left;">
            <el-button size="mini" type="primary" @click="handleSearch">查询</el-button>
            <el-button size="mini" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="tableList">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="220">
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="180">
          <template slot-scope="row">
            <span>{{getApplyTime(row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="meetAim" label="会议目的">
        </el-table-column>
        <el-table-column prop="applyOrgName" label="申请机构">
        </el-table-column>
        <el-table-column prop="applyDoctorName" label="申请医生">
        </el-table-column>
        <el-table-column prop="patientName" label="会诊患者">
        </el-table-column>
        <el-table-column prop="meetTime" label="会议时间"  width="350">
          <template slot-scope="row">
            <span>{{getMeetTime(row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="row">
            <span>{{getStatus(row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作"  width='80'
        
        >
          <template slot-scope="row">
            <el-link type="primary" @click="handleLook(row)">查看</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination background layout="prev, pager, next" :total="total" @size-change="sizeChange" @current-change="currentChage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {getMeetList} from "@/api/meet"

export default {
  data() {
    return {
      form: {
        info: "",
        applyOrgId: "",
        status: "",
        applyTime: "",
        meetTime: "",
      },
      options: [
        {
          name: "椒江区葭沚卫生院",
          id: '10'
        }
      ],
      total: 0,
      statusList: [
                { name: '待审核', id: 1 },
                { name: '待会诊', id: 2 },
                { name: '会诊中', id: 3 },
                { name: '已结束', id: 4 },
                { name: '审核不通', id: 9 }
            ],
            pageNum: 1,
      tableData: [
      ]
    }
  },
  created() {
    this.getMeetList()
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    // 重置
    handleReset() {
      this.form = {
        info: "",
        applyOrgId: "",
        status: "",
        applyTime: "",
        meetTime: "",
      }
      this.getMeetList()
    },
    // 搜索
    handleSearch() {
      this.getMeetList()
    },
    sizeChange(pageSize){
      console.log(pageSize);
    },
    currentChage(pageNum) {
      this.pageNum= pageNum
      this.getMeetList()
    },
    getMeetTime(data) {
      let {meetStartTime, meetEndTime} = data.row
      if(meetStartTime && meetEndTime) {
        return meetStartTime.replace("T", ' ') + ' 至 ' + meetEndTime.replace("T", ' ')
      }
      return ''
    },
    getApplyTime(data) {
      let {applyTime} = data.row
      if(applyTime) {
        return applyTime.replace("T", ' ')
      }
      return ''
    },
    getStatus(data) {
      let {status} = data.row
      let res = this.statusList.find(item=> item.id == status)
      if(res) {
        return res.name
      }
    },
    // 处理时间函数
    formatDate(st) {
      const date = new Date(st);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;

    },
    // 查看详情
    handleLook(data) {
      this.$router.push({
        path: "/detail",
        query: {
          id: data.row.id
        }
      })
      console.log(data);
    },
    // 获取会议列表
    async getMeetList() {
      let { applyTime, meetTime, ...data } = this.form
      let [applyStartTime, applyEndTime, meetStartTime, meetEndTime] = ["", "", "", ""];
      if (applyTime) {
        applyStartTime = this.formatDate(applyTime[0])
        applyEndTime = this.formatDate(applyTime[1])
      }
      if (meetTime) {
        meetStartTime = this.formatDate(meetTime[0])
        meetEndTime = this.formatDate(meetTime[1])
      }
      let params = {
        ...data,
        applyStartTime,
        applyEndTime,
        meetStartTime,
        meetEndTime,
        "pageNum": this.pageNum,
	      "pageSize": "10"
      }
      let res = await getMeetList(params)
      console.log(res);
      this.tableData =  res.records
      this.total = res.total
      // this.$http.get("/mdt/getList", params)
    }
  }
}
</script>
<style lang="scss">
.homePage {
  background-color: #f2f2f2;
  overflow: hidden;

  .filter {
    background-color: #fff;
    margin: 8px;
    padding: 8px;
    border-radius: 4px;
  }

  .tableList {
    background-color: #fff;
    margin: 8px;
    padding: 8px;
    border-radius: 4px;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
}
</style>