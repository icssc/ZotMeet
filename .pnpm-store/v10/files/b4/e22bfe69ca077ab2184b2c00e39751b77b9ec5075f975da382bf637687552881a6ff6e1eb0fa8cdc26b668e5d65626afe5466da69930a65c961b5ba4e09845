const require_vercel_postgres_session = require('./session.cjs');
const require_vercel_postgres_driver = require('./driver.cjs');

exports.VercelPgDatabase = require_vercel_postgres_driver.VercelPgDatabase;
exports.VercelPgDriver = require_vercel_postgres_driver.VercelPgDriver;
exports.VercelPgPreparedQuery = require_vercel_postgres_session.VercelPgPreparedQuery;
exports.VercelPgSession = require_vercel_postgres_session.VercelPgSession;
exports.VercelPgTransaction = require_vercel_postgres_session.VercelPgTransaction;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return require_vercel_postgres_driver.drizzle;
  }
});