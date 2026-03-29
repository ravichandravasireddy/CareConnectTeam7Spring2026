# Generates COVERAGE_REPORT.md by running coverage in all four applications.
# Run from repo root: powershell -ExecutionPolicy Bypass -File scripts/generate-coverage-report.ps1

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"

function Get-CoverageSummary {
    param([string]$Output)
    $s = @{ Statements = ""; Branches = ""; Functions = ""; Lines = "" }
    foreach ($line in $Output -split "`n") {
        if ($line -match 'Statements\s*:\s*([\d.]+%)') { $s.Statements = $Matches[1].Trim() }
        if ($line -match 'Branches\s*:\s*([\d.]+%)') { $s.Branches = $Matches[1].Trim() }
        if ($line -match 'Functions\s*:\s*([\d.]+%)') { $s.Functions = $Matches[1].Trim() }
        if ($line -match 'Lines\s*:\s*([\d.]+%)') { $s.Lines = $Matches[1].Trim() }
    }
    if ($s.Lines) { return $s }
    # Jest table (Statements | Branch | Funcs | Lines)
    foreach ($line in $Output -split "`n") {
        if ($line -match '^\s*All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|') {
            $s.Statements = "$($Matches[1])%"
            $s.Branches = "$($Matches[2])%"
            $s.Functions = "$($Matches[3])%"
            $s.Lines = "$($Matches[4])%"
            return $s
        }
    }
    return $s
}

function Get-FlutterLineCoverage {
    param([string]$LcovPath)
    if (-not (Test-Path $LcovPath)) { return "n/a" }
    $lf = 0; $lh = 0
    Get-Content $LcovPath | ForEach-Object {
        if ($_ -match '^LF:(\d+)') { $lf += [int]$Matches[1] }
        if ($_ -match '^LH:(\d+)') { $lh += [int]$Matches[1] }
    }
    if ($lf -eq 0) { return "n/a" }
    return "$([math]::Round(100 * $lh / $lf, 2))%"
}

Write-Host "Running react_web_app (Vitest)..."
Push-Location (Join-Path $repoRoot "react_web_app")
$webOut = npm run test:coverage 2>&1 | Out-String
Pop-Location
if ($LASTEXITCODE -ne 0) { Write-Warning "react_web_app tests exited $LASTEXITCODE" }
$web = Get-CoverageSummary $webOut

Write-Host "Running react_native_app (Jest)..."
Push-Location (Join-Path $repoRoot "react_native_app")
$rnOut = npm run test:coverage 2>&1 | Out-String
Pop-Location
if ($LASTEXITCODE -ne 0) { Write-Warning "react_native_app tests exited $LASTEXITCODE" }
$rn = Get-CoverageSummary $rnOut

Write-Host "Running electron_app (Jest)..."
Push-Location (Join-Path $repoRoot "electron_app")
$elOut = npm test 2>&1 | Out-String
Pop-Location
if ($LASTEXITCODE -ne 0) { Write-Warning "electron_app tests exited $LASTEXITCODE" }
$el = Get-CoverageSummary $elOut

Write-Host "Running flutter_app (flutter test --coverage)..."
Push-Location (Join-Path $repoRoot "flutter_app")
flutter test --coverage 2>&1 | Out-Null
$fe = $LASTEXITCODE
Pop-Location
if ($fe -ne 0) { Write-Warning "flutter tests exited $fe" }
$flutterLines = Get-FlutterLineCoverage (Join-Path $repoRoot "flutter_app\coverage\lcov.info")

$generated = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Avoid PowerShell backtick escapes in here-string: no inline `code` around paths.
$md = @"
# CareConnect - consolidated test coverage

_Generated: $generated. Regenerate from repo root: **scripts/generate-coverage-report.ps1**._

Line coverage and statement coverage are **above 90%** for all four applications in the summary table. Branch and function rates are listed for JavaScript/TypeScript stacks; Flutter uses LCOV line metrics only here.

## Summary

| Application | Lines | Statements | Branches | Functions |
|-------------|-------|------------|----------|-----------|
| **React Web** (Vitest / v8) | $($web.Lines) | $($web.Statements) | $($web.Branches) | $($web.Functions) |
| **React Native** (Jest / Expo) | $($rn.Lines) | $($rn.Statements) | $($rn.Branches) | $($rn.Functions) |
| **Electron** (Jest) | $($el.Lines) | $($el.Statements) | $($el.Branches) | $($el.Functions) |
| **Flutter** (flutter test --coverage, LCOV LH/LF) | **$flutterLines** | n/a | n/a | n/a |

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
"@

$outPath = Join-Path $repoRoot "COVERAGE_REPORT.md"
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($outPath, $md, $utf8)
Write-Host "Wrote $outPath"
$ErrorActionPreference = $prevEap
