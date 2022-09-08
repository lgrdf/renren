<template>
  <div class="mod-home">
		<div>
			<h3>订单接收</h3>
		</div>
		<div class="container">
			<!-- 外卖 -->
			<div class="takeout" >
				<el-card class="box-card" v-for="(item,index) in outArr" :key="index">
					<div slot="header" class="clearfix">
						<span v-if="!item.unfold"><img src="../../assets/img/unfold.png" alt="" width="35px" height="35px"></span>
						<span v-if="item.unfold"><img src="../../assets/img/fold.png" alt="" width="35px" height="35px"></span>
  				  <span>外卖订单{{index}}</span>
						<el-button style="float: right;" type="text" @click="confirmOut(index)">确认订单</el-button>
  				</div>
					<div class="content" v-if="item.unfold">
						<div class="text ite">
							商家名称:{{item.businessName}}
  					</div>
						<div class="text ite">
							菜品名称:{{item.dishList.dishName}}
  					</div>
						<div class="text ite">
							菜品份数:{{item.dishList.count}}
  					</div>
						<div class="text ite">
							该菜品总价:{{item.dishList.totalPrice}}
  					</div>
						<div class="text ite">
							打包价格:{{item.packagePrice}}
  					</div>
						<div class="text ite">
							配送费:{{item.postPrice}}
  					</div>
						<div class="text ite">
							优惠价格:{{item.discountPrice}}
  					</div>
						<div class="text ite">
							用户付款:{{item.payPrice}}
  					</div>
						<div class="text ite">
							支付时间:{{item.payDateTime}}
  					</div>
					</div>
				</el-card>
		  </div>
		  <!-- 堂食 -->
		  <div class="eatin">
		  	<el-card class="box-card" v-for="(item,index) in eatinArr" :key="index">
  				<div slot="header" class="clearfix">
						<span v-if="!item.unfold" @click="item.unfold = !item.unfold"><img src="../../assets/img/unfold.png" alt="" width="35px" height="35px"></span>
						<span v-if="item.unfold" @click="item.unfold = !item.unfold"><img src="../../assets/img/fold.png" alt="" width="35px" height="35px"></span>
  				  <span>堂食订单{{index}}</span>
						<el-button style="float: right;" type="text" @click="confirmOrder(index)">确认订单</el-button>
  				</div>
					<div class="content" v-if="item.unfold">
						<div class="text ite">
							商家名称:{{item.businessName}}
  					</div>
						<div class="text ite">
							菜品名称:{{item.dishList.dishName}}
  					</div>
						<div class="text ite">
							菜品份数:{{item.dishList.count}}
  					</div>
						<div class="text ite">
							该菜品总价:{{item.dishList.totalPrice}}
  					</div>
						<div class="text ite">
							打包价格:{{item.packagePrice}}
  					</div>
						<div class="text ite">
							配送费:{{item.postPrice}}
  					</div>
						<div class="text ite">
							优惠价格:{{item.discountPrice}}
  					</div>
						<div class="text ite">
							用户付款:{{item.payPrice}}
  					</div>
						<div class="text ite">
							支付时间:{{item.payDateTime}}
  					</div>
					</div>
  				
				</el-card>
		  </div>
		</div> 
		
    
  </div>
</template>

<script>
  export default {
		data() {
			return {
				show:false,
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
				sessionStorage.setItem('waerdfrteat',JSON.stringify(this.$store.state.eatOrder))
				sessionStorage.setItem('ksiwpsusout',JSON.stringify(this.$store.state.outOrder))
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
			}

		},
		
  }
</script>

<style scoped>
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
		flex-direction: column;
		overflow-y:scroll;
		overflow-x: hidden;
		width: 30%;
		height:100%;
		box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}
	.takeout {
		background: url(../../assets/img/out.png) no-repeat;
		background-size: 100px 80px;
		background-position: center;
		left: 100px;
	}
	.eatin {
		background: url(../../assets/img/eat.png) no-repeat;
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

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
		position: relative;
    width: 400px;
		top:5%;
		left: 10%;
		margin-bottom: 10px;
		
  }
	.span {
		margin-left: 20px;
	}
</style>





