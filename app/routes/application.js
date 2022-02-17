import Route from '@ember/routing/route';
import { registerDestructor } from '@ember/destroyable';
import { DEBUG } from '@glimmer/env';

export default class ApplicationRoute extends Route {
  async beforeModel() {
    // Don't include MSW in production, only in DEBUG (tests, development)
    if (DEBUG) {
      await setupMSW(this);
    }
  }

  async model() {
    let response = await fetch('/blogs');
    let json = await response.json();

    return { blogs: json.data };
  }
}

async function setupMSW(context) {
  let { worker } = await import('/mocks/browser.js');

  await worker.start();

  // Prevent duplication in tests,
  // where the app is setup and torn down a lot
  registerDestructor(context, () => worker.stop());
}
