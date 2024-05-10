<template>
    <div class="patientDetails">
      <div class="header">
        <div class="left">
          <img class="idcard" src="@/assets/idcard.png" alt="">
          <div>ID：{{detail.id}}</div>
        </div>
        <div class="center">
          <span :style="{ color: getColor(status) }">{{ getStatus(status) }}</span>
          <span class="reason" v-if="[9].includes(status)">(原因：{{detail.statusInfo}})</span>
        </div>
        <div class="right">
          <!-- 已结束 -->
          <!--  1待审核 2待会诊 3会诊中 4已结束 9审核不通过 -->
          <div v-if="[2, 3, 4, 9].includes(status)">
            <el-button size="mini" @click="getBack">返回</el-button>
          </div>
          <!-- 待审核 -->
          <div class="examined" v-if="status == 1">
            <el-button size="mini" @click="getBack">返回</el-button>
            <el-button type="success" size="mini" @click="handleAduit(1)">通过</el-button>
            <el-button type="warning" size="mini" @click="handleAduit(0)">审核拒绝</el-button>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="info border-b">
          <div class="title">患者信息</div>
          <div class="card">
            <div class="item">
              <div class="label">姓名：</div>
              <div class="value">{{detail.patientName}}</div>
            </div>
            <div class="item">
              <div class="label">身份证：</div>
              <div class="value">{{detail.patientIdcard || '暂无'}}</div>
            </div>
            <div class="item">
              <div class="label">年龄：</div>
              <div class="value">{{detail.patientAge}}岁</div>
            </div>
            <div class="item">
              <div class="label">性别：</div>
              <div class="value">{{detail.patientGender == 1 ? '男': '女'}}</div>
            </div>
            <div class="item">
              <div class="label">联系电话：</div>
              <div class="value">{{detail.patientPhone || '暂无'}}</div>
            </div>
            <div class="item">
              <div class="label">现住址：</div>
              <div class="value">{{detail.patientAddress || '暂无'}}</div>
            </div>
            <div class="item flex1">
              <div class="label">详细地址：</div>
              <div class="value">{{detail.patientAddressDetail || '暂无'}}</div>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="title">会诊信息</div>
          <div class="card">
            <div class="item">
              <div class="label">申请机构：</div>
              <div class="value">{{detail.applyOrgName}}</div>
            </div>
            <div class="item">
              <div class="label">申请医生：</div>
              <div class="value">{{detail.applyDoctorName}}</div>
            </div>
            <div class="item">
              <div class="label">联系电话：</div>
              <div class="value">{{detail.applyDoctorPhone}}</div>
            </div>
            <div class="item flex1">
              <div class="label">会诊时间：</div>
              <div class="value">{{getMeetTime()}}</div>
            </div>
            <div class="item flex1">
              <div class="label">会诊目的：</div>
              <div class="value">{{detail.meetAim || '暂无'}}</div>
            </div>
            <div class="item flex1">
              <div class="label">会诊人员：</div>
              <div class="value">{{getMeetPeople(detail.meetMember)}}</div>
            </div>
            <div class="item flex1">
              <div class="label">补充说明：</div>
              <div class="value">{{detail.remark || '暂无'}}</div>
            </div>
          </div>
        </div>
        <div class="info border-t" v-if="[4].includes(status)">
          <div class="title">会诊意见</div>
          <div class="card">
            <div class="item flex1">
              <div class="label">会诊意见：</div>
              <div class="value">{{detail.meetAdvice || '暂无'}}</div>
            </div>
            <div class="item flex1">
              <div class="label">会诊人员：</div>
              <div class="value">{{getMeetPeople(detail.confereeMember)}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 弹窗 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" width="500px" :before-close="handleClose" close-on-click-modal>
        <!-- 通过 -->
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="会诊专家:" v-if="aduitType">
            <el-select filterable multiple v-model="form.meetember" placeholder="请选择会诊专家" style="width: 100%;">
              <el-option :label="item.name" :value="item.userid" v-for="item in consultantList" :key="item.userid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原因:" v-else>
            <el-input type="textarea" :rows="3"  maxlength="30" show-word-limit placeholder="请输入原因" v-model="form.auditInfo">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  <script>
  import {getMeetDetail, setMeetAudit} from "@/api/meet"
  export default {
    data() {
      return {
        form: {
            meetember: []
        },
        aduitType: 1,
        status: 1,
        title: "审核通过",
        dialogVisible: false,
        // 1待审核 2待会诊 3会诊中 4已结束 9审核不通过
        statuList: [
          {
            label: "待审核",
            value: 1
          },
          {
            label: "待会诊",
            value: 2
          },
          {
            label: "会诊中",
            value: 3
          },
          {
            label: "已结束",
            value: 4
          },
          {
            label: "审核不通过",
            value: 9
          }
        ],
        consultantList: [
                // {
                //     "userid": "2091",
                //     "name": "毕东军（男）",
                //     "title": "其他类型",
                //     type: 9
                // },
                {
                    "userid": "282959255937917229",
                    "name": "陈玮毓（男，椒江区葭沚卫生院）",
                    "title": "心理师",
                    type: 5
                }
            ],
        detail: {}
      }
    },
    filter: {
  
    },
    created() {
        this.getMeetDetail()
    },
    methods: {
      getStatus(v) {
        let res = this.statuList.find(item => item.value == v)
        if (res) {
          return res.label
        }
        return '--'
      },
      getMeetTime() {
      let {meetStartTime, meetEndTime} = this.detail
      if(meetStartTime && meetEndTime) {
        return meetStartTime.replace("T", ' ') + ' 至 ' + meetEndTime.replace("T", ' ')
      }
      return ''
    },
    getBack() {
        this.$router.back()
    },
    async setMeetAudit(params) {
        let res = await setMeetAudit(params)
        this.dialogVisible = false
        this.getMeetDetail()
        if(res.code == 0) {
          this.$message.success('操作成功')
        }
    },
    getMeetPeople(meetMember) {
        let peoples = []
        let people = ''
        if(meetMember) {
            peoples = JSON.parse(meetMember)
            console.log(peoples);
            people = peoples.map(item=> {
                return `${item.name}(${item.title})`
            }).join(",")
        }
        return people
    },
      async getMeetDetail() {
        let params= {
            id: this.$route.query.id
        }
        let res = await getMeetDetail(params)
        this.detail = res.data
        this.status = +res.data.status
      },
      getColor(v) {
        // 1待审核 2待会诊 3会诊中 4已结束 9审核不通过
        let color = ""
        switch (v) {
          case 1:
            color = '#E6A23C'
            break;
          case 2:
            color = '#E6488A'
            break;
          case 3:
            color = '#1890FF'
            break;
          case 4:
            color = '#67C23A'
            break;
          case 9:
            color = '#F56C6C'
            break;
          default:
        }
        return color
      },
      handleClose() {
        this.dialogVisible = false
      },
      handleAduit(flag) {
        this.dialogVisible = true
        this.aduitType = flag
        this.title = flag ? '审核通过' : '审核不通过'
      },
      handleConfirm() {
        let params = {}
        if(this.aduitType) {
            if(!this.form.meetember.length) {
                this.$message.warning("请选择会诊人员")
                return
            }
            let meetember = this.consultantList.filter(item=> this.form.meetember.includes(item.userid))
            params = {
                auditInfo: "",
                auditResult: "1",
                id: this.$route.query.id,
                meetMember: JSON.stringify(meetember)
            }
        } else {
            if(!this.form.auditInfo) {
                this.$message.warning("请输入拒绝原因")
                return
            }
            params = {
                auditInfo: this.form.auditInfo,
                auditResult: "2",
                id: this.$route.query.id,
                meetMember: ""
            }
        }
        this.setMeetAudit(params)
      }
    }
  }
  </script>
  <style lang="scss">
  .patientDetails {
    background-color: #f2f2f2;
    overflow: hidden;
    height: 100vh;
  
    .header {
      padding: 8px 24px;
      margin: 8px;
      box-sizing: border-box;
      background-color: #fff;
      display: flex;
      align-items: center;
      border-radius: 4px;
  
      .left {
        display: flex;
        align-items: center;
        white-space: nowrap;
  
        img {
          width: 30px;
          object-fit: scale-down;
          margin-right: 12px;
        }
      }
  
      .center {
        margin-right: auto;
        margin-left: 80px;
        display: flex;
  
        .reason {
          margin-left: 8px;
          color: #838080;
          font-size: 14px;
          display: block;
          flex: 1;
          max-width: 700px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: auto;
        }
      }
    }
  
    .content {
      margin: 8px;
      background-color: #fff;
      padding: 8px 24px;
  
      .info {
        padding-bottom: 50px;
  
        .title {
          font-size: 18px;
          font-weight: bold;
          color: #12151b;
          margin: 22px 0;
        }
  
        .card {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
  
          .item {
            box-sizing: border-box;
            flex-basis: calc(33% - 40px);
            display: flex;
            align-items: center;
            font-size: 14px;
  
            .label {
              white-space: nowrap;
              width: max-content;
            }
  
            .value {
              color: #838080;
              white-space: nowrap;
              width: max-content;
              flex: 1;
            }
          }
  
          .flex1 {
            flex-basis: 100%;
            flex-wrap: nowrap;
          }
        }
      }
  
      .border-b {
        border-bottom: solid #E4E7ED 1px;
      }
  
      .border-t {
        border-top: solid #E4E7ED 1px;
      }
    }
  
    .dialog {
      display: flex;
      align-items: center;
  
      .label {
        margin-right: 20px;
      }
    }
  }
  </style>