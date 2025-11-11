/**
 * QQ邮箱邮件发送服务
 * 使用nodemailer封装QQ邮箱SMTP功能
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * 创建QQ邮箱SMTP传输器
 * 根据QQ邮箱官方配置：smtp.qq.com，使用SSL，端口465或587
 * @returns {Object} nodemailer传输器对象
 */
function createTransporter() {
    // 验证必要的环境变量
    if (!process.env.QQ_EMAIL || !process.env.QQ_AUTH_CODE) {
        throw new Error('QQ邮箱配置不完整，请检查.env文件中的QQ_EMAIL和QQ_AUTH_CODE');
    }

    // 创建SMTP传输器
    // 使用端口465（SSL）作为默认配置，这是QQ邮箱推荐的端口
    const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',           // QQ邮箱SMTP服务器地址
        port: 465,                      // SSL端口
        secure: true,                   // 使用SSL加密连接
        auth: {
            user: process.env.QQ_EMAIL,        // QQ邮箱完整地址
            pass: process.env.QQ_AUTH_CODE     // QQ邮箱授权码（不是QQ密码）
        }
    });

    return transporter;
}

/**
 * 发送邮件
 * @param {Object} mailOptions - 邮件选项
 * @param {string} mailOptions.to - 收件人邮箱地址
 * @param {string} mailOptions.subject - 邮件主题
 * @param {string} [mailOptions.text] - 纯文本邮件内容
 * @param {string} [mailOptions.html] - HTML格式邮件内容
 * @param {Array} [mailOptions.attachments] - 附件数组（可选）
 * @returns {Promise<Object>} 发送结果
 */
async function sendEmail(mailOptions) {
    try {
        // 验证必要参数
        if (!mailOptions.to) {
            throw new Error('收件人邮箱地址(to)是必需的');
        }
        if (!mailOptions.subject) {
            throw new Error('邮件主题(subject)是必需的');
        }
        if (!mailOptions.text && !mailOptions.html) {
            throw new Error('邮件内容(text或html)至少需要提供一个');
        }

        // 创建传输器
        const transporter = createTransporter();

        // 构建完整的邮件选项
        const fullMailOptions = {
            from: process.env.QQ_EMAIL,  // 发送方邮箱（使用配置的QQ邮箱）
            to: mailOptions.to,          // 收件人邮箱
            subject: mailOptions.subject, // 邮件主题
            text: mailOptions.text,      // 纯文本内容（可选）
            html: mailOptions.html,      // HTML内容（可选）
            attachments: mailOptions.attachments || [] // 附件（可选）
        };

        // 发送邮件
        const info = await transporter.sendMail(fullMailOptions);

        // 返回成功结果
        return {
            success: true,
            message: '邮件发送成功',
            messageId: info.messageId
        };

    } catch (error) {
        // 错误处理和日志记录
        console.error('邮件发送失败:', error.message);
        
        return {
            success: false,
            message: '邮件发送失败',
            error: error.message
        };
    }
}

/**
 * 验证SMTP连接
 * 用于测试QQ邮箱配置是否正确
 * @returns {Promise<boolean>} 连接是否成功
 */
async function verifyConnection() {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        return true;
    } catch (error) {
        console.error('SMTP连接验证失败:', error.message);
        return false;
    }
}

module.exports = {
    sendEmail,
    verifyConnection
};

