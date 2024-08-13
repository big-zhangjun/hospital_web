<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="信息查询" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称/机构编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="部门状态"
          clearable
        >
          <el-option
            v-for="dict in statusList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="组别" prop="orgId">
        <el-select
          v-model="queryParams.majorType"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="(item, idx) in majorTypeList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区" prop="orgId">
        <el-cascader
          v-model="queryParams.serviceArea"
          :options="provinceList"
          :props="props"
          style="width: 100%"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <div class="tableList">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="captainDoctorId" label="ID"> </el-table-column>
        <el-table-column prop="teamName" label="组名"> </el-table-column>
        <el-table-column prop="majorType" label="组别">
          <template slot-scope="scope">
            <span>{{ getDictList(scope.row.majorType, "majorTypeList") }}</span>
          </template></el-table-column
        >
        <el-table-column prop="serviceArea" label="服务地区">
          <template slot-scope="scope">
            <span>{{ getArea(scope.row.serviceArea) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="captainDoctorName" label="组长">
        </el-table-column>
        <el-table-column prop="secretaryDoctorName" label="秘书">
        </el-table-column>
        <el-table-column prop="members" label="团队成员">
          <template slot-scope="row">
            <span>{{ getMember(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" key="status">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
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
          @current-change="currentChage"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 添加或修改部门对话框 -->
    <el-drawer :title="title" :visible.sync="open" size="500px" append-to-body>
      <div style="margin: 24px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="组名" prop="teamName">
                <el-input
                  v-model="form.teamName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="组别" prop="majorType">
                <el-select
                  v-model="form.majorType"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, idx) in majorTypeList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="服务地区" prop="serviceArea">
                <el-cascader
                  v-model="form.serviceArea"
                  :options="provinceList"
                  :props="props"
                  style="width: 100%"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <!-- v-el-select-loadmore="handleDeptScroll"  -->
            <el-col :span="24">
              <el-form-item label="团队成员" prop="members">
                <el-select
                  multiple
                  v-el-select-loadmore="handleDeptScroll"
                  v-model="form.members"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, idx) in docList"
                    :key="idx"
                    :label="item.name + ` (${item.titleName}) ${item.phone}`"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="队长" prop="captainDoctorId">
                <el-select
                  clearable
                  v-el-select-loadmore="handleDeptScroll"
                  v-model="form.captainDoctorId"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, idx) in docList"
                    :key="idx"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="秘书" prop="secretaryDoctorId">
                <el-select
                  clearable
                  v-el-select-loadmore="handleDeptScroll"
                  v-model="form.secretaryDoctorId"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, idx) in docList"
                    :key="idx"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio label="0">否</el-radio>
                  <el-radio label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  listDept,
  changeDeptStatus,
  getTitleTypeList,
  getTitleList,
} from "@/api/system/dept";
import { getDoctorlist } from "@/api/anning/talents/hospital/doctor.js";

import {
  getMdtTeamlist,
  addMdtTeam,
  getMdtTeam,
  updateMdtTeam,
  delMdtTeam,
  changeStatus,
} from "@/api/anning/talents/hospital/team.js";

