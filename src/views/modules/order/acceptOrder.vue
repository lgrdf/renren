<template>
  <div class="mod-home">
		<div>
			<h3>订单接收</h3>
		</div>
		<div class="container">
			<!-- 外卖 -->
			<div class="takeout" >
        <el-collapse v-model="activeNames1" @change="handleChange1">
          <el-collapse-item v-for="(item,index) in outArr" :key="index" :title="`外卖订单${index}`" 
           :name="item.uuid" class="box-card">
           <div class="text ite">
							商家名称:{{item.businessName}}
  					</div>
						<div v-for="(dish,ind) in item.dishList" :key="ind" class="text ite">
              <span>{{dish.dishName}}</span> 
              <span class="num">x{{dish.count}}</span> 
              <span class="price">￥ {{dish.totalPrice}}</span>
            </div>
            <div>--------------------------------------------------------------------------------------------</div>
						<div class="text ite">
							配送费:<span class="price">￥ {{item.postPrice}}</span>
  					</div>
						<div class="text ite">
							优惠价格:<span class="price">￥ -{{item.discountPrice}}</span>
  					</div>
						<div class="text ite">
							用户付款:<span class="pay">￥ {{item.payPrice}}</span>
  					</div>
						<div class="text ite">
							支付时间:<span class="price">{{item.payDateTime}}</span>
  					</div>
            <el-button style="float: right;" type="text" @click="confirmOut(index)">确认订单</el-button>
          </el-collapse-item>
        </el-collapse>
		  </div>
		  <!-- 堂食 -->
		  <div class="eatin">
        <el-collapse v-model="activeNames2" @change="handleChange2">
          <el-collapse-item v-for="(item,index) in eatinArr"  :key="item.uuid" :title="`堂食订单${index}`" 
           :name="item.uuid" class="box-card">
           <div class="text ite">
							商家名称:{{item.businessName}}
  					</div>
						<div v-for="(dish,ind) in item.dishList" :key="ind" class="text ite">
              <span>{{dish.dishName}}</span> 
              <span class="num">x{{dish.count}}</span> 
              <span class="price">￥ {{dish.totalPrice}}</span>
            </div>
            <div>--------------------------------------------------------------------------------------------</div>
						<div class="text ite">
							配送费:<span class="price">￥ {{item.postPrice}}</span>
  					</div>
						<div class="text ite">
							优惠价格:<span class="price">￥ -{{item.discountPrice}}</span>
  					</div>
						<div class="text ite">
							用户付款:<span class="pay">￥ {{item.payPrice}}</span>
  					</div>
						<div class="text ite">
							支付时间:<span class="price">{{item.payDateTime}}</span>
  					</div>
            <el-button style="float: right;" type="text" @click="confirmOrder(index)">确认订单</el-button>
          </el-collapse-item>
        </el-collapse>
		  </div>
		</div> 
  </div>
</template>

<script>
  export default {
		data() {
			return {
				activeNames1:[],
				activeNames2:[],
				outArr:[],
				eatinArr:[]
			}
		},
		created(){
			//获取数据
			this.getOutData()
			this.getEatinArr()
			// 在页面刷新之前把信息保存到sessionStorage
			window.addEventListener('beforeunload',()=>{
				sessionStorage.setItem('waerdfrteat-'+this.$store.state.merchantId,JSON.stringify(this.$store.state.eatOrder))
				sessionStorage.setItem('ksiwpsusout-'+this.$store.state.merchantId,JSON.stringify(this.$store.state.outOrder))
			})
		},
		methods:{
			//获取外卖订单列表
			getOutData(){
				this.outArr = this.$store.state.outOrder
			},
			// 获取堂食订单列表
			getEatinArr() {
				this.eatinArr = this.$store.state.eatOrder
			},
			//确认堂食订单后数据消失
			confirmOrder(index){
				this.$store.commit('deleteEatOrder',index)
				this.getEatinArr()
			},
			//确认外卖订单后数据消失
			confirmOut(index) {
				this.$store.commit('deleteOutOrder',index)
				this.getOutData()
			},
			//更新堂食订单展开情况
			handleChange2(val) {
        console.log(val)
				this.activeNames2 = val
      },
			//更新外卖订单展开情况
			handleChange1(val) {
        console.log(val)
				this.activeNames1 = val
      }
		},
		
  }
</script>

<style lang="scss" scoped>

  .container {
		display: flex;
		justify-content: flex-start;
		align-items: center;
    line-height: 1.5;
		width: 1600px;
		height: 600px;
  }
	.takeout, .eatin {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		overflow-y:auto;
		overflow-x: hidden;
		width: 30%;
		height:100%;
		box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}
	.takeout {
		background: url(../../../assets/img/out.png) no-repeat;
		background-size: 100px 80px;
		background-position: center;
		left: 100px;
	}
	.eatin {
		background: url(../../../assets/img/eat.png) no-repeat;
		background-size: 90px 60px;
		background-position: center;
		left: 200px;
	}
  
	.text {
    font-size: 14px;
  }

  .ite {
    margin-bottom: 18px;
  }

  .box-card {
		position: relative;
    width: 400px;
		top:5%;
		left: 10%;
		margin-bottom:20px;
    min-height: 100px;
    /deep/ .el-collapse-item__header{
      font-size: 18px;
      color: #F56C6C;
    }
    /deep/ .el-collapse-item__header:hover{
      color: #0f0505;
    }
		
  }
  .price {
    float: right;
  }
  .pay {
    float: right;
    color: red;
  }
  .num {
    margin-left: 20px;
    font-size: 14px;
    color: #8a8a8a;
  }
</style>





