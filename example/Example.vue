<template lang="html">
  <div id="example">
    <div class="pageContent">
      <div class="tableHeaderBar clear">
        <div class="apiNameWrapper" ref="apiNameRef">
          <div class="apiTreeBox">name</div>
          <div class="apiName">serviceName</div>
        </div>
        <div
          class="headerMillWraper clear"
          :style="{ width: `${millClientWidth}px` }"
        >
          <li
            class="millList"
            v-for="(item, index) in milliCounts"
            :key="'mill_list_' + index"
          >
            <span>{{ index ? (index * threshold).toFixed(1) : 0 }} s</span>
          </li>
        </div>
      </div>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="data"
        :columns="columns"
        :stripe="config.stripe"
        :border="config.border"
        :show-header="config.showHeader"
        :show-summary="config.showSummary"
        :show-row-hover="config.showRowHover"
        :show-index="config.showIndex"
        :tree-type="config.treeType"
        :is-fold="config.isFold"
        :expand-type="config.expandType"
        :selection-type="config.selectionType"
      >
        <template slot="millisecond" slot-scope="scope">
          <!-- 占位 做竖线 -->
          <div class="templListBox">
            <li
              :class="['splitLine']"
              v-for="(item, index) in milliCounts"
              :key="'split_line_' + index"
            >
              <span>&nbsp;</span>
            </li>
            <!-- 动态设置毫秒宽度 -->
            <span
              class="bgWidthColor"
              :style="{
                width: `${getDurationBound(scope)}px`,
                left: `${formatStartTime(scope)}px`,
                backgroundColor: `${fillColor[parseInt(Math.random() * 4)]}`,
              }"
            >
              <!-- getDurationBound(scope) >= 200  ->  毫秒数在背景色上面  left:10px -->
              <!-- getDurationBound(scope) < 200  ->  毫秒数在背景色后面  计算left 距离左边距 +5px -->
              <span
                :class="[getDurationBound(scope) >= 200 ? 'showMillisecond' : 'showMilliAfter']"
                :style="{
                  left: `${getDurationBound(scope) >= 200 ? 10 : getDurationBound(scope, 5)}px`,
                }"
              >
                {{ getMillSpecificData(scope) }}ms
              </span>
            </span>
          </div>
        </template>
      </zk-table>
    </div>
  </div>
</template>

<script>
import { dataList, columns, zkTableConfig } from "./config.js";

export default {
  name: "table-tree-grid",
  components: {},
  data() {
    return {
      milliCounts: 10, //需要循环的总毫秒次数
      threshold: 0.2, // 毫秒数的循环阈值 (每次的步长)
      config: zkTableConfig,
      fillColor: ["#a180c5", "#d28261", "#FF6A6A", "#6b9acf"],
      columns: columns,
      data: dataList,
      millClientWidth: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.onWindowBound();
    });
  },
  methods: {
    onWindowBound() {
      let clientWidth = document.body.clientWidth;
      this.millClientWidth = clientWidth - this.$refs.apiNameRef.clientWidth; //毫秒容器的宽度
      let mils = dataList[0].duration / this.millClientWidth;
      console.log(232323, this.millClientWidth, dataList[0].duration);
    },
    // 格式化开始时间
    formatStartTime(scope) {
      let startTime = scope.row.startTime;
      return startTime ? startTime / (this.threshold * 10) : 0; // 开始时间设置为阈值对应1/2的位置
    },
    /**
     * 计算步长维持的时间
     * @param duration 步长
     * @param startTime 开始时间
     * @extends 拓展的宽度
     * @returns Number 维持的总时长
     */
    getDurationBound(scope, extend = 0) {
      let duration = scope.row.duration;
      let startTime = scope.row.startTime;
      let bound = (duration - startTime) / (this.threshold * 10); // 宽度设置为阈值对应1/2的宽度
      if (typeof bound === "number") {
        let newBound = this.handleDecimalPoint(bound);
        return newBound + extend;
      } else {
        console.error("非数值类型！-> duration:", duration, "startTime:", startTime, "bound:", bound);
        return 0;
      }
    },
    // 展示毫秒数具体数值
    getMillSpecificData(scope) {
      let bound = scope.row.duration - scope.row.startTime;
      return this.handleDecimalPoint(bound);
    },
    // 处理整数与小数的情况
    handleDecimalPoint(bound) {
      var x = String(bound).indexOf(".") + 1; // 小数点的位置
      var y = String(bound).length - x; // 小数的位数
      if (x == 0) return bound; // 整数
      if (y >= 3) return bound.toFixed(2); // 小数超过3个做保留2位小数处理
      return bound; // 小与3位的小数正常显示
    },
  },
};
</script>

<style scoped lang="less">
.pageContent {
  width: 100%;
  height: 100%;
  //   background-color: #f8f9fb;
  min-height: 300px;
}
.tableHeaderBar {
  display: flex;
  font-size: 14px;
  .apiNameWrapper {
    width: 500px;
    height: 50px;
    line-height: 50px;
    text-align: left;
    display: flex;
    .apiTreeBox {
      width: 300px;
      padding-left: 12px;
    }
    .apiName {
      width: 200px;
      padding-left: 12px;
    }
  }
  .headerMillWraper {
    display: -webkit-inline-box;
    height: 50px;
    line-height: 50px;
    // overflow: hidden;
  }
}
.templListBox {
  display: inline-flex;
  align-items: center;
  position: relative;
  .splitLine {
    width: 99px;
    height: 100%;
    position: relative;
    z-index: 666;
    border-left: 1px solid #f8f9fb;
  }
}
.millList {
  width: 100px;
  position: relative;
  //   border-bottom: solid 1px #e5e7f1;
  z-index: 666;
}
.bgWidthColor {
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  background-color: #a180c5;
}
.showMillisecond,
.showMilliAfter {
  position: absolute;
  height: 18px;
  text-align: center;
  line-height: 18px;
  padding: 0 5px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
}
.showMillisecond {
  min-width: 30px;
}
.showMilliAfter {
  position: absolute;
  width: max-content;
  z-index: 11111;
}
.switch-list {
  margin: 20px 0;
  list-style: none;
  overflow: hidden;
}

.switch-item {
  margin: 20px;
  float: left;
}
li {
  list-style: none;
}
.ellipsis {
  overflow: hidden;
  margin-top: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.clear {
  *zoom: 1;
}
.clear:after {
  content: ".";
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
  font-size: 0;
}
</style>
