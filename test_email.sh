#!/bin/bash

# QQ邮箱自动发送邮件服务 - 测试脚本
# 使用方法：chmod +x test_email.sh && ./test_email.sh

# 配置
API_URL="http://localhost:12889"
TO_EMAIL="your_test_email@example.com"  # 请修改为你的测试邮箱地址

echo "=========================================="
echo "QQ邮箱自动发送邮件服务 - 测试脚本"
echo "=========================================="
echo ""

# 1. 测试健康检查
echo "[1/3] 测试健康检查接口..."
HEALTH_RESPONSE=$(curl -s $API_URL/api/health)
echo "$HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"
echo ""

# 检查服务是否运行
if echo "$HEALTH_RESPONSE" | grep -q "success"; then
    echo "✓ 服务运行正常"
else
    echo "✗ 服务未运行或无法访问，请先启动服务：npm start"
    exit 1
fi

echo ""
echo "----------------------------------------"
echo ""

# 2. 测试发送纯文本邮件
echo "[2/3] 测试发送纯文本邮件..."
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
TEXT_RESPONSE=$(curl -s -X POST $API_URL/api/send-email \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$TO_EMAIL\",
    \"subject\": \"测试邮件 - $CURRENT_TIME\",
    \"text\": \"这是一封来自CentOS服务器的测试邮件。\\n\\n发送时间：$CURRENT_TIME\\n\\n如果您收到这封邮件，说明QQ邮箱SMTP服务配置成功！\"
  }")

echo "$TEXT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$TEXT_RESPONSE"
echo ""

if echo "$TEXT_RESPONSE" | grep -q '"success":true'; then
    echo "✓ 纯文本邮件发送成功"
else
    echo "✗ 纯文本邮件发送失败"
fi

echo ""
echo "----------------------------------------"
echo ""

# 3. 测试发送HTML格式邮件
echo "[3/3] 测试发送HTML格式邮件..."
HTML_RESPONSE=$(curl -s -X POST $API_URL/api/send-email \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$TO_EMAIL\",
    \"subject\": \"测试邮件 - HTML格式\",
    \"html\": \"<h2 style='color: #1890ff;'>测试邮件</h2><p>这是一封<strong>HTML格式</strong>的测试邮件。</p><p>发送时间：<em>$CURRENT_TIME</em></p><p style='color: green;'>✓ 如果您看到这封邮件，说明服务配置成功！</p>\"
  }")

echo "$HTML_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HTML_RESPONSE"
echo ""

if echo "$HTML_RESPONSE" | grep -q '"success":true'; then
    echo "✓ HTML格式邮件发送成功"
else
    echo "✗ HTML格式邮件发送失败"
fi

echo ""
echo "=========================================="
echo "测试完成！"
echo "=========================================="
echo ""
echo "提示："
echo "1. 请检查邮箱（$TO_EMAIL）是否收到测试邮件"
echo "2. 如果发送失败，请检查："
echo "   - .env 文件中的QQ_EMAIL和QQ_AUTH_CODE是否正确"
echo "   - 服务器日志：tail -f email-service.log"
echo "   - 网络连接是否正常"
echo ""

