<template lang="html">
  <div id="example">
    <div class="pageContent">
      <div class="tableHeaderBar clear">
        <div class="apiNameWrapper" ref="apiNameRef">
          <div class="apiTreeBox" :style="{
              width: `${nameWidth}px`,
            }">name</div>
          <div class="apiName">serviceName</div>
        </div>
        <div
          class="headerMillWraper clear"
          :style="{ width: `${millClientWidth}px` }"
        >
          <li
            class="millList"
            :style="{
              width: `${millItemWidth}px`,
            }"
            v-for="(item, index) in milliCounts"
            :key="'mill_list_' + index"
          >
          <!-- index + 1 !== milliCounts: 隐藏最后一项秒数，做根节点最长秒数显示  减24解释：-12px和对齐中间位置给了12px-->
            <span v-if="(milliCounts === 1)">0 s</span>
            <span v-if="(index + 1 !== milliCounts)">{{ index ? (index * threshold).toFixed(1) : 0 }} s</span>
            <span 
                v-if="(index + 1 === milliCounts)"
                :style="{
                  position: 'absolute',
                  right: `${(getLastMillPosition())}px`,
                  width: 'fit-content'
                }"
            >{{ dataList.length ? handleDecimalPoint(dataList[0].duration / 1000, true) : 0 }} s</span>
          </li>
        </div>
      </div>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="dataList"
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
        <template slot="operation" slot-scope="scope">
          <div>{{scope.row.operationName}} - s</div>
        </template>
        <template slot="millisecond" slot-scope="scope">
          <!-- 占位 做竖线 -->
          <div class="templListBox">
            <li
              :class="['splitLine']"
              :style="{
                width: `${millItemWidth - 1}px`, // -1是因为有1px的竖线border
              }"
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
                left: `${setStartTimeLeftSpace(scope)}px`,
                backgroundColor: `${scope.row.bgColor}`,
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
import { columns, zkTableConfig } from "./config.js";
import { dataListTrace } from "./trace.js";

