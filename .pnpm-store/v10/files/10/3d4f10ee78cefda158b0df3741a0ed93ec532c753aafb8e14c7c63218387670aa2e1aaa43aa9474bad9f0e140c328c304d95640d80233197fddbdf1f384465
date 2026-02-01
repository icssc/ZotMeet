const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_mysql2_session = require('./session.cjs');
const require_mysql2_driver = require('./driver.cjs');
let __mysql_core_db_ts = require("../mysql-core/db.cjs");

exports.MySql2Database = require_mysql2_driver.MySql2Database;
exports.MySql2Driver = require_mysql2_driver.MySql2Driver;
exports.MySql2PreparedQuery = require_mysql2_session.MySql2PreparedQuery;
exports.MySql2Session = require_mysql2_session.MySql2Session;
exports.MySql2Transaction = require_mysql2_session.MySql2Transaction;
Object.defineProperty(exports, 'MySqlDatabase', {
  enumerable: true,
  get: function () {
    return __mysql_core_db_ts.MySqlDatabase;
  }
});
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return require_mysql2_driver.drizzle;
  }
});