import { GridDisplay } from './GridDisplay';
import { Select, treeToSql, dumpSqlSelect } from '@dbgate/sqltree';
import { TableInfo, EngineDriver } from '@dbgate/types';
import { GridConfig, GridCache } from './GridConfig';

export class TableGridDisplay extends GridDisplay {
  constructor(
    public table: TableInfo,
    public driver: EngineDriver,
    config: GridConfig,
    setConfig: (config: GridConfig) => void,
    cache: GridCache,
    setCache: (config: GridCache) => void,
    getTableInfo: ({ schemaName, pureName }) => Promise<TableInfo>
  ) {
    super(config, setConfig, cache, setCache, getTableInfo);
    this.columns = this.getDisplayColumns(table, []);
  }

  createSelect() {
    const orderColumnName = this.table.columns[0].columnName;
    const select: Select = {
      commandType: 'select',
      from: { name: this.table },
      columns: this.table.columns.map(col => ({ exprType: 'column', alias: col.columnName, ...col })),
      orderBy: [
        {
          exprType: 'column',
          columnName: orderColumnName,
          direction: 'ASC',
        },
      ],
    };
    return select;
  }

  getPageQuery(offset: number, count: number) {
    const select = this.createSelect();
    if (this.driver.dialect.rangeSelect) select.range = { offset: offset, limit: count };
    else if (this.driver.dialect.limitSelect) select.topRecords = count;
    const sql = treeToSql(this.driver, select, dumpSqlSelect);
    return sql;
  }
}