export default {
  name: "table-tree-grid",
  components: {},
  data() {
    return {
      milliCounts: 0, //需要循环的总毫秒次数
      nameWidth: 300, // name列默认宽度
      threshold: 0.2, //毫秒数的循环阈值 (每次的步长)
      config: zkTableConfig, //table的配置文件
      columns: columns,
      millClientWidth: 0, //毫秒数总宽度
      millItemWidth:0, //每一块儿的宽度
      dataList: [], //默认给一个，为了动态计算宽度
      sourceTraceData: [], //源数据
      targetTraceData: [], //目标数据
      fillColor: ["#a180c5", "#d28261", "#FF6A6A", "#6b9acf"],
      allServiceNameList: [], //获取所有的 serviceName
      assembleColor: {}, //组装颜色值
      traceRootStartTime: 0, // 记录跟节点时间-做运算
    };
  },
  mounted() {
    this.handleServiceData(dataListTrace.data.spanDTO);
    this.$nextTick(() => {
      /************ start 动态计算name宽度 ***********/
      // let element = document.getElementsByClassName('zk-table__body-row')[0];
      // if (element) this.nameWidth = element[element.firstElementChild ? 'firstElementChild' : 'firstChild'].clientWidth || 0;  // 动态设置name列的宽度
      /************ end 动态计算name宽度 ***********/

      // 注意：请求成功之后拿到数据再走下面计算
      this.setThreshold();
      this.onWindowBound();
    });
  },
  methods: {
    // 解析接口数据
    handleServiceData(spanDTO) {
      if (!spanDTO) return;
      this.traceRootStartTime = spanDTO.startTime;
      let formatRes = this.formatDeptsData([spanDTO]);
      this.dataList = formatRes;
    },
    // 格式化tree数据及字段
    formatDeptsData(traceData) {
      return (traceData || []).map((element) => {
        const { ...others } = element;
        this.setServicesNameBgColor(element);
        return {
          ...others,
          startTime: ((element['startTime'] - this.traceRootStartTime) / 1000), // 转换成毫秒 跟节点既开始时间，微秒数最小
          duration: (element['duration'] / 1000),
          children: element.children && element.children.length ? this.formatDeptsData(element.children) : null,
          bgColor: this.assembleColor[element.serviceName]
        };
      });
    },
    // 根据 serviceName 动态设置背景色
    setServicesNameBgColor(element) {
      this.allServiceNameList.push(element.serviceName);
      this.allServiceNameList = Array.from(new Set(this.allServiceNameList));
      for (var item in this.allServiceNameList){
        this.assembleColor[this.allServiceNameList[item]] = this.fillColor[item];
      };
    },
    // 根据根节点duration设置步长阈值
    setThreshold() {
      if (!this.dataList.length) return; 
      this.threshold = Math.round(this.dataList[0].duration / 1000) / 10;  //1000ms-0.1的步长  2000ms-0.2的步长  3000ms-0.3的步长
      if (this.threshold <= 0) this.threshold = 0.1;
    },
    /**
     * 1.获取容器宽度
     * 2.根据根节点和步长做拆分
     * 3.计算毫秒数需要循环的个数-最大毫秒就知道了
     * 4.计算出每一块儿的宽度-做width和left计算
     */
    onWindowBound() {
      if (!this.dataList.length) return; 
      let clientWidth = document.body.clientWidth;
      // this.millClientWidth = clientWidth - this.$refs.apiNameRef.clientWidth; //毫秒容器的宽度（name列固定300用这个方法）
      this.millClientWidth = clientWidth - (this.nameWidth + 200); //毫秒容器的宽度（name列如果是动态计算的话用这个方法 ）
      let split = (this.dataList[0].duration / this.threshold); //根据步长this.threshold做拆分
      let splitCount = Math.floor(split / 1000) + 1; //  计算出需要分割几块，1000目的是对应上面的秒数; 拓展：+n 可以多出来一个预留宽度
      this.milliCounts = splitCount; // 需要循环的块数
      this.millItemWidth = this.millClientWidth / splitCount; // 计算每一块儿的宽度
      console.log("拆分数量:", splitCount, "每一块宽度:", this.millItemWidth, this.millClientWidth);
    },
    // 格式化开始时间
    setStartTimeLeftSpace(scope) {
      if (!this.millItemWidth) return;
      let startTime = scope.row.startTime;
      return startTime ? ((startTime / this.threshold) / 1000) * this.millItemWidth : 0; // 开始时间设置为阈值对应1/2的位置
    },
    // 计算最后一个秒数的位置
    getLastMillPosition() {
      if (!this.millItemWidth || !this.dataList.length) return;
      let spaceMiddle = 24; //微调对齐细节
      let lastLeft = this.millClientWidth - (((this.dataList[0].duration / this.threshold) / 1000) * this.millItemWidth);
      // if (this.milliCounts === 1) spaceMiddle = 36;  // 0.0几 秒的情况偏移36
      // 小于20说明最后一个秒数顶到头了，向左偏移固定px即可(处理样式问题)
      if (lastLeft.toFixed(2) == this.millItemWidth) {
        let reduce = this.millItemWidth - spaceMiddle;
        return reduce < 20 ? -12 : reduce;
      }
      let reduceLast = Number(lastLeft.toFixed(2)) - spaceMiddle;
      return reduceLast < 20 ? -12 : reduceLast;
    },
    /**
     * 计算步长维持的时间
     * @param duration 步长
     * @extends 拓展的宽度
     * @returns Number 维持的总时长
     */
    /**
     * 注解： let bound = (((duration) / this.threshold) / 1000) * this.millItemWidth;
     * (duration) - 为时间间距
     * (duration) / this.threshold  - 为每一块儿对应的毫秒数
     * ((duration) / this.threshold) / 1000)  - 为每一块儿对应的秒数
     * (((duration) / this.threshold) / 1000) * this.millItemWidth  - 乘以每一块儿的宽度获取到当前毫秒数占用的总宽度 bound
     */
    getDurationBound(scope, extend = 0) {
      if (!this.millItemWidth) return;
      let bound = Math.abs(((scope.row.duration) / this.threshold) / 1000) * this.millItemWidth;
      if (typeof bound === "number") {
        let newBound = this.handleDecimalPoint(bound);
        return newBound + extend;
      } else {
        console.error("非数值类型！->bound:", bound);
        return 0;
      }
    },
    // 展示毫秒数具体数值
    getMillSpecificData(scope) {
      // let bound = Math.abs(scope.row.startTime - scope.row.duration);
      let bound = scope.row.duration;
      return this.handleDecimalPoint(bound);
    },
    /**
     * 处理整数与小数的情况
     * retain: 根节点最长秒数显示做3-5位特殊限制
     */
    handleDecimalPoint(bound, retain = false) {
      var x = String(bound).indexOf(".") + 1; // 小数点的位置
      var y = String(bound).length - x; // 小数的位数
      if (x == 0) return bound; // 整数
      if (y >= 3) return retain ? bound.toFixed(y > 5 ? 5 : y) : bound.toFixed(2); // 小数超过3个做保留2位小数处理
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
    // min-width: 500px;
    height: 50px;
    line-height: 50px;
    text-align: left;
    display: flex;
    .apiTreeBox {
      width: 300px;
      padding-left: 12px;
    }
    .apiName {
      width: 188px;
      // padding-left: 12px;
      // margin-left: -12px;
    }
  }
  .headerMillWraper {
    display: -webkit-inline-box;
    height: 50px;
    line-height: 50px;
    position: relative;
    left: -12px;
    // overflow: hidden;
  }
}
.templListBox {
  display: inline-flex;
  align-items: center;
  position: relative;
  left: -12px;
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
  z-index: 1000;
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
