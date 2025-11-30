// app.js
App({
    onLaunch() {
        // Login logic would go here
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // Check for serverless connectivity
        console.log("OuTuoLu Mini Program Launched");
    },
    globalData: {
        userInfo: null,
        // Replace with your actual deployed Serverless URL
        apiBaseUrl: "https://service-xxxx-12345678.gz.apigw.tencentcs.com/release"
    }
})
