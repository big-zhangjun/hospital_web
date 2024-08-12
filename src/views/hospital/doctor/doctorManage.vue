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
                        <el-form-item label="状态：">
                            <el-select style="width: 100%;" size="mini" v-model="form.status" placeholder="请选择">
                                <el-option v-for="item in statusList" :key="item.name" :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所在机构：">
                            <el-select style="width: 100%;" size="mini" v-model="form.applyOrgId" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="执业类别：">
                            <el-date-picker style="width: 100%;" v-model="form.applyTime" type="datetimerange"
                                size="mini" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="职称：">
                            <el-date-picker style="width: 100%;" v-model="form.meetTime" type="datetimerange"
                                size="mini" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="科室：">
                            <el-date-picker style="width: 100%;" v-model="form.meetTime" type="datetimerange"
                                size="mini" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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
                <el-table-column prop="id" label="ID" >
                </el-table-column>
                <el-table-column prop="applyTime" label="姓名">
                    <template slot-scope="row">
                        <span>{{ getApplyTime(row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="meetAim" label="手机号">
                </el-table-column>
                <el-table-column prop="applyOrgName" label="身份证">
                </el-table-column>
                <el-table-column prop="applyDoctorName" label="所在机构">
                </el-table-column>
                <el-table-column prop="patientName" label="执业类别">
                </el-table-column>
                <el-table-column prop="meetTime" label="职称" >
                    <template slot-scope="row">
                        <span>{{ getMeetTime(row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="科室">
                    <template slot-scope="row">
                        <span>{{ getStatus(row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="状态" width='80'>
                    <template slot-scope="row">
                        <el-link type="primary" @click="handleLook(row)">查看</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <div class="footer">
                <el-pagination background layout="prev, pager, next" :total="total" @size-change="sizeChange"
                    @current-change="currentChage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { getDoctorlist } from "@/api/doctor"

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
        this.getDoctorlist()
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
            this.getDoctorlist()
        },
        // 搜索
        handleSearch() {
            this.getDoctorlist()
        },
        sizeChange(pageSize) {
            console.log(pageSize);
        },
        currentChage(pageNum) {
            this.pageNum = pageNum
            this.getDoctorlist()
        },
        async getDoctorlist() {
            let params = {
                "deptId": "",
                "docNo": "",
                "name": "",
                "orgId": "",
                "pageNum": this.pageNum,
                "pageSize": 10,
                "status": 1,
                "titleId": "",
                "dutyType": '2'
            }
            let res = await getDoctorlist(params)
            console.log(res);
            this.tableData = res.data.records
            this.total = res.data.total
        },
        // getDocorlist
        // 处理时间函数
        formatDate(st) {
            const date = new Date(st);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;

        },

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