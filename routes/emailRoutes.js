/**
 * 邮件路由定义
 * 提供HTTP API接口供外部调用
 */

const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService');

/**
 * POST /api/send-email
 * 发送邮件接口
 * 
 * 请求体格式：
 * {
 *   "to": "recipient@example.com",      // 必填：收件人邮箱地址
 *   "subject": "邮件主题",                // 必填：邮件主题
 *   "text": "纯文本内容",                 // 可选：纯文本邮件内容
 *   "html": "<h1>HTML内容</h1>",        // 可选：HTML格式邮件内容
 *   "attachments": [                     // 可选：附件数组
 *     {
 *       "filename": "file.txt",
 *       "path": "/path/to/file.txt"
 *     }
 *   ]
 * }
 * 
 * 响应格式：
 * {
 *   "success": true/false,
 *   "message": "操作结果描述",
 *   "messageId": "邮件ID（成功时）",
 *   "error": "错误信息（失败时）"
 * }
 */
router.post('/send-email', async (req, res) => {
    try {
        // 从请求体中获取邮件参数
        const { to, subject, text, html, attachments } = req.body;

        // 验证必填参数
        if (!to) {
            return res.status(400).json({
                success: false,
                message: '缺少必填参数：to（收件人邮箱地址）'
            });
        }

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: '缺少必填参数：subject（邮件主题）'
            });
        }

        if (!text && !html) {
            return res.status(400).json({
                success: false,
                message: '缺少必填参数：text或html（邮件内容）'
            });
        }

        // 构建邮件选项对象
        const mailOptions = {
            to,
            subject,
            text,
            html,
            attachments
        };

        // 调用邮件发送服务
        const result = await sendEmail(mailOptions);

        // 根据发送结果返回相应的HTTP状态码
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        // 捕获未预期的错误
        console.error('邮件发送接口错误:', error);
        return res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error.message
        });
    }
});

/**
 * GET /api/health
 * 健康检查接口
 * 用于检查服务是否正常运行
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '邮件服务运行正常',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;

