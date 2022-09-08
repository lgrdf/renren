<template>
  <el-dialog
    :title="!categoryForm.id ? '新增菜品分类' : '修改菜品分类'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="200">
    <el-form :model="categoryForm" :rules="dataRule" ref="category" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <!-- 种类名称 -->
      <el-form-item  label="种类名称" prop="name">
        <el-input v-model="categoryForm.name" placeholder="请输入种类名称" style="width:200px"></el-input>
      </el-form-item>
      <!-- 种类描述 -->
      <el-form-item label="种类描述" prop="description">
        <el-input 
        type="textarea" 
        v-model="categoryForm.description"
        placeholder="请输入种类描述"
        :autosize="{minRows:2,maxRows:4}"
        style="width:400px"></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
  </el-dialog>
</template>

<script>

export default {
  name:'addOrUpdateMenu',
  data() {
    return {
      visible:false,
      categoryForm:{
        id:0, //菜单id
        businessId:this.$store.state.merchantId,
        name:'',
        description:''
      },
      dataRule:{
        name: [
          { required: true, message: '种类名称不能为空', trigger: 'blur' }
        ],
        description:[
          { required: true, message: '种类描述不能为空', trigger: 'blur'}
        ]

      },
    }
  },
  methods:{
    //初始化数据
    init(id,name,description) {
      this.categoryForm.id = id || 0
      this.visible = true
      if(!this.categoryForm.id){
        this.$refs['category'].resetFields()
      }else {
        this.categoryForm.name = name
        this.categoryForm.description = description    
      }   
   },
    // 提交数据
    dataFormSubmit() {
      this.$refs['category'].validate((valid) => {
          if (valid) {
            var _this = this
            this.$axios({
              url:`/dish/category/${!_this.categoryForm.id ? 'save' : 'update'}`,
              method:'post',
              data:{
                'id':_this.categoryForm.id || undefined,
                'businessId':_this.categoryForm.businessId,
                'name':_this.categoryForm.name,
                'description':_this.categoryForm.description
              }
            }).then(function(res) {
              if (res.data && res.data.code === 0) {
                _this.$message({
                  message: `${!_this.categoryForm.id?'创建' : '修改'}菜品分类成功`,
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    _this.visible = false
                    _this.$emit('refreshDataList')
                  }
                })
              } else {
                _this.$message.error(res.data.msg)
              }
            })
          }
        })
    }

  }

}
</script>


<style>

</style>