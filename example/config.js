export const zkTableConfig = {
  stripe: true, // 斑马色
  border: false,
  showHeader: false, // 是否展示头部header
  showSummary: false,
  showRowHover: true,
  showIndex: false,
  treeType: true,
  isFold: false,
  expandType: false,
  selectionType: false,
};
/**
 * name动态宽度需要修改的地方
 * name 固定宽度的话 width: '300px'
 * name 动态计算的话用 minWidth: '300px，同时将mounted里面的 这句话解开注释：this.nameWidth = document.getElementsByClassName('zk-table__body-row')[0].firstChild.clientWidth; 
 *      解开onWindowBound动态计算方法的注释
 */
export const columns = [
  {
    label: "operationName",
    prop: "operationName",
    width: "300px",
    // minWidth: "300px",
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
];
// 模拟数据格式
export const dataList = [
  {
    name: "/api/v2/tickets",
    serviceName: "api",
    startTime: 0,
    duration: 1900,
    children: [
      {
        name: "tickets",
        serviceName: "api",
        startTime: 100,
        duration: 200,
        children: [
          {
            name: "query",
            serviceName: "feapi",
            startTime: 100,
            duration: 300,
          },
          {
            name: "checkFraud",
            serviceName: "api",
            startTime: 100,
            duration: 400,
          },
        ],
      },
      {
        name: "checkTateLimits",
        serviceName: "api",
        startTime: 0,
        duration: 8.200,
      },
      {
        name: "checkTateLimits",
        serviceName: "api",
        startTime: 8.200,
        duration: 12.40,
      },
      {
        name: "checkTateLimits",
        serviceName: "api",
        startTime: 12.40,
        duration: 309.6,
        children: [
          {
            name: "query",
            serviceName: "feapi",
            startTime: 300,
            duration: 310,
          },
          {
            name: "checkFraud",
            serviceName: "api",
            startTime: 310,
            duration: 330,
          },
        ],
      },
    ]
  }

];

// 格式化时间点 "2019-04-30 12:32:03"
export const formatDate = (timeStamp) => {
  function add0(m) { return m < 10 ? '0' + m : m };
  var time = new Date(timeStamp);
  var yea = time.getFullYear();
  var mon = time.getMonth() + 1;
  var day = time.getDate();
  var hour = time.getHours();
  var min = time.getMinutes();
  var sec = time.getSeconds();
  return yea + '-' + add0(mon) + '-' + add0(day) + " " + hour + ':' + min + ':' + sec;
};