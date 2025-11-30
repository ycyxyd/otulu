'use strict';
const https = require('https');
const http = require('http');

/*
  OuTuoLu Serverless Proxy
  Acts as a bridge between WeChat Mini Program (China) and VPS (Europe).
  
  Environment Variables:
  - VPS_API_URL: The base URL of the European VPS (e.g., http://your-vps-ip:8080)
  - API_SECRET: Shared secret for authentication
*/

const VPS_API_URL = process.env.VPS_API_URL || 'http://placeholder-vps-url:8080';

exports.main_handler = async (event, context) => {
    console.log("Received event:", JSON.stringify(event));

    // 1. Parse incoming request from WeChat
    // Note: API Gateway usually passes body as a string
    const body = event.body ? JSON.parse(event.body) : {};
    const path = event.path || '/';
    const method = event.httpMethod || 'GET';

    // 2. Construct request to VPS
    const vpsPath = `/api/v1${path}`; // Map /proxy/foo -> /api/v1/proxy/foo

    return new Promise((resolve, reject) => {
        const url = new URL(vpsPath, VPS_API_URL);
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Proxy-Source': 'WeChat-Serverless',
                // 'X-Api-Secret': process.env.API_SECRET 
            },
            timeout: 3000 // 3s timeout for fast fail
        };

        const req = (url.protocol === 'https:' ? https : http).request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    isBase64Encoded: false,
                    statusCode: res.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                    body: data
                });
            });
        });

        req.on('error', (e) => {
            console.error("VPS Request Error:", e);
            resolve({
                isBase64Encoded: false,
                statusCode: 502,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: "Upstream VPS Unavailable", details: e.message })
            });
        });

        if (method === 'POST' || method === 'PUT') {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};
