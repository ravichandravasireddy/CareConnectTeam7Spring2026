/**
 * Tests for renderer app.js Axe dev bootstrap (runAxeInDev IIFE).
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function flushMicrotasks() {
  // Flush Promise microtasks (getIsDev → script onload/onerror) then I/O phase.
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((r) => setImmediate(r));
}

function loadAppWithAxeDev({ scriptFails = false, omitAxeOnLoad = false } = {}) {
  const htmlPath = path.join(__dirname, '../renderer/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const htmlWithoutApp = html.replace('<script src="app.js"></script>', '');

  const dom = new JSDOM(htmlWithoutApp, {
    url: 'file://' + path.join(__dirname, '../renderer/'),
  });

  const document = dom.window.document;
  const window = dom.window;
  global.document = document;
  global.window = window;

  window.electronAPI = {
    invoke: () => Promise.resolve({}),
    onMenuAction: (cb) => {
      window.__menuActionCallback = cb;
    },
    getIsDev: () => Promise.resolve(true),
  };

  const origCreate = document.createElement.bind(document);
  document.createElement = function createElementSpy(tagName) {
    const el = origCreate(tagName);
    if (String(tagName).toLowerCase() === 'script') {
      queueMicrotask(() => {
        if (scriptFails) {
          if (typeof el.onerror === 'function') el.onerror();
          return;
        }
        if (!omitAxeOnLoad) {
          window.axe = {
            run(_doc, _opts, cb) {
              cb(null, { violations: [] });
            },
          };
        }
        if (typeof el.onload === 'function') el.onload();
      });
    }
    return el;
  };

  jest.isolateModules(() => {
    require('../renderer/app.js');
  });

  // Do not restore createElement here: getIsDev().then runs on a microtask after this
  // function returns; restoring early would drop the script stub before onload runs.

  return { window, document, dom, restoreCreateElement: () => { document.createElement = origCreate; } };
}

describe('Axe dev loader (runAxeInDev)', () => {
  let logSpy;
  let warnSpy;
  let lastRestore;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    lastRestore = null;
  });

  afterEach(() => {
    if (typeof lastRestore === 'function') lastRestore();
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('defines runAxeCheck and resolves when axe.run succeeds', async () => {
    const { window, restoreCreateElement } = loadAppWithAxeDev();
    lastRestore = restoreCreateElement;
    await flushMicrotasks();
    expect(typeof window.runAxeCheck).toBe('function');
    await expect(window.runAxeCheck('my-context')).resolves.toEqual({ violations: [] });
    expect(logSpy).toHaveBeenCalled();
  });

  it('runAxeCheck rejects when axe.run returns an error', async () => {
    const { window, restoreCreateElement } = loadAppWithAxeDev();
    lastRestore = restoreCreateElement;
    await flushMicrotasks();
    window.axe = {
      run(_d, _o, cb) {
        cb(new Error('axe failed'));
      },
    };
    await expect(window.runAxeCheck()).rejects.toThrow('axe failed');
  });

  it('logs context in label when runAxeCheck is called with context', async () => {
    const { window, restoreCreateElement } = loadAppWithAxeDev();
    lastRestore = restoreCreateElement;
    await flushMicrotasks();
    logSpy.mockClear();
    await window.runAxeCheck('unit-test');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Axe-core accessibility violations (unit-test)'),
      expect.anything()
    );
  });

  it('does not define runAxeCheck when script loads but axe global is missing', async () => {
    const { window, restoreCreateElement } = loadAppWithAxeDev({ omitAxeOnLoad: true });
    lastRestore = restoreCreateElement;
    await flushMicrotasks();
    expect(window.runAxeCheck).toBeUndefined();
  });

  it('uses bare log label when runAxeCheck context is omitted', async () => {
    const { window, restoreCreateElement } = loadAppWithAxeDev();
    lastRestore = restoreCreateElement;
    await flushMicrotasks();
    logSpy.mockClear();
    await window.runAxeCheck();
    expect(logSpy).toHaveBeenCalledWith(
      'Axe-core accessibility violations:',
      expect.anything()
    );
  });

  it('warns when axe script fails to load', async () => {
    const { restoreCreateElement } = loadAppWithAxeDev({ scriptFails: true });
    lastRestore = restoreCreateElement;
    await flushMicrotasks();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Axe-core not loaded'));
  });

  it('does not define runAxeCheck when getIsDev resolves false', async () => {
    const htmlPath = path.join(__dirname, '../renderer/index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const htmlWithoutApp = html.replace('<script src="app.js"></script>', '');
    const dom = new JSDOM(htmlWithoutApp, {
      url: 'file://' + path.join(__dirname, '../renderer/'),
    });
    global.document = dom.window.document;
    global.window = dom.window;
    global.window.electronAPI = {
      invoke: () => Promise.resolve({}),
      onMenuAction: () => {},
      getIsDev: () => Promise.resolve(false),
    };
    jest.isolateModules(() => {
      require('../renderer/app.js');
    });
    await flushMicrotasks();
    expect(global.window.runAxeCheck).toBeUndefined();
  });
});
