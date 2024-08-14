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
      <el-form-item label="所在机构" prop="orgId">
        <el-select
          v-model="queryParams.orgId"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.orgName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职业类别" prop="docType">
        <el-select
          v-model="queryParams.docType"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in docTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职称" prop="titleId">
        <el-select
          v-model="queryParams.titleId"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in titleIdList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
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
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="docIcon" label="头像">
          <template slot-scope="scope">
            <img
              shape="square"
              v-if="scope.row.docIcon"
              class="docIcon"
              size="medium"
              :src="scope.row.docIcon"
            />
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="certNo" label="身份证"> </el-table-column>
        <el-table-column prop="orgName" label="所在机构"> </el-table-column>
        <el-table-column prop="docType" label="执业类别">
          <template slot-scope="scope">
            {{ getDictList(scope.row.docType, "docTypeList") }}
          </template>
        </el-table-column>
        <el-table-column prop="titleName" label="职称"> </el-table-column>
        <el-table-column prop="deptName" label="科室"> </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
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
            <el-link type="primary" @click="handleUpdate(scope.row)"
              >编辑</el-link
            >
            <el-button
              style="margin-left: 12px"
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
              <el-form-item label="姓名" prop="name">
                <el-input placeholder="请输入" v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="手机号" prop="phone">
                <el-input placeholder="请输入" v-model="form.phone"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="身份证号" prop="certNo">
                <el-input placeholder="请输入" v-model="form.certNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属机构" prop="orgId">
                <el-select
                  v-model="form.orgId"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in orgList"
                    :key="item.id"
                    :label="item.orgName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属科室" prop="orgId">
                <el-select
                  v-el-select-loadmore="handleDeptScroll"
                  v-model="form.deptId"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="职业类别" prop="docType">
                <el-select
                  v-model="form.docType"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in docTypeList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="职称" prop="titleId">
                <el-select
                  v-model="form.titleId"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in titleIdList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="照片" prop="docIcon">
                <el-upload
                  ref="upload"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="medicalFileRemove"
                  accept=".jpg, .png, .pdf"
                  :action="upload.url"
                  list-type="picture-card"
                  :headers="upload.headers"
                  :on-success="handleMedicalSuccess"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
import { getToken } from "@/utils/auth";
import {
  listDept,
  getTitleTypeList,
  getTitleList,
  getDeptList,
} from "@/api/system/dept";
import {
  getDoctorlist,
  addDoctor,
  delDoctor,
  getDoctor,
  updateDoctor,
  changeStatus,
  getPath,
} from "@/api/anning/talents/hospital/doctor.js";

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
      // 显示搜索条件
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
      statusList: [
        { label: "正常", value: "1" },
        { label: "停用", value: "0" },
      ],
      // 表单参数
      form: {},
      serviceTypelist: [
        { label: "住院安宁", value: "1" },
        { label: "门诊安宁", value: "2" },
        { label: "居家安宁", value: "3" },
        { label: "安宁共照", value: "4" },
      ],
      hosTierList: [
        { label: "市本级", value: "1" },
        { label: "区县级", value: "2" },
        { label: "乡镇街道", value: "3" },
        { label: "村社区", value: "4" },
      ],
      levels: [
        { label: "三级", value: "1" },
        { label: "二级", value: "2" },
        { label: "一级", value: "3" },
        { label: "其他", value: "9" },
      ],
      hospitalTypes: [
        { label: "综合医院", value: "1" },
        { label: "肿瘤医院", value: "2" },
        { label: "眼科医院", value: "3" },
        { label: "口腔医院", value: "4" },
        { label: "妇幼保健", value: "5" },
        { label: "儿童医院", value: "6" },
        { label: "中医医院", value: "7" },
        { label: "骨伤医院", value: "8" },
        { label: "其他", value: "99" },
      ],
      docTypeList: [],
      orgPageNum: 1,
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "front/profile/add",
        // 上传的文件列表
        fileList: [],
      },
      type: "",
      // 表单校验
      rules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        docType: [
          { required: true, message: "职业类别不能为空", trigger: "blur" },
        ],
        orgId: [{ required: true, message: "机构不能为空", trigger: "blur" }],
        docNo: [{ required: true, message: "工号不能为空", trigger: "blur" }],
        titleId: [{ required: true, message: "职称不能为空", trigger: "blur" }],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
            required: true,
          },
        ],
      },
      pageNum: 1,
      deptPageNum: 1,
      deptList: [],
      imageUrl: "",
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
  async created() {
    this.getList();
    this.getRegion();
    this.getOrgList();
    this.getTitleTypeList();
    this.getTitleList();
    this.getDeptList();
  },
  methods: {
    handleDeptScroll() {
      this.deptPageNum++;
      this.getDeptList();
    },
    async getDeptList() {
      let params = {
        pageNum: this.deptPageNum,
        pageSize: 10,
      };
      let res = await getDeptList(params);
      this.deptList.push(...res.data.records);
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
      getDoctorlist({ ...params, dutyType: "2" }).then((response) => {
        console.log(response.records, response);
        this.total = response.data.total;
        response.data.records.forEach(async (ele) => {
          if (ele.docIcon) {
            ele.docIcon = await this.getAvatar(ele.docIcon);
            console.log(ele);
          }
        });
        this.tableData = response.data.records;
        console.log(this.tableData);

        this.loading = false;
      });
    },
    getDictList(data, key) {
      let res = this[key].find((item) => item.code == data);
      if (res) {
        return res.name;
      }
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
      // getDoctorlist().then(response => {
      //   this.deptOptions = this.handleTree(response.data, "deptId");
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.type = "edit";
      this.reset();
      getDoctor({ id: row.id }).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "维护信息";
        this.getPath(response.data.docIcon);
        // this.$nextTick(() => {

        // });
      });
    },
    async getAvatar(id) {
      if (id) {
        let params = { id };
        let res = await getPath(params);
        let str = "http://92146r06e1.zicp.fun" + res.data;
        return str;
      }
    },
    async getPath(id) {
      if (!id) {
        this.imageUrl = "";
        return;
      }
      let params = { id };
      let res = await getPath(params);
      this.imageUrl = "http://92146r06e1.zicp.fun" + res.data;
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
          let deptData = this.deptList.find(
            (item) => item.id == this.form.deptId
          );
          if (deptData) {
            this.form.deptName = deptData.name;
          }
          if (this.type == "edit") {
            updateDoctor({
              ...this.form,
              sort: 1,
              certType: "1",
              dutyType: "2",
            }).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDoctor({
              ...this.form,
              sort: 1,
              certType: "1",
              dutyType: "2",
            }).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除该数据项？")
        .then(function () {
          return delDoctor({ id: row.id });
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
.docIcon {
  width: 48px;
  height: 48px;
  object-fit: scale-down;
}
</style>