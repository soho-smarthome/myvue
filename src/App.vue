<template>
  <div id="app">
    <!--
    <img src="./assets/logo.png">-->
    <a-button type="primary" @click="buttonClick">按钮</a-button>
    <nav>
      <div class="container">
        <ul class="nav__left">
          <li>
            <router-link to="/home">Home</router-link>
          </li>
          <li>
            <router-link to="/admin">Admin</router-link>
          </li>
          <li>
            <router-link to="/cart">Cart</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view/>
    <div ref="myChart" style="width:100%;height:520px" id="myChart"></div>
    <div class="content"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    buttonClick() {
      console.log(`测试log`)
      this.$message.error('测试测试！！！！')
    },
    setMyEchart() {
        const myChart = this.$refs.myChart;  //通过ref获取到DOM节点
        if (myChart) {
            const thisChart = this.$echarts.init(myChart);  //利用原型调取Echarts的初始化方法
            const option = {
              tooltip: {
                confine: true,
                enterable: true //鼠标是否可以移动到tooltip区域内
              },
              legend: {
                // top : '96%',                    // 图例距离顶部边距
                textStyle: {
                  coFlor: "#202124",
                  fontWeight: "bold",
                  fontSize: "14"
                },
                data: ["学生个人", "班级平均"]
              },
              calculable: true,
              color: ["#00CA90", "#4285F4"],
              radar: {
                name: {
                  textStyle: {
                    color: "#fff",
                    backgroundColor: "#999",
                    fontSize: "10",
                    borderRadius: 3,
                    padding: [3, 5]
                  }
                },
                indicator: [
                  { name: "出勤率", max: 1 },
                  { name: "作业提交率", max: 1 },
                  { name: "话题参与率", max: 1 },
                  { name: "表现得星数", max: 1 },
                  { name: "互动参与率", max: 1 }
                ],
                radius: 80
              },
              series: [
                {
                  type: "radar",
                  data: [
                    {
                      value: [0.85,0.94,0.24,0.56,0.23],
                      name: "学生个人"
                    },
                    {
                      value: [0.90,0.85,0.37,0.85,0.52],
                      name: "班级平均"
                    }
                  ]
                }
              ]
            };  //{}内写需要图表的各种配置，可以在官方案例中修改完毕后复制过来
            thisChart.setOption(option);  //将编写好的配置项挂载到Echarts上
            window.addEventListener("resize", function() {
                thisChart.resize();  //页面大小变化后Echarts也更改大小
            });
        }
    }
  },
  mounted() {
    document.querySelector("#myChart").style.width = document.querySelector(".content").clientWidth;
    this.setMyEchart()  //页面挂载完成后执行
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
