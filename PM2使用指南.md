# PM2 进程管理工具使用指南

## 什么是 PM2？

PM2（Process Manager 2）是一个强大的Node.js进程管理器，可以：
- 保持应用持续运行（进程守护）
- 自动重启崩溃的应用
- 管理日志
- 监控应用性能
- 负载均衡（集群模式）
- 开机自启动

## 安装 PM2

```bash
# 全局安装
npm install -g pm2

# 验证安装
pm2 --version
```

## 基础命令

### 1. 启动应用

```bash
# 基本启动
pm2 start server.js

# 指定应用名称
pm2 start server.js --name email-service

# 启动并指定参数
pm2 start server.js --name email-service -- arg1 arg2

# 从package.json启动
pm2 start npm --name email-service -- start
```

### 2. 查看应用状态

```bash
# 查看所有应用状态
pm2 list
# 或简写
pm2 ls

# 查看详细信息
pm2 show email-service
# 或简写
pm2 describe email-service

# 查看实时监控面板
pm2 monit
```

### 3. 停止应用

```bash
# 停止指定应用
pm2 stop email-service

# 停止所有应用
pm2 stop all

# 停止应用（通过ID）
pm2 stop 0
```

### 4. 重启应用

```bash
# 重启指定应用
pm2 restart email-service

# 重启所有应用
pm2 restart all

# 优雅重启（零停机时间）
pm2 reload email-service

# 通过ID重启
pm2 restart 0
```

### 5. 删除应用

```bash
# 删除指定应用
pm2 delete email-service

# 删除所有应用
pm2 delete all

# 通过ID删除
pm2 delete 0
```

## 日志管理

### 查看日志

```bash
# 查看所有应用日志
pm2 logs

# 查看指定应用日志
pm2 logs email-service

# 查看最近100行日志
pm2 logs email-service --lines 100

# 清空日志
pm2 flush

# 清空指定应用日志
pm2 flush email-service
```

### 日志文件位置

PM2日志默认存储在：
- 日志文件：`~/.pm2/logs/`
- 错误日志：`~/.pm2/logs/email-service-error.log`
- 输出日志：`~/.pm2/logs/email-service-out.log`

## 监控和性能

### 实时监控

```bash
# 打开监控面板（类似htop）
pm2 monit

# 查看应用详细信息
pm2 show email-service
```

### 性能指标

```bash
# 查看CPU和内存使用情况
pm2 list

# 查看详细信息（包含更多指标）
pm2 describe email-service
```

## 配置文件（推荐）

创建 `ecosystem.config.js` 配置文件：

```bash
# 生成示例配置
pm2 ecosystem
```

编辑配置文件：

```javascript
module.exports = {
  apps: [{
    name: 'email-service',
    script: './server.js',
    instances: 1,                    // 实例数量
    exec_mode: 'fork',               // 执行模式：fork 或 cluster
    watch: false,                    // 是否监听文件变化自动重启
    max_memory_restart: '500M',      // 内存超过500M自动重启
    env: {
      NODE_ENV: 'production',
      SERVER_PORT: 12889
    },
    error_file: './logs/err.log',    // 错误日志路径
    out_file: './logs/out.log',      // 输出日志路径
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',  // 日志时间格式
    merge_logs: true,                // 合并日志
    autorestart: true,               // 自动重启
    max_restarts: 10,                // 最大重启次数
    min_uptime: '10s'                // 最小运行时间
  }]
}
```

使用配置文件：

```bash
# 启动
pm2 start ecosystem.config.js

# 重启
pm2 restart ecosystem.config.js

# 停止
pm2 stop ecosystem.config.js
```

## 开机自启动

### 保存当前PM2进程列表

```bash
# 保存当前运行的应用列表
pm2 save
```

### 生成开机自启动脚本

```bash
# 生成启动脚本（根据系统自动选择）
pm2 startup

# 执行输出的命令（通常是sudo开头的命令）
# 例如：sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### 取消开机自启动

```bash
pm2 unstartup
```

## 集群模式（负载均衡）

```bash
# 启动集群模式（使用所有CPU核心）
pm2 start server.js -i max

# 启动指定数量的实例
pm2 start server.js -i 4

# 在配置文件中设置
# exec_mode: 'cluster',
# instances: 4
```

## 环境变量管理

```bash
# 启动时指定环境变量
pm2 start server.js --name email-service --env production

# 在配置文件中设置
# env: {
#   NODE_ENV: 'production'
# }
```

## 常用组合命令

### 查看应用状态和日志

```bash
# 查看状态
pm2 list

# 查看日志（实时）
pm2 logs email-service --lines 50

# 查看详细信息
pm2 show email-service
```

### 重启并查看日志

```bash
pm2 restart email-service && pm2 logs email-service
```

### 停止、删除、重新启动

```bash
pm2 stop email-service
pm2 delete email-service
pm2 start server.js --name email-service
```

## 实用技巧

### 1. 查看应用资源使用

```bash
pm2 monit
```

### 2. 重置重启计数器

```bash
pm2 reset email-service
```

### 3. 更新PM2

```bash
npm install -g pm2@latest
pm2 update
```

### 4. 查看PM2版本和信息

```bash
pm2 --version
pm2 info
```

### 5. 杀死PM2守护进程

```bash
pm2 kill
```

## 针对本项目的使用示例

### 启动邮件服务

```bash
# 进入项目目录
cd /root/stmp

# 启动服务
pm2 start server.js --name email-service

# 查看状态
pm2 list

# 查看日志
pm2 logs email-service
```

### 使用配置文件启动

```bash
# 创建 ecosystem.config.js（参考上面的配置）
pm2 start ecosystem.config.js

# 保存进程列表
pm2 save

# 设置开机自启动
pm2 startup
# 然后执行输出的命令
```

### 日常维护

```bash
# 查看服务状态
pm2 status

# 查看实时日志
pm2 logs email-service --lines 100

# 重启服务（更新代码后）
pm2 restart email-service

# 查看资源使用
pm2 monit
```

## 常见问题

### 1. PM2命令找不到

```bash
# 检查是否全局安装
npm list -g pm2

# 如果未安装，重新安装
npm install -g pm2

# 检查PATH
echo $PATH
```

### 2. 应用无法启动

```bash
# 查看详细错误
pm2 logs email-service --err

# 检查配置文件
pm2 show email-service
```

### 3. 端口被占用

```bash
# 检查端口占用
netstat -tlnp | grep 12889

# 停止占用端口的进程
pm2 stop email-service
```

## PM2 vs 其他方案对比

| 特性 | PM2 | nohup | systemd |
|------|-----|-------|---------|
| 进程守护 | ✅ | ❌ | ✅ |
| 自动重启 | ✅ | ❌ | ✅ |
| 日志管理 | ✅ | 手动 | 手动 |
| 监控面板 | ✅ | ❌ | ❌ |
| 集群模式 | ✅ | ❌ | ❌ |
| 开机自启 | ✅ | ❌ | ✅ |
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

## 总结

PM2是Node.js应用的最佳进程管理工具，特别适合：
- 生产环境部署
- 需要进程守护和自动重启
- 需要日志管理和监控
- 需要集群模式负载均衡

对于简单的测试环境，使用 `nohup` 就足够了。对于生产环境，强烈推荐使用PM2。

