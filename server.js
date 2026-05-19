const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const PORT = process.env.PORT || 8080;

// Целевой URL — ваш телефон (замените на актуальный IP)
const TARGET_URL = process.env.TARGET_URL || 'http://192.168.1.100:8080';

// Создаём прокси
const proxy = httpProxy.createProxyServer({
  target: TARGET_URL,
  changeOrigin: true,
  ws: false
});

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Проксируем все запросы на телефон
app.all('*', (req, res) => {
  proxy.web(req, res, {}, (err) => {
    console.error('Proxy error:', err.message);
    res.status(502).send('Устройство офлайн или не запущен сервер в приложении. Проверьте телефон.');
  });
});

app.listen(PORT, () => {
  console.log(`Telegram proxy running on port ${PORT}`);
  console.log(`Forwarding to: ${TARGET_URL}`);
  console.log('Webhook URL: ' + (process.env.RENDER_EXTERNAL_URL || 'https://ваш-сервис.onrender.com') + '/telegram');
});