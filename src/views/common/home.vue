<template>
	<div>
		<button @click="change">点击</button>
	</div>
</template>

<script>
export default {
	methods:{
		data() {
			return {
				arr:[],
			}
		},
		change(){
			if(this.arr === undefined){
				this.arr = []
			}
			let dt = [{
          dishName: '炸鸡',
          count: 1,
          totalPrice: 24,
        },
        {
          dishName: '薯条',
          count: 3,
          totalPrice: 12,
        }]
			this.arr.push(dt)
			console.log(this.arr)
			// console.log(this.arr[0].dishName)
		}
	}
}
</script>

<style>

</style>