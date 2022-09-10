<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu"
      >
        <el-menu-item index="home" @click="$router.push({ name: 'home' })">
          <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="demo">
          <template slot="title">
            <icon-svg
              name="shoucang"
              class="site-sidebar__menu-icon"
            ></icon-svg>
            <span>demo</span>
          </template>
          <el-menu-item
            index="demo-echarts"
            @click="$router.push({ name: 'demo-echarts' })"
          >
            <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">echarts</span>
          </el-menu-item>
          <el-menu-item
            index="demo-ueditor"
            @click="$router.push({ name: 'demo-ueditor' })"
          >
            <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">ueditor</span>
          </el-menu-item>
        </el-submenu>
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes"
        >
        </sub-menu>
      </el-menu>
    </div>
    <audio ref="audioTip" style="display: none">
      <source :src="audio.src" />
    </audio>
  </aside>
</template>

<script>
import SubMenu from "./main-sidebar-sub-menu";
import { isURL } from "@/utils/validate";
import { getUUID } from "@/utils"

export default {
  data() {
    return {
      dynamicMenuRoutes: [],
      audio: {
        //消息通知
        src: require("../../static/mp3/提示音.mp3"),
      },
      lockReconnect: false, //是否真正建立连接
      timeout: 58 * 1000, //58秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
    };
  },
  components: {
    SubMenu,
  },
  computed: {
    sidebarLayoutSkin: {
      get() {
        return this.$store.state.common.sidebarLayoutSkin;
      },
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
    },
    menuList: {
      get() {
        return this.$store.state.common.menuList;
      },
      set(val) {
        this.$store.commit("common/updateMenuList", val);
      },
    },
    menuActiveName: {
      get() {
        return this.$store.state.common.menuActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMenuActiveName", val);
      },
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      },
    },
    mainTabsActiveName: {
      get() {
        return this.$store.state.common.mainTabsActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMainTabsActiveName", val);
      },
    },
  },
  watch: {
    $route: "routeHandle",
  },
  created() {
    this.initWebSocket();
    this.menuList = JSON.parse(sessionStorage.getItem("menuList") || "[]");
    this.dynamicMenuRoutes = JSON.parse(
      sessionStorage.getItem("dynamicMenuRoutes") || "[]"
    );
    this.routeHandle(this.$route);
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    // 路由操作
    routeHandle(route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        var tab = this.mainTabs.filter((item) => item.name === route.name)[0];
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(
              (item) => item.name === route.name
            )[0];
            if (!route) {
              return console.error("未能找到可用标签页!");
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? "iframe" : "module",
            iframeUrl: route.meta.iframeUrl || "",
            params: route.params,
            query: route.query,
          };
          this.mainTabs = this.mainTabs.concat(tab);
        }
        this.menuActiveName = tab.menuId + "";
        this.mainTabsActiveName = tab.name;
      }
    },
    adminMsg(messige) {
      this.$notify({
        title: "来自管理员的信息",
        message: messige,
        position: "top-left",
        type: "success",
        duration: 0,
      });
    },
    businessMsg(messige) {
      this.$notify({
        title: "新的消息",
        message: messige,
        type: "success",
      });
    },
    currentTime() {
      setInterval(this.formatDate, 500);
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://localhost:9000/api/websocket/100";
      this.websock = new WebSocket(wsuri);
      // 客户端接收服务端数据时触发
      this.websock.onmessage = this.websocketonmessage;
      // 连接建立时触发
      this.websock.onopen = this.websocketonopen;
      // 通信发生错误时触发
      this.websock.onerror = this.websocketonerror;
      // 连接关闭时触发
      this.websock.onclose = this.websocketclose;
    },
    // 连接建立时触发
    websocketonopen() {
      //开启心跳
      this.start();
    },
    // 通信发生错误时触发
    websocketonerror() {
      console.log("websocket出现错误");
      this.reconnect();
    },

    // 客户端接收服务端数据时触发
    websocketonmessage(e) {
      console.log(e)
      console.log(e.data)
      // const orderData = {
      //   kind: '外卖',
      //   businessName: 'tyt',
      //   dishList:[{
      //     dishName: '炸鸡',
      //     count: 1,
      //     totalPrice: 24,
      //   },
      //   {
      //     dishName: '薯条',
      //     count: 3,
      //     totalPrice: 12,
      //   }],
      //   postPrice: 2,
      //   packagePrice: 1,
      //   discountPrice: 5.2,
      //   payPrice: 30,
      //   payDateTime: '2022-10-30 10:20:03'
      // }
    
      const orderData = JSON.parse(e.data)
      orderData['uuid'] = getUUID()
      // 接收订单数据(改变外卖和堂食数组)
      this.$store.commit('getOrderData',orderData)
      if(this.$store.state.orderdata.kind === "堂食") {
        this.$store.commit('getEatArr',orderData)
        console.log('堂食',this.$store.state.eatOrder)
        // console.log(sessionStorage.getItem('waerdfrteat'))
      }
      if(this.$store.state.orderdata.kind === "外卖"){
        this.$store.commit('getOutArr',orderData)
        console.log('外卖',this.$store.state.outOrder)
        // console.log(sessionStorage.getItem('ksiwpsusout'))
      }
      if (e.data.indexOf("订单") != -1) {
        this.businessMsg(e.data);
        const promise = this.$refs.audioTip.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              this.$refs.audioTip.play();
            })
            .catch(() => {
              console.log("--播放失败--");
              //弹框提示，获取点击事件，重新播放
            });
        }
      } else {
        this.adminMsg(e.data);
      }

      //收到服务器信息，心跳重置
      this.reset();
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    // 连接关闭时触发
    websocketclose(e) {
      //关闭
      // console.log("断开连接", e);
      //重连
      this.reconnect(0);
    },
    reconnect(time = 5000) {
      //重新连接
      var that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        //新连接
        that.initWebSocket();
        that.lockReconnect = false;
      }, time);
    },
    reset() {
      //重置心跳
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.start();
    },
    start() {
      //开启心跳
      // console.log("开启心跳");
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      // console.log(self)
      self.timeoutObj = setTimeout(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.readyState == 1) {
          //如果连接正常
          self.ws.send("heartCheck"); //这里可以自己跟后端约定
        } else {
          //否则重连
          self.reconnect();
        }
        self.serverTimeoutObj = setTimeout(function () {
          //超时关闭
          self.ws.close();
        }, self.timeout);
      }, self.timeout);
    },
  },
  mounted() {
    this.currentTime();
  },
  // 销毁定时器
  beforeDestroy() {
    if (this.formatDate) {
      clearInterval(this.formatDate); // 在Vue实例销毁前，清除时间定时器
    }
  },
};
</script>
