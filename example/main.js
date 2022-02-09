// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Example from './Example';

// 引入插件方式：本地+线上
// import ZkTable from '../src';  //用本地的源码
import ZkTable from 'vue-table-with-tree-grid'; //用线上的npm

Vue.config.productionTip = false;

// Vue.component(ZkTable.name, ZkTable);

Vue.use(ZkTable);

/* eslint-disable no-new */
new Vue({
  el: '#example',
  template: '<Example/>',
  components: { Example },
});
