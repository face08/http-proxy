import 'module-alias/register';

import HTTPProxy from './httpServer';
import AppConfig from './appConfig';
import HTTPSProxy from './httpsProxy';
import createSaver from './saver';

import initDb from './db';
// eslint-disable-next-line no-unused-vars
import { LogModelMethods } from './db/types';

import api from './api';
import { getResponseHandler } from './utils';


const config = new AppConfig();

initDb(config).then((conn: LogModelMethods | null) => {
  if (!conn) {
    return;
  }

  const saver = createSaver(conn.save);

  const httpProxy = new HTTPProxy(
    config,
    getResponseHandler(false, saver),
  );

  const httpsProxy = new HTTPSProxy(
    config,
    getResponseHandler(true, saver),
  );

  httpProxy.init();
  httpsProxy.init();

  api(config, conn);
});
