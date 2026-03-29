// Verifies line coverage from LCOV after `flutter test --coverage`.
//
// Usage (from flutter_app root):
//   flutter test --coverage
//   dart run tool/verify_coverage.dart
//
// Optional first arg is minimum line percent (default 90):
//   dart run tool/verify_coverage.dart 91

import 'dart:io';

void main(List<String> args) {
  final minPercent = double.tryParse(
        args.isNotEmpty ? args.first : Platform.environment['MIN_LINE_COVERAGE'] ?? '90',
      ) ??
      90;

  final lcov = File('coverage/lcov.info');
  if (!lcov.existsSync()) {
    stderr.writeln('Missing coverage/lcov.info. Run: flutter test --coverage');
    exit(1);
  }

  var lf = 0;
  var lh = 0;
  for (final line in lcov.readAsLinesSync()) {
    if (line.startsWith('LF:')) {
      lf += int.parse(line.substring(3));
    } else if (line.startsWith('LH:')) {
      lh += int.parse(line.substring(3));
    }
  }

  if (lf == 0) {
    stderr.writeln('No LF entries in lcov.info');
    exit(1);
  }

  final pct = 100 * lh / lf;
  stdout.writeln('Line coverage: ${pct.toStringAsFixed(2)}% ($lh / $lf lines)');

  if (pct < minPercent - 1e-9) {
    stderr.writeln(
      'Coverage check failed: ${pct.toStringAsFixed(2)}% is below minimum $minPercent%.',
    );
    exit(1);
  }
}
