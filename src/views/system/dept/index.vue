<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="机构查询" prop="orgName">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入名称/机构编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所在区域" prop="jurisdictionCode">
        <el-cascader
          v-model="queryParams.jurisdictionCode"
          @change="cascaderChange"
          :options="provinceList"
          :props="props"
          style="width: 100%"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="医院层级" prop="hosTier">
        <el-select
          v-model="queryParams.hosTier"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in hosTierList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医院类别" prop="hosType">
        <el-select
          v-model="queryParams.hosType"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in hospitalTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医院等级" prop="hosLevel">
        <el-select
          v-model="queryParams.hosLevel"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in levels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="部门状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="orgCode" label="机构编码"></el-table-column>
      <el-table-column prop="orgShortName" label="机构简称"></el-table-column>
      <el-table-column prop="areaName" label="所在区域"> </el-table-column>
      <el-table-column label="服务模式" align="center" prop="serviceType">
        <template slot-scope="scope">
          <div>
            {{ getDictList(scope.row.serviceType, "serviceTypelist", "array") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="医院层级" align="center" prop="hosTier">
        <template slot-scope="scope">
          <div>{{ getDictList(scope.row.hosTier, "hosTierList") }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="咨询热线"
        align="center"
        prop="hosTel"
      ></el-table-column>
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
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
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
            v-if="scope.row.parentId != 0"
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

    <!-- 添加或修改部门对话框 -->
    <el-drawer :title="title" :visible.sync="open" size="500px" append-to-body>
      <div style="margin: 24px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="机构名称" prop="orgName">
                <el-input
                  placeholder="请输入"
                  v-model="form.orgName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="机构简介" prop="orgShortName">
                <el-input
                  placeholder="请输入"
                  v-model="form.orgShortName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="机构编码 " prop="orgCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.orgCode"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="医院层级" prop="hosTier">
                <el-select
                  v-model="form.hosTier"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in hosTierList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="医院等级" prop="hosLevel">
                <el-select
                  v-model="form.hosLevel"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in levels"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="医院等次" prop="hosGrade">
                <el-select
                  v-model="form.hosGrade"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in hosGradeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="医院类别" prop="hosType">
                <el-select
                  v-model="form.hosType"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in hospitalTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="行政所属" prop="jurisdictionCode">
                <el-cascader
                  ref="jurisdiction"
                  v-model="form.jurisdictionCode"
                  @change="cascaderChange"
                  :options="provinceList"
                  :props="props"
                  style="width: 100%"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所在区域" prop="areaCode">
                <el-cascader
                  ref="area"
                  v-model="form.areaCode"
                  @change="cascaderChange"
                  :options="provinceList"
                  :props="props"
                  style="width: 100%"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="机构经纬度" label-width="90px">
                <div style="display: flex; gap: 20px">
                  <el-input
                    placeholder="填写经度"
                    v-model="form.hosLongitude"
                  ></el-input>
                  <el-input
                    placeholder="填写纬度"
                    v-model="form.hosLatitude"
                  ></el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细地址" label-width="90px" prop="address">
                <el-input
                  placeholder="请输入"
                  v-model="form.address"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="机构图片" label-width="90px" prop="hosIcon">
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
              <el-form-item label="状态" label-width="90px" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio label="0">否</el-radio>
                  <el-radio label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <h2
            style="
              font-size: 16px;
              width: 100%;
              padding: 20px 0;
              border-top: 1px solid #f1f1f1;
            "
          >
            安宁疗护信息
          </h2>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="服务模式"
                label-width="90px"
                prop="serviceType"
              >
                <el-checkbox-group v-model="form.serviceType">
                  <el-checkbox label="1">住院安宁</el-checkbox>
                  <el-checkbox label="2">门诊安宁</el-checkbox>
                  <el-checkbox label="3">居家安宁</el-checkbox>
                  <el-checkbox label="4">安宁共照</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="咨询电话" label-width="90px" prop="hosTel">
                <el-input placeholder="请输入" v-model="form.hosTel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="咨询时间"
                label-width="90px"
                prop="consultationTime"
              >
                <el-date-picker
                  v-model="form.consultationTime"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="医院介绍" label-width="90px" prop="hosInfo">
                <el-input
                  placeholder="请输入"
                  v-model="form.hosInfo"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-form-item label="上级部门" prop="parentId">
                <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer"
                  placeholder="选择上级部门" />
              </el-form-item> -->
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item label="部门名称" prop="deptName">
                <el-input v-model="form.deptName" placeholder="请输入部门名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序" prop="orderNum">
                <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="负责人" prop="leader">
                <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门状态">
                <el-radio-group v-model="form.status">
                  <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value"
                    :label="dict.value">{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row> -->
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
  changeDeptStatus,
  delDept,
  saveHosInfo,
  updateDept,
  listDeptExcludeChild,
} from "@/api/system/dept";
import { getRegion } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import region from "@/utils/region"

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
      deptList: [],
      total: 0,
      // 部门树选项
      deptOptions: [],
      provinceList: region,
      props: {
        value: "code",
        label: "name",
        checkStrictly: true,
        // lazy: true,
        // lazyLoad(node, resolve) {
        //   const { level, value } = node;
        //   // 调用接口获取子节点数据
        //   getRegion({ parentCode: value })
        //     .then((response) => {
        //       const nodes = response.data.map((item) => ({
        //         code: item.code,
        //         name: item.name,
        //       }));
        //       resolve(nodes);
        //     })
        //     .catch((error) => {
        //       console.error("加载子节点失败:", error);
        //       resolve([]); // 在失败的情况下返回空数组
        //     });
        // },
      },
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
      form: {
        serviceType: [],
      },
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
      hosGradeList: [
        { label: "甲", value: "1" },
        { label: "乙", value: "2" },
        { label: "丙", value: "3" },
        { label: "其他", value: "9" },
      ],
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
      // 表单校验
      rules: {
        orgName: [
          { required: true, message: "机构名称不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        orgShortName: [
          { required: true, message: "机构简介不能为空", trigger: "blur" },
        ],
        orgCode: [
          { required: true, message: "机构编码不能为空", trigger: "blur" },
        ],
        hosTier: [
          { required: true, message: "医院层级不能为空", trigger: "blur" },
        ],
        hosLevel: [
          { required: true, message: "医院等级不能为空", trigger: "blur" },
        ],
        hosGrade: [
          { required: true, message: "医院等次不能为空", trigger: "blur" },
        ],
        hosType: [
          { required: true, message: "医院类别不能为空", trigger: "blur" },
        ],
        jurisdictionCode: [
          { required: true, message: "行政所属不能为空", trigger: "blur" },
        ],
        areaCode: [
          { required: true, message: "所在区域不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ],
        serviceType: [
          { required: true, message: "服务模式不能为空", trigger: "blur" },
        ],
        consultationTime: [
          { required: true, message: "咨询时间不能为空", trigger: "blur" },
        ],
        hosTel: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
            required: true,
          },
        ],
      },
      pageNum: 1,
      imageUrl: "",
    };
  },
  created() {
    this.getList();
    // this.getRegion();
  },
  methods: {
    medicalFileRemove() {
      this.form.hosIcon = "";
    },
    /** 通过父级行政区划代码获取子集 */
    async getRegion() {
      let res = await getRegion({ parentCode: "-1" });
      this.provinceList = res.data;
    },
    handleMedicalSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.hosIcon = res.data;
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      let { jurisdictionCode } = this.queryParams;
      let params = {
        ...this.queryParams,
        pageNum: this.pageNum,
        jurisdictionCode: jurisdictionCode
          ? jurisdictionCode[jurisdictionCode.length - 1]
          : "",
        pageSize: 10,
      };
      listDept(params).then((response) => {
        this.total = response.data.total;
        this.deptList = response.data.records;
        this.loading = false;
      });
    },
    getDictList(data, key, type) {
      if (type == "array") {
        let strs = [];
        console.log(data);
        if(!data) return
        let list = typeof data == 'string' ? data.split(",") : data
        list.forEach((ele) => {
            let res = this[key].find((item) => item.value == ele);
            if (res) {
              strs.push(res.label);
            }
          });
        return strs.join(",");
      }
      let res = this[key].find((item) => item.value == data);
      if (res) {
        return res.label;
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
      this.form = {
        serviceType: [],
      };
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
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加部门";
      // listDept().then(response => {
      //   this.deptOptions = this.handleTree(response.data, "deptId");
      // });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // getDept(row.deptId).then(response => {
      this.form = row;
      console.log(row);
      
      if(row.serviceType) {
        this.form.serviceType = typeof row.serviceType == 'string' ? row.serviceType.split(",") : row.serviceType;
      } else {
        this.form.serviceType = []
      }
      this.open = true;
      this.title = "修改部门";
      this.$nextTick(() => {
        this.$refs.area.$el.querySelector("input").value = row.areaName;
        this.$refs.jurisdiction.$el.querySelector("input").value =
          row.jurisdictionName;
      });
      // listDeptExcludeChild(row.deptId).then(response => {
      //   this.deptOptions = this.handleTree(response.data, "deptId");
      //   if (this.deptOptions.length == 0) {
      //     const noResultsOptions = { deptId: this.form.parentId, deptName: this.form.parentName, children: [] };
      //     this.deptOptions.push(noResultsOptions);
      //   }
      // });
      // });
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$modal.confirm('确认要' + text + '该机构吗？').then(function () {
        return changeDeptStatus(row.id, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let { jurisdictionCode, areaCode, serviceType } = this.form;
          let jurisdictionNode = this.$refs.jurisdiction.getCheckedNodes();
          let areaNode = this.$refs.area.getCheckedNodes();
          console.log(jurisdictionNode[0]);
          
          let params = {
            ...this.form,
            jurisdictionCode: jurisdictionCode
              ? jurisdictionCode[jurisdictionCode.length - 1]
              : "",
            areaCode: areaCode ? areaCode[areaCode.length - 1] : "",
            jurisdictionName: jurisdictionNode.length && jurisdictionNode[0]
              ? jurisdictionNode[0].pathLabels.join("/")
              : "",
            areaName: areaNode.length && areaNode[0] ? areaNode[0].pathLabels.join("/") : "",
            serviceType: serviceType.join(","),
          };

          if (this.form.deptId != undefined) {
            updateDept(params).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            saveHosInfo(params).then((response) => {
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
        .confirm('是否确认删除名称为"' + row.deptName + '"的数据项？')
        .then(function () {
          return delDept({id: row.id});
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