/**
 * Automated axe-core accessibility tests
 * Launches Electron; the app loads axe in dev and exposes runAxeCheck().
 * We wait for it and call it to get violations (avoids CSP issues).
 * Run: npm test -- axe.test.js   or  npm run test:axe
 * @jest-environment node
 */

const path = require('path');

async function launchElectronAndRunAxe() {
  const playwright = require('playwright');
  const electron = playwright._electron;
  const appPath = path.join(__dirname, '..');
  const electronApp = await electron.launch({
    args: [path.join(appPath, 'index.js')],
    cwd: appPath,
    timeout: 15000,
  });
  const window = await electronApp.firstWindow({ timeout: 10000 });
  await window.waitForFunction(
    () => typeof window.runAxeCheck === 'function',
    { timeout: 8000 }
  );
  const results = await window.evaluate(async () => {
    const r = await window.runAxeCheck('automated-test');
    return r;
  });
  await electronApp.close();
  return results;
}

describe('Axe accessibility (Electron)', () => {
  it('has no critical or serious violations on welcome screen', async () => {
    const results = await launchElectronAndRunAxe();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    const serious = results.violations.filter((v) => v.impact === 'serious');
    const failing = [...critical, ...serious];
    if (failing.length > 0) {
      const msg = failing
        .map((v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`)
        .join('\n');
      throw new Error(`Axe violations (critical/serious):\n${msg}`);
    }
    expect(failing).toHaveLength(0);
  }, 20000);

  it('logs violation summary when any violations exist', async () => {
    const results = await launchElectronAndRunAxe();
    const total = results.violations.length;
    const byImpact = {};
    results.violations.forEach((v) => {
      byImpact[v.impact] = (byImpact[v.impact] || 0) + 1;
    });
    if (total > 0) {
      console.log('Axe summary:', { total, byImpact });
    }
    expect(typeof results.violations).toBe('object');
  }, 20000);
});
