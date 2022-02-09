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
export const columns = [
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
];
export const dataList = [
    {
        name: "/api/v2/tickets",
        serviceName: "api",
        likes: ["football", "basketball"],
        score: 10,
        startTime: 0,
        duration: 1900,
        children: [
            {
                name: "tickets",
                serviceName: "api",
                likes: ["football", "basketball"],
                score: 10,
                startTime: 100,
                duration: 200,
                children: [
                    {
                        name: "query",
                        serviceName: "feapi",
                        likes: ["football", "basketball"],
                        score: 20,
                        startTime: 100,
                        duration: 300,
                    },
                    {
                        name: "checkFraud",
                        serviceName: "api",
                        likes: ["football", "basketball"],
                        score: 10,
                        startTime: 100,
                        duration: 400,
                    },
                ],
            },
            {
                name: "checkTateLimits",
                serviceName: "api",
                likes: ["football", "basketball"],
                score: 20,
                startTime: 0,
                duration: 8.200,
            },
            {
                name: "checkTateLimits",
                serviceName: "api",
                likes: ["football", "basketball"],
                score: 20,
                startTime: 8.200,
                duration: 12.40,
            },
            {
                name: "checkTateLimits",
                serviceName: "api",
                likes: ["football", "basketball"],
                score: 20,
                startTime: 12.40,
                duration: 309.6,
                children: [
                    {
                        name: "query",
                        serviceName: "feapi",
                        likes: ["football", "basketball"],
                        score: 20,
                        startTime: 300,
                        duration: 310,
                    },
                    {
                        name: "checkFraud",
                        serviceName: "api",
                        likes: ["football", "basketball"],
                        score: 10,
                        startTime: 310,
                        duration: 330,
                    },
                ],
            },
        ]
    }

];