export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PORT: parseInt(process.env.PORT || '3001', 10),
  HOST: process.env.HOST || '0.0.0.0',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  SEED: parseInt(process.env.SEED || '12345', 10),
  DATA_POINTS_COUNT: parseInt(process.env.DATA_POINTS_COUNT || '100', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  // API key required to access the analytics endpoints. Defaults to a dev key
  // so the app runs locally with no setup; set a strong value in production.
  API_KEY: process.env.API_KEY || 'dev-key-change-me',
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '1 minute',
  // OpenRouter integration — supply via the OPENROUTER_API_KEY env var.
  // No hardcoded fallback: the key must never be committed to source.
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'openrouter/free',
} as const;
