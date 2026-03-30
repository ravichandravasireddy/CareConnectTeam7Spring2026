# Generate browsable HTML from coverage/lcov.info (after `flutter test --coverage`).
# Run from flutter_app:  powershell -File tool/lcov_to_html.ps1
#
# Requires one of:
#   - genhtml (Perl LCOV): https://github.com/linux-test-project/lcov
#     e.g. scoop install lcov   or   use WSL: sudo apt install lcov
#   - ReportGenerator (.NET): dotnet tool install -g dotnet-reportgenerator-globaltool
#     then: reportgenerator -reports:... -targetdir:... -reporttypes:Html

$ErrorActionPreference = "Stop"
# Script lives in flutter_app/tool — use repo flutter_app as cwd
Set-Location (Join-Path $PSScriptRoot "..")

$lcov = Join-Path (Get-Location) "coverage/lcov.info"
$outDir = Join-Path (Get-Location) "coverage/html"

if (-not (Test-Path $lcov)) {
    Write-Error "Missing coverage/lcov.info — run: flutter test --coverage"
    exit 1
}

if (Get-Command genhtml -ErrorAction SilentlyContinue) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
    & genhtml $lcov -o $outDir
    Write-Host "Open: $outDir/index.html"
    exit 0
}

if (Get-Command reportgenerator -ErrorAction SilentlyContinue) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
    & reportgenerator -reports:$lcov -targetdir:$outDir -reporttypes:Html
    Write-Host "Open: $outDir/index.html"
    exit 0
}

Write-Host "Neither 'genhtml' nor 'reportgenerator' found in PATH."
Write-Host "1) Install LCOV (genhtml) or ReportGenerator, then re-run this script."
Write-Host "2) Or use only Dart (no extra tools):"
Write-Host "   dart run tool/lcov_report.dart"
exit 1
