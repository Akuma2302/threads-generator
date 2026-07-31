const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
  })
);

app.use(express.json({ limit: '12mb' })); // generous limit for base64 poster uploads

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please slow down and try again shortly.' },
});
app.use('/api', limiter);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Threads Generator backend (Hermes agent) listening on port ${env.port}`);
});
