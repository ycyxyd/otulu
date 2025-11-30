// pages/index/index.js
const app = getApp()

Page({
    data: {
        newsList: [],
        loading: true
    },

    onLoad() {
        this.fetchNews();
    },

    fetchNews() {
        // Simulate fetching from Serverless Proxy
        // In production: wx.request({ url: `${app.globalData.apiBaseUrl}/news`, ... })

        // Mock Data for MVP Demo
        setTimeout(() => {
            this.setData({
                loading: false,
                newsList: [
                    {
                        id: '1',
                        title: '巴黎最新入境政策发布',
                        summary: '自今日起，申根区...',
                        type: 'NEWS'
                    },
                    {
                        id: '2',
                        title: '普罗旺斯薰衣草路线',
                        summary: '最佳观赏期是6月中旬到7月中旬...',
                        type: 'ROUTE'
                    }
                ]
            });
        }, 1000);
    },

    onTapNews(e) {
        const id = e.currentTarget.dataset.id;
        wx.showToast({
            title: 'Opening Article ' + id,
            icon: 'none'
        });
        // Navigate to detail page or webview
    }
})