import { getRegion } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      majorTypeList: [
        { label: "肿瘤组", value: "1" },
        { label: "老年慢病组", value: "2" },
      ],
      // 显示搜索条件
      statusList: [
        { label: "正常", value: "1" },
        { label: "停用", value: "0" },
      ],
      showSearch: true,
      // 表格树数据
      tableData: [],
      total: 0,
      titleIdList: [],
      orgList: [],
      // 部门树选项
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      docTypeList: [],
      orgPageNum: 1,
      type: "",
      // 表单校验
      rules: {
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        orgId: [{ required: true, message: "机构不能为空", trigger: "blur" }],
        captainDoctorId: [
          { required: true, message: "队长不能为空", trigger: "blur" },
        ],
        members: [{ required: true, message: "队员不能为空", trigger: "blur" }],
      },
      pageNum: 1,
      docPageNum: 1,
      docList: [],
      imageUrl: "",
      provinceList: [],
      props: {
        value: "code",
        label: "name",
        lazy: true,
        multiple: true,
        checkStrictly: true,
        lazyLoad: this.lazyLoad,
      },
    };
  },
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 下拉框下拉的框
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        // 增加滚动监听，
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          // 当滚动条滚动到最底下的时候执行接口加载下一页
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  created() {
    this.getOrgList();
    this.getList();
    this.getRegion();
    this.getDoctorlist();
  },
  methods: {
    handleDeptScroll() {
      this.docPageNum++;
      this.getDoctorlist();
    },
    async getDoctorlist() {
      let params = {
        pageNum: this.docPageNum,
        pageSize: 10,
      };
      let res = await getDoctorlist(params);
      this.docList.push(...res.data.records);
    },
    async getTitleTypeList() {
      let res = await getTitleTypeList();
      this.docTypeList = res.data;
    },
    async getTitleList() {
      let res = await getTitleList({ code: "" });
      this.titleIdList = res.data;
    },
    medicalFileRemove() {
      this.form.docIcon = "";
    },
    /** 通过父级行政区划代码获取子集 */
    async getRegion() {
      let res = await getRegion({ parentCode: "-1" });
      this.provinceList = res.data;
    },
    handleMedicalSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.docIcon = res.data;
    },
    /** 查询机构列表 */
    getOrgList() {
      let params = {
        pageNum: this.orgPageNum,
        pageSize: 10,
      };
      listDept(params).then((response) => {
        this.orgList.push(...response.data.records);
      });
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      let params = {
        ...this.queryParams,
        pageNum: this.pageNum,
        pageSize: 10,
      };
      getMdtTeamlist(params).then((response) => {
        console.log(response.records, response);
        this.total = response.data.total;
        this.tableData = response.data.records;
        console.log(this.tableData);

        this.loading = false;
      });
    },
    getDictList(data, key) {
      let res = this[key].find((item) => item.value == data);
      if (res) {
        return res.label;
      }
    },
    getArea(str) {
      if (str) {
        let res = JSON.parse(str);
        if (res instanceof Array) {
          console.log(res, "ss");
          // res.map(item=> item.)
        }
      }
      return str;
    },
    currentChage(pageNum) {
      this.pageNum = pageNum;
      this.getList();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },
    lazyLoad(node, resolve) {
      const { level, value } = node;
      // 调用接口获取子节点数据

      getRegion({ parentCode: value })
        .then((response) => {
          const nodes = response.data.map((item) => ({
            code: item.code,
            name: item.name,
          }));
          resolve(nodes);
        })
        .catch((error) => {
          console.error("加载子节点失败:", error);
          resolve([]); // 在失败的情况下返回空数组
        });
    },
    cascaderChange(v) {
      console.log(v);
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    getMember(v) {
      if (v.row.members) {
        return v.row.members.map((item) => item.name).join(",");
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.pageNum = 1;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.type = "add";
      this.open = true;
      this.title = "维护信息";
      // getMdtTeamlist().then(response => {
      //   this.deptOptions = this.handleTree(response.data, "deptId");
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.type = "edit";
      this.reset();
      getMdtTeam({ id: row.id }).then((response) => {
        this.form = response.data;
        this.form.members = response.data.members.map((item) => item.id);
        this.open = true;
        this.title = "维护信息";
        this.$nextTick(() => {});
      });
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$modal
        .confirm("确认要" + text + "该机构吗？")
        .then(function () {
          return changeStatus({ id: row.id });
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let members = this.docList
            .filter((item) => this.form.members.includes(item.id))
            .map((item) => {
              return {
                id: item.id,
                name: item.name,
              };
            });
          let serviceAreaData = this.form.serviceArea.map((item) => {
            console.log(item);

            return {
              level: item.length,
              code: item,
            };
          });
          let serviceArea = JSON.stringify(serviceAreaData);
          if (this.type == "edit") {
            updateMdtTeam({ ...this.form, members, serviceArea }).then(
              (response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            );
          } else {
            addMdtTeam({ ...this.form, members, serviceArea }).then(
              (response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            );
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除该数据项？")
        .then(function () {
          return delMdtTeam({ id: row.id });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.avatar {
  width: 148px;
}
</style>