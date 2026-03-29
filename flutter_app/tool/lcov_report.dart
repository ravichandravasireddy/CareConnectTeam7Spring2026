// Readable text coverage report from LCOV (line hits / instrumented lines per file).
//
// Usage (from flutter_app root, after `flutter test --coverage`):
//   dart run tool/lcov_report.dart
//
// Optional: custom lcov path, then output path
//   dart run tool/lcov_report.dart coverage/lcov.info coverage/coverage_summary.txt

import 'dart:io';

class _FileCov {
  _FileCov(this.path, this.hit, this.found);

  final String path;
  final int hit;
  final int found;

  double get pct => found == 0 ? 100.0 : 100.0 * hit / found;
}

void main(List<String> args) {
  final lcovPath = args.isNotEmpty ? args[0] : 'coverage/lcov.info';
  final outPath =
      args.length > 1 ? args[1] : 'coverage/coverage_summary.txt';

  final file = File(lcovPath);
  if (!file.existsSync()) {
    stderr.writeln('Missing $lcovPath. Run: flutter test --coverage');
    exit(1);
  }

  final records = file.readAsStringSync().split('end_of_record');
  final rows = <_FileCov>[];

  for (final raw in records) {
    final lines = raw.split('\n').map((e) => e.trim()).where((e) => e.isNotEmpty).toList();
    if (lines.isEmpty) continue;

    String? path;
    int? lf;
    int? lh;

    for (final line in lines) {
      if (line.startsWith('SF:')) {
        path = line.substring(3).replaceAll(r'\', '/');
      } else if (line.startsWith('LF:')) {
        lf = int.tryParse(line.substring(3));
      } else if (line.startsWith('LH:')) {
        lh = int.tryParse(line.substring(3));
      }
    }

    if (path != null && lf != null && lh != null) {
      rows.add(_FileCov(path, lh, lf));
    }
  }

  rows.sort((a, b) => a.path.compareTo(b.path));

  var totalHit = 0;
  var totalFound = 0;
  for (final r in rows) {
    totalHit += r.hit;
    totalFound += r.found;
  }
  final totalPct =
      totalFound == 0 ? 100.0 : (100.0 * totalHit / totalFound);

  String padR(String s, int w) => s.padLeft(w);
  String padL(String s, int w) => s.padRight(w);

  const wFile = 52;
  const wNum = 6;
  const wPct = 7;

  final buf = StringBuffer();
  void writeln(String s) {
    buf.writeln(s);
    stdout.writeln(s);
  }

  writeln('Flutter coverage — lines hit / instrumented (from LCOV)');
  writeln('=' * 88);
  writeln(
    '${padL('File', wFile)} ${padR('Hit', wNum)} ${padR('Inst', wNum)} ${padR('Miss', wNum)} ${padR('%', wPct)}',
  );
  writeln('-' * 88);

  for (final r in rows) {
    final miss = r.found - r.hit;
    final p = r.pct.toStringAsFixed(1);
    final name = r.path.length <= wFile ? r.path : '…${r.path.substring(r.path.length - wFile + 1)}';
    writeln(
      '${padL(name, wFile)} ${padR('${r.hit}', wNum)} ${padR('${r.found}', wNum)} ${padR('$miss', wNum)} ${padR('$p', wPct)}',
    );
  }

  writeln('-' * 88);
  final miss = totalFound - totalHit;
  writeln(
    '${padL('TOTAL', wFile)} ${padR('$totalHit', wNum)} ${padR('$totalFound', wNum)} ${padR('$miss', wNum)} ${padR(totalPct.toStringAsFixed(2), wPct)}',
  );
  writeln('');
  writeln('HTML report: install LCOV and run tool/lcov_to_html.ps1 (see script header),');
  writeln('or: reportgenerator -reports:$lcovPath -targetdir:coverage/html -reporttypes:Html');

  File(outPath).writeAsStringSync(buf.toString());
  stdout.writeln('');
  stdout.writeln('Wrote $outPath');
}
