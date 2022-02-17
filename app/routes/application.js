import Route from '@ember/routing/route';
import { DEBUG } from '@glimmer/env';

import { setupWorker } from 'msw';

export default class ApplicationRoute extends Route {
  async beforeModel() {
    // Don't include MSW in production, only in DEBUG (tests, development)
    if (DEBUG) {
      let worker = setupWorker();
      await worker.start();

      //
      worker.printHandlers();
    }
  }
}
