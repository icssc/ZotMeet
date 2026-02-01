const require_pglite_session = require('./session.cjs');
const require_pglite_driver = require('./driver.cjs');

exports.PgliteDatabase = require_pglite_driver.PgliteDatabase;
exports.PgliteDriver = require_pglite_driver.PgliteDriver;
exports.PglitePreparedQuery = require_pglite_session.PglitePreparedQuery;
exports.PgliteSession = require_pglite_session.PgliteSession;
exports.PgliteTransaction = require_pglite_session.PgliteTransaction;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return require_pglite_driver.drizzle;
  }
});