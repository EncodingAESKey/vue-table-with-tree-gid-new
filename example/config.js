export const dataList = [
    {
        name: "/api/v2/tickets",
        serviceName: "api",
        likes: ["football", "basketball"],
        score: 10,
        startTime: 0,
        duration: 1651.0,
        children: [
            {
                name: "query",
                serviceName: "feapi",
                likes: ["football", "basketball"],
                score: 20,
                startTime: 0,
                duration: 36.130,
                children: [
                    {
                        name: "query",
                        serviceName: "feapi",
                        likes: ["football", "basketball"],
                        score: 20,
                    },
                    {
                        name: "checkFraud",
                        serviceName: "api",
                        likes: ["football", "basketball"],
                        score: 10,
                        children: [
                            {
                                name: "query",
                                serviceName: "feapi",
                                likes: ["football", "basketball"],
                                score: 20,
                            },
                            {
                                name: "checkFraud",
                                serviceName: "api",
                                likes: ["football", "basketball"],
                                score: 10,
                                children: [
                                    {
                                        name: "query",
                                        serviceName: "feapi",
                                        likes: ["football", "basketball"],
                                        score: 20,
                                    },
                                    {
                                        name: "checkFraud",
                                        serviceName: "api",
                                        likes: ["football", "basketball"],
                                        score: 10,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "checkFraud",
                serviceName: "api",
                likes: ["football", "basketball"],
                score: 10,
                startTime: 36.130,
                duration: 36.82,
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
        children: [
            {
                name: "query",
                serviceName: "feapi",
                likes: ["football", "basketball"],
                score: 20,
                children: [
                    {
                        name: "query",
                        serviceName: "feapi",
                        likes: ["football", "basketball"],
                        score: 20,
                    },
                    {
                        name: "checkFraud",
                        serviceName: "api",
                        likes: ["football", "basketball"],
                        score: 10,
                    },
                ],
            },
            {
                name: "checkFraud",
                serviceName: "api",
                likes: ["football", "basketball"],
                score: 10,
                children: [
                    {
                        name: "query",
                        serviceName: "feapi",
                        likes: ["football", "basketball"],
                        score: 20,
                    },
                    {
                        name: "checkFraud",
                        serviceName: "api",
                        likes: ["football", "basketball"],
                        score: 10,
                    },
                ],
            },
        ],
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
            },
            {
                name: "checkFraud",
                serviceName: "api",
                likes: ["football", "basketball"],
                score: 10,
            },
        ],
    },
];