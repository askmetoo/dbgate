const _ = require("lodash");
const MsSqlAnalyser = require("./MsSqlAnalyser");
const MsSqlDumper = require("./MsSqlDumper");

/** @type {import('@dbgate/types').SqlDialect} */
const dialect = {
  limitSelect: true,
  rangeSelect: true,
  offsetFetchRangeSyntax: true,
  quoteIdentifier(s) {
    return `[${s}]`;
  }
};

/** @type {import('@dbgate/types').EngineDriver} */
const driver = {
  async connect(nativeModules, { server, port, user, password, database }) {
    const pool = await nativeModules.mssql.connect({
      server,
      port,
      user,
      password,
      database,
      options: {
        enableArithAbort: true
      }
    });
    pool._nativeModules = nativeModules;
    return pool;
  },
  async query(pool, sql) {
    const resp = await pool.request().query(sql);
    // console.log(Object.keys(resp.recordset));
    const columns = _.sortBy(_.values(resp.recordset.columns), "index");
    return { rows: resp.recordset, columns };
  },
  async getVersion(pool) {
    const { version } = (
      await this.query(pool, "SELECT @@VERSION AS version")
    ).rows[0];
    return { version };
  },
  async listDatabases(pool) {
    const { rows } = await this.query(
      pool,
      "SELECT name FROM sys.databases order by name"
    );
    return rows;
  },
  async analyseFull(pool) {
    const analyser = new MsSqlAnalyser(pool, this);
    await analyser.runAnalysis();
    return analyser.result;
  },
  // async analyseIncremental(pool) {},
  createDumper() {
    return new MsSqlDumper(this);
  },
  dialect
};

module.exports = driver;