# CareConnect - consolidated test coverage

_Generated: 2026-03-28 10:18:24. Regenerate from repo root: **scripts/generate-coverage-report.ps1**._

Line coverage and statement coverage are **above 90%** for all four applications in the summary table. Branch and function rates are listed for JavaScript/TypeScript stacks; Flutter uses LCOV line metrics only here.

## Summary

| Application | Lines | Statements | Branches | Functions |
|-------------|-------|------------|----------|-----------|
| **React Web** (Vitest / v8) | 100% | 100% | 96.15% | 98.18% |
| **React Native** (Jest / Expo) | 94.92% | 94.05% | 82.57% | 89.8% |
| **Electron** (Jest) | 93.76% | 92.19% | 76.49% | 89.02% |
| **Flutter** (flutter test --coverage, LCOV LH/LF) | **92.29%** | n/a | n/a | n/a |

### HTML / LCOV outputs

| App | Command | Output |
|-----|---------|--------|
| React Web | npm run test:coverage | react_web_app/coverage/index.html |
| React Native | npm run test:coverage | react_native_app/coverage/lcov-report/index.html |
| Electron | npm test | electron_app/coverage/lcov-report/index.html |
| Flutter | flutter test --coverage | flutter_app/coverage/lcov.info |

### CI thresholds

- **React Web**: vitest coverage thresholds (lines, statements, branches, functions) at 90% in react_web_app/vite.config.js
- **React Native**: jest coverageThreshold lines and statements at 90% in react_native_app/jest.config.js (excludes models/TimelineEvent.ts and screens/test-setup.ts from collection)
- **Electron**: jest lines and statements at 90% in electron_app/jest.config.js (additional branch/function floors documented there)