<template lang="html">
  <div id="example">
    <div class="pageContent">
      <div class="timeBar clear">
        <div class="guiTitle">
          <div class="apiTreeBox">name</div>
          <div class="apiName">serviceName</div>
        </div>
        <div class="guiTable clear">
          <li
            class="guiList"
            v-for="(item, index) in counts"
            :key="'guit_' + index"
          >
            <span>{{ index / 10 }} s</span>
          </li>
        </div>
      </div>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="data"
        :columns="columns"
        :stripe="props.stripe"
        :border="props.border"
        :show-header="props.showHeader"
        :show-summary="props.showSummary"
        :show-row-hover="props.showRowHover"
        :show-index="props.showIndex"
        :tree-type="props.treeType"
        :is-fold="props.isFold"
        :expand-type="props.expandType"
        :selection-type="props.selectionType"
      >
        <template slot="millisecond" slot-scope="scope">
          <!-- 占位 做竖线 -->
          <div class="templListBox">
            <li
              :class="['templaLi']"
              v-for="(item, index) in counts"
              :key="'temp_' + index"
            >
              <span>&nbsp;</span>
            </li>
            <!-- 动态设置毫秒宽度 -->
            <span
              class="bgWidthColor"
              :style="{
                width: `${scope.row.duration ? scope.row.duration - scope.row.startTime : 0}px`,
                left: `${scope.row.startTime ? scope.row.startTime : 0}px`,
                backgroundColor: `${fillColor[parseInt(Math.random() * 4)]}`,
              }"
            >
              <!-- 毫秒数在背景色上面 -->
              <span
                v-if="scope.row.duration && scope.row.duration - scope.row.startTime > 200"
                class="showMillisecond"
              >
                {{ scope.row.duration }} ms
              </span>
              <!-- 毫秒数在背景色后面 -->
              <span
                v-if="scope.row.duration && scope.row.duration - scope.row.startTime <= 200"
                class="showMilliAfter"
                :style="{
                  left: `${scope.row.duration ? scope.row.duration - scope.row.startTime + 5 : 0}px`,
                }"
              >
                {{ scope.row.duration - scope.row.startTime }} ms
              </span>
            </span>
          </div>
        </template>
      </zk-table>
    </div>
  </div>
</template>

<script>
import { dataList } from "./config.js";

export default {
  name: "example",
  components: {
  },
  data() {
    return {
      counts: 10,
      props: {
        stripe: true, // 斑马色
        border: false,
        showHeader: false, // 是否展示头部header
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false,
      },
      fillColor: ["#a180c5", "#d28261", "#FF6A6A", "#6b9acf"],
      columns: [
        {
          label: "name",
          prop: "name",
          width: "300px",
        },
        {
          label: "serviceName",
          prop: "serviceName",
          width: "200px",
        },
        {
          label: "millisecond",
          prop: "millisecond",
          type: "template",
          template: "millisecond",
        },
      ],
      data: dataList,
    };
  },
  computed: {
    propList() {
      return Object.keys(this.props).map((item) => ({
        name: item,
      }));
    },
  },
  methods: {},
};
</script>

<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
.pageContent {
  width: 100%;
  height: 100%;
//   background-color: #f8f9fb;
  min-height: 300px;
}
.timeBar {
  display: flex;
  font-size: 14px;
  .guiTitle {
    width: 500px;
    height: 60px;
    line-height: 60px;
    text-align: left;
    float: left;
    display: flex;
    .apiTreeBox {
      width: 300px;
    }
    .apiName {
      width: 200px;
    }
  }
  .guiTable {
    display: inline-flex;
    height: 50px;
    line-height: 50px;
    padding: 0px 12px;
  }
}
.templListBox {
  display: inline-flex;
  align-items: center;
  position: relative;
  .templaLi {
    width: 99px;
    height: 100%;
    position: relative;
    z-index: 666;
    border-left: 1px solid #f8f9fb;
  }
}
.bgWidthColor {
  position: absolute;
  display: flex;
  align-items: center;
  height: 60%;
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
  left: 10px;
}
.showMilliAfter {
  position: absolute;
  width: max-content;
  z-index: 11111;
}
.guiList {
  width: 100px;
  position: relative;
  //   border-bottom: solid 1px #e5e7f1;
  z-index: 666;
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
