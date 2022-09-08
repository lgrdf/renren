<template>
  <el-dialog
    :title="!dishForm.id ? '新增菜品' : '修改菜品'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="200">
    <el-form :model="dishForm" :rules="dataRule" ref="dishFrom" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <!-- 菜品名称 -->
      <el-form-item  label="菜品名称" prop="name">
        <el-input v-model="dishForm.name" placeholder="请输入菜品名称" style="width:200px"></el-input>
      </el-form-item>
      <!-- 售价 -->
      <el-form-item label="售价" prop="price" >
        <el-input v-model="dishForm.price" style="width:200px" type="number"></el-input>
      </el-form-item>
      <!-- 菜品描述 -->
      <el-form-item label="菜品描述" prop="description">
        <el-input 
        type="textarea" 
        v-model="dishForm.description"
        placeholder="请输入菜品描述"
        style="width:400px"></el-input>
      </el-form-item>
      <!-- 菜品图片 -->
      <el-form-item label="菜品图片" required>
        <el-upload
          action="#"
          ref="upload"
          list-type="picture-card"      
          :limit="1"
          :on-exceed="exceed"
          :on-change="onChange"
          :on-remove="handleRemove"
          :file-list="imageList"
          :auto-upload="false"
          :before-upload="beforeAvatarUpload">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-delete"  @click="handleRemoveCard(file)">
            <i class="el-icon-delete"></i>
            </span>
            </span>
          </div>
        </el-upload>
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
  name:'addOrUpdateDish',
  data() {
    return {
      visible:false,
      imageList:[],
      dishForm:{
        id:0, //菜品id
        businessId:this.$store.state.merchantId,
        categoryId:0,
        name:'',
        description:'',
        price:'',
      },
      dataRule:{
        name: [
          { required: true, message: '菜品名称不能为空', trigger: 'blur' }
        ],
        description:[
          { required: true, message: '菜品描述不能为空', trigger: 'blur'}
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
        ],

      },
    }
  },
  methods:{
    //初始化数据
    init(id,pid,name,description,price,image) {
      this.dishForm.categoryId = pid
      this.dishForm.id = id || 0 //判断新增or修改
      this.visible = true
      if(!this.dishForm.id){
        this.$refs['dishFrom'].resetFields()
        this.$refs.upload.clearFiles()
        this.imageList = []
      }else {
        this.dishForm.name = name
        this.dishForm.description = description    
        this.dishForm.price = price
        this.imageList.raw.url = image
      }   
    },
    // 提交数据
    dataFormSubmit() {
      this.$refs['dishFrom'].validate((valid) => {
          if (valid) {
            var _this = this
            const fd = new FormData()
            this.imageList.forEach(file=> {
              fd.append('dishImages',file.raw)
            })
            if(this.dishForm.id){
               fd.append('id',this.dishForm.id)
            }
            fd.append('businessId',this.dishForm.businessId)
            fd.append('categoryId',this.dishForm.categoryId)
            fd.append('name',this.dishForm.name)
            fd.append('description',this.dishForm.description)
            fd.append('price',this.dishForm.price)
            this.$axios({
              url:`/dish/dish/${!_this.dishForm.id ? 'save' : 'update'}`,
              method:'post',
              headers:{'Content-Type':'application/json'}, //设置请求头格式为json
              data:fd
            }).then(function(res) {
              if (res.data && res.data.code === 0) {
                _this.$message({
                  message: `${!_this.dishForm.id?'新增' : '修改'}菜品分类成功`,
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    _this.visible = false
                    _this.$emit('refreshList')
                  }
                })
              } else {
                _this.$message.error(res.data.msg)
              }
            }).catch(function(err){
              console.log(err)
            })
          }
        })
    },
    // 限制要求函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!(isJPG || isPNG)) {
          this.$message.error('上传菜品图片只能是JPG/PNG格式!');
      }
      if (!isLt2M) {
            this.$message.error('上传菜品图片大小不能超过 2MB!');
      }
      return true;
    },
    // 图片移除
    handleRemove(file) {
        this.imageList.splice(this.imageList.indexOf(file), 1);
    },
    // 状态改变
    onChange(file, fileList) {
        this.imageList = fileList;
        if(fileList.length === 0)
        this.submitArticleData.articleImgs = [];
    },
    // 超过1张图片限制数
    exceed(){
        this.$message.warning("最多上传1张照片!");
    },
  }

}
</script>


<style>

</style>