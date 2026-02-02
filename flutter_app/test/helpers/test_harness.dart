import 'package:flutter/material.dart';

Widget createTestHarness({
  required Widget child,
  Map<String, WidgetBuilder>? routes,
}) {
  return MaterialApp(
    home: child,
    routes: routes ?? const {},
  );
}

Widget placeholderScreen(String label) {
  return Scaffold(
    body: Center(child: Text(label)),
  );
}
