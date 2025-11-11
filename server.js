/**
 * QQ邮箱自动发送邮件服务 - Express服务器主文件
 * 提供HTTP API接口供Python脚本或其他程序调用
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 导入路由
const emailRoutes = require('./routes/emailRoutes');

// 创建Express应用
const app = express();

// 中间件配置
// 1. CORS支持 - 允许跨域请求（方便Python脚本或其他服务调用）
app.use(cors());

// 2. JSON解析中间件 - 解析请求体中的JSON数据
app.use(express.json());

// 3. URL编码解析中间件 - 解析URL编码的请求体
app.use(express.urlencoded({ extended: true }));

// 路由注册
// 将邮件相关路由挂载到 /api 路径下
app.use('/api', emailRoutes);

// 根路径健康检查
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'QQ邮箱自动发送邮件服务',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            sendEmail: 'POST /api/send-email'
        }
    });
});

// 404错误处理 - 处理未匹配的路由
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在',
        path: req.path
    });
});

// 全局错误处理中间件 - 捕获所有未处理的错误
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : '内部服务器错误'
    });
});

// 获取服务器端口（从环境变量读取，默认12889）
const PORT = process.env.SERVER_PORT || 12889;

// 启动服务器
app.listen(PORT, () => {
    console.log('========================================');
    console.log('QQ邮箱自动发送邮件服务已启动');
    console.log(`服务器运行在: http://localhost:${PORT}`);
    console.log('========================================');
    console.log('可用接口:');
    console.log(`  - GET  http://localhost:${PORT}/api/health`);
    console.log(`  - POST http://localhost:${PORT}/api/send-email`);
    console.log('========================================');
    
    // 检查环境变量配置
    if (!process.env.QQ_EMAIL || !process.env.QQ_AUTH_CODE) {
        console.warn('⚠️  警告: 未检测到QQ邮箱配置，请确保.env文件已正确配置');
        console.warn('   需要配置: QQ_EMAIL 和 QQ_AUTH_CODE');
    } else {
        console.log('✓ 环境变量配置已加载');
    }
});

// 优雅关闭处理
process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，正在关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n收到SIGINT信号，正在关闭服务器...');
    process.exit(0);
});

