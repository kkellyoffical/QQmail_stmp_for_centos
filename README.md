# QQmail_stmp_for_centos
qq邮箱的stmp自动发送邮件服务项目（可使用pm2部署）
# QQ邮箱自动发送邮件服务

一个基于Node.js的HTTP服务，封装QQ邮箱SMTP功能，提供REST API接口，允许Python脚本或其他程序通过HTTP请求快速发送邮件。

## 功能特性

- ✅ 使用QQ邮箱SMTP服务发送邮件
- ✅ 提供HTTP REST API接口
- ✅ 支持纯文本和HTML格式邮件
- ✅ 支持邮件附件（可选）
- ✅ 完善的错误处理和日志记录
- ✅ 支持跨域请求（CORS）
- ✅ 环境变量配置，安全可靠

## 项目结构

```
项目根目录/
├── package.json          # 项目依赖配置
├── .env                  # 环境变量配置（需要自行创建）
├── server.js             # Express服务器主文件
├── services/
│   └── emailService.js   # 邮件发送服务封装
├── routes/
│   └── emailRoutes.js    # 邮件路由定义
└── README.md             # 使用说明文档
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（参考 `.env.example`），配置以下内容：

```env
# QQ邮箱配置
QQ_EMAIL=your_email@qq.com
QQ_AUTH_CODE=your_auth_code_here

# 服务器端口配置
SERVER_PORT=12889
```

#### 如何获取QQ邮箱授权码？

1. **网页端获取方式：**
   - 登录QQ邮箱网页版
   - 点击"设置" -> "账户"
   - 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
   - 开启SMTP服务
   - 点击"生成授权码"，按照提示获取授权码

2. **QQ邮箱App获取方式：**
   - 打开QQ邮箱App
   - 点击左上角头像
   - 选择"账号" -> "安全管理" -> "设备管理"
   - 在"授权码管理"中生成授权码

**重要提示：**
- 授权码不是QQ密码，是专门用于第三方客户端登录的专用密码
- 授权码需要妥善保管，不要泄露给他人
- 更改QQ密码会导致授权码过期，需要重新生成

### 3. 启动服务

```bash
npm start
```

服务启动后，会显示：
```
========================================
QQ邮箱自动发送邮件服务已启动
服务器运行在: http://localhost:12889
========================================
```

## API接口文档

### 1. 健康检查接口

**接口地址：** `GET /api/health`

**功能：** 检查服务是否正常运行

**请求示例：**
```bash
curl http://localhost:12889/api/health
```

**响应示例：**
```json
{
  "success": true,
  "message": "邮件服务运行正常",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

### 2. 发送邮件接口

**接口地址：** `POST /api/send-email`

**功能：** 发送邮件

**请求头：**
```
Content-Type: application/json
```

**请求体参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| to | string | 是 | 收件人邮箱地址 |
| subject | string | 是 | 邮件主题 |
| text | string | 否 | 纯文本邮件内容（text和html至少提供一个） |
| html | string | 否 | HTML格式邮件内容（text和html至少提供一个） |
| attachments | array | 否 | 附件数组（可选） |

**请求示例：**

```json
{
  "to": "recipient@example.com",
  "subject": "任务完成通知",
  "text": "您的任务已完成",
  "html": "<h1>任务完成</h1><p>您的任务已完成</p>"
}
```

**响应示例（成功）：**
```json
{
  "success": true,
  "message": "邮件发送成功",
  "messageId": "<message-id>"
}
```

**响应示例（失败）：**
```json
{
  "success": false,
  "message": "邮件发送失败",
  "error": "错误信息"
}
```

## Python调用示例

### 基础示例

```python
import requests

# 发送邮件的API地址
url = 'http://localhost:12889/api/send-email'

# 邮件内容
data = {
    'to': 'recipient@example.com',
    'subject': '任务完成通知',
    'text': '您的任务已完成',
    'html': '<h1>任务完成</h1><p>您的任务已完成</p>'
}

# 发送POST请求
response = requests.post(url, json=data)

# 处理响应
result = response.json()
if result['success']:
    print(f"邮件发送成功: {result['message']}")
else:
    print(f"邮件发送失败: {result['error']}")
```

### 封装为函数

```python
import requests

def send_email(to, subject, text=None, html=None):
    """
    发送邮件
    
    参数:
        to: 收件人邮箱地址
        subject: 邮件主题
        text: 纯文本内容（可选）
        html: HTML内容（可选）
    
    返回:
        dict: 包含success、message等字段的响应结果
    """
    url = 'http://localhost:12889/api/send-email'
    
    data = {
        'to': to,
        'subject': subject
    }
    
    if text:
        data['text'] = text
    if html:
        data['html'] = html
    
    try:
        response = requests.post(url, json=data, timeout=10)
        return response.json()
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'message': '请求失败',
            'error': str(e)
        }

# 使用示例
if __name__ == '__main__':
    result = send_email(
        to='recipient@example.com',
        subject='任务完成通知',
        text='您的任务已完成',
        html='<h1>任务完成</h1><p>您的任务已完成</p>'
    )
    
    if result['success']:
        print("邮件发送成功！")
    else:
        print(f"邮件发送失败: {result.get('error', '未知错误')}")
```

### 在任务完成后自动发送邮件

```python
import requests
import time

def run_task():
    """模拟一个任务"""
    print("任务开始执行...")
    time.sleep(2)  # 模拟任务执行
    print("任务执行完成！")
    return True

def notify_by_email(to, subject, message):
    """任务完成后发送邮件通知"""
    url = 'http://localhost:12889/api/send-email'
    data = {
        'to': to,
        'subject': subject,
        'text': message,
        'html': f'<h2>{subject}</h2><p>{message}</p>'
    }
    
    response = requests.post(url, json=data)
    return response.json()

# 主程序
if __name__ == '__main__':
    # 执行任务
    task_success = run_task()
    
    if task_success:
        # 任务完成后发送邮件通知
        result = notify_by_email(
            to='recipient@example.com',
            subject='任务完成通知',
            message='您的任务已成功完成！'
        )
        
        if result['success']:
            print("邮件通知已发送")
        else:
            print(f"邮件发送失败: {result.get('error')}")
```

## 其他语言调用示例

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function sendEmail(to, subject, text, html) {
    try {
        const response = await axios.post('http://localhost:12889/api/send-email', {
            to,
            subject,
            text,
            html
        });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: '请求失败',
            error: error.message
        };
    }
}

