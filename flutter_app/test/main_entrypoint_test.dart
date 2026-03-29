import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/main.dart' as careconnect;

void main() {
  testWidgets('main() runApp attaches CareConnect MaterialApp', (tester) async {
    careconnect.main();
    await tester.pump();

    expect(find.byType(MaterialApp), findsOneWidget);
    expect(find.text('CareConnect'), findsOneWidget);
  });
}
