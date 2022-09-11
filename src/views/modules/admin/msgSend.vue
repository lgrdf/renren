<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="发送至商家：">
        <el-select v-model="key" placeholder="请选择商家" @change="getShopId(key)">
          <el-option v-for="data in businessData" :key="data.id" :label="data.name" :value="data.id">{{
          data.name
          }}</el-option>
          <el-option key="null" :value="null" label="全部商家">全部商家</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-input type="textarea" :rows="13" placeholder="请输入内容" v-model="textarea" style="margin-bottom: 10px">
    </el-input>
    <el-button @click="OnDelAll()" type="info" style="margin-left: 180px">清空
      <i class="el-icon-document-delete"></i>
    </el-button>
    <el-button @click="OnUpload(key, textarea)" type="info" style="margin-left: 400px">发送
      <i class="el-icon-upload"></i>
    </el-button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      textarea: "",
      key: "",
      businessData: [],
    };
  },
  mounted() {
    this.getID();
  },
  methods: {
    getShopId(val) {
      this.businessData.id = val;
    },
    getID() {
      var _this = this;
      this.$axios({
        url: "/websocket/socketapi/onlineBusiness",
        method: "get",
      })
        .then(function (res) {
          console.log(res.data);
          if (res.data && res.data.code === 0 && res.data.msg === "success") {
            _this.businessData = res.data.businessData;
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    OnUpload(sid, data) {
      var _this = this;
      this.$axios({
        url: "/websocket/socketapi/sendinfo",
        method: "post",
        data: {
          userId: "business",
          sid: sid,
          data: data,
        },
      })
        .then(function (res) { })
        .catch(function (err) {
          console.log(err);
        });
    },
    OnDelAll() {
      this.textarea = "";
    },
  },
};
</script>