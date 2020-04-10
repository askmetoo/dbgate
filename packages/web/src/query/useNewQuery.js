import _ from 'lodash';
import { useSetOpenedTabs, useCurrentDatabase } from '../utility/globalState';
import { openNewTab } from '../utility/common';

export default function useNewQuery() {
  const setOpenedTabs = useSetOpenedTabs();
  const currentDatabase = useCurrentDatabase();

  const connection = _.get(currentDatabase, 'connection') || {};
  const database = _.get(currentDatabase, 'name');

  const tooltip = `${connection.displayName || connection.server}\n${database}`;

  return () =>
    openNewTab(setOpenedTabs, {
      title: 'Query',
      icon: 'sql.svg',
      tooltip,
      tabComponent: 'QueryTab',
      props: {
        conid: connection._id,
        database,
      },
    });
}