import Route from '@ember/routing/route';
import { registerDestructor } from '@ember/destroyable';
import { DEBUG } from '@glimmer/env';

import { setupWorker } from 'msw';

export default class ApplicationRoute extends Route {
  async beforeModel() {
    // Don't include MSW in production, only in DEBUG (tests, development)
    if (DEBUG) {
      await setupMSW(this);
    }
  }

  async model() {
    let response = await fetch('/blogs');
    let json = response.json();

    return { blogs: json };
  }
}

async function setupMSW(context) {
  let worker = setupWorker();
  await worker.start();

  worker.printHandlers();

  // Prevent duplication in tests,
  // where the app is setup and torn down a lot
  registerDestructor(context, () => worker.stop());
}
