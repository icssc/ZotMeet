const require_neon_serverless_session = require('./session.cjs');
const require_neon_serverless_driver = require('./driver.cjs');

exports.NeonDatabase = require_neon_serverless_driver.NeonDatabase;
exports.NeonDriver = require_neon_serverless_driver.NeonDriver;
exports.NeonPreparedQuery = require_neon_serverless_session.NeonPreparedQuery;
exports.NeonSession = require_neon_serverless_session.NeonSession;
exports.NeonTransaction = require_neon_serverless_session.NeonTransaction;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return require_neon_serverless_driver.drizzle;
  }
});