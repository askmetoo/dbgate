const PostgreAnalyser = require('./PostgreAnalyser');
const PostgreDumper = require('./PostgreDumper');

/** @type {import('dbgate').SqlDialect} */
const dialect = {
  rangeSelect: true,
  quoteIdentifier(s) {
    return '"' + s + '"';
  },
};

/** @type {import('dbgate').EngineDriver} */
const driver = {
  async connect({pg}, { server, port, user, password, database }) {
    const client = new pg.Client({ host: server, port, user, password, database: database || 'postgres' });
    await client.connect();
    return client;
  },
  async query(client, sql) {
    const res = await client.query(sql);
    return { rows: res.rows, columns: res.fields };
  },
  async getVersion(client) {
    const { rows } = await this.query(client, 'SELECT version()');
    const { version } = rows[0];
    return { version };
  },
  async analyseFull(pool) {
    const analyser = new PostgreAnalyser(pool, this);
    await analyser.runAnalysis();
    return analyser.result;
  },
  createDumper() {
    return new PostgreDumper(this);
  },
  async listDatabases(client) {
    const { rows } = await this.query(client, 'SELECT datname AS name FROM pg_database WHERE datistemplate = false');
    return rows;
  },
  dialect,
};

module.exports = driver;