<template>
  <div class="homePage">
    <div class="filter">
      <el-form ref="form" :model="form" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="信息查询：">
              <el-input
                size="mini"
                v-model="form.info"
                placeholder="请输入患者姓名/申请医生"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态：">
              <el-select
                style="width: 100%"
                size="mini"
                v-model="form.status"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" style="margin-top: 6px; text-align: left">
            <el-button size="mini" type="primary" @click="handleSearch"
              >查询</el-button
            >
            <el-button size="mini" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="tableList">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="captainDoctorId" label="ID"> </el-table-column>
        <el-table-column prop="orgName" label="机构信息"> </el-table-column>
        <el-table-column prop="captainDoctorName" label="队长">
        </el-table-column>
        <el-table-column prop="captainDoctorPhone" label="联系方式">
        </el-table-column>
        <el-table-column prop="members" label="团队成员">
          <template slot-scope="row">
            <span>{{ getMember(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            align="center"
            key="status"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        <el-table-column prop="address" label="操作" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:dept:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:dept:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @size-change="sizeChange"
          @current-change="currentChage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getTeamlist } from "@/api/team";
export default {
  data() {
    return {
      statusList: [],
      form: {},
      total: 0,
      tableData: [],
    };
  },
  created() {
    this.getTeamList();
  },
  methods: {
    sizeChange(pageSize) {
      console.log(pageSize);
    },
    getMember(v) {
      if (v.row.members) {
        return v.row.members.map((item) => item.name).join(",");
      }
    },
    async getTeamList() {
      let res = await getTeamlist({
        name: "",
        orgId: "",
        pageNum: 1,
        pageSize: 10,
        status: "",
        type: 1,
      });
      this.tableData = res.data.records;
    },
    currentChage(pageNum) {
      this.pageNum = pageNum;
      this.getDoctorlist();
    },
    // 重置
    handleReset() {
      this.form = {
        info: "",
        applyOrgId: "",
        status: "",
        applyTime: "",
        meetTime: "",
      };
      this.getDoctorlist();
    },
      // 用户状态修改
      handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要' + text + '该机构吗？').then(function () {
        return changeDeptStatus(row.id, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 搜索
    handleSearch() {
      this.getDoctorlist();
    },
  },
};
</script>

<style lang="scss" scoped>
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