// 使用示例
sendEmail('recipient@example.com', '测试邮件', '这是测试内容')
    .then(result => console.log(result));
```

### cURL

```bash
curl -X POST http://localhost:12889/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "测试邮件",
    "text": "这是测试内容"
  }'
```

## 常见问题

### 1. 邮件发送失败，提示"授权码错误"

**解决方案：**
- 确认授权码是否正确（注意不是QQ密码）
- 检查授权码是否已过期（更改QQ密码会导致授权码过期）
- 重新生成授权码并更新.env文件

### 2. 连接超时或无法连接SMTP服务器

**解决方案：**
- 检查网络连接是否正常
- 确认防火墙是否阻止了465端口
- 尝试使用端口587（需要修改emailService.js中的端口配置）

### 3. Python脚本调用时出现连接错误

**解决方案：**
- 确认Node.js服务是否已启动
- 检查服务端口是否为12889
- 确认Python脚本中的URL地址是否正确

## 技术说明

- **SMTP服务器：** smtp.qq.com
- **端口：** 465（SSL加密）
- **协议：** SMTP over SSL
- **认证方式：** QQ邮箱地址 + 授权码

## 许可证

ISC

## 更新日志

### v1.0.0 (2025-11-11)
- 初始版本发布
- 实现基础的邮件发送功能
- 提供HTTP API接口
- 支持Python脚本调用

