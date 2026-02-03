// =============================================================================
// TEST HARNESS UTILITIES
// =============================================================================
// SWEN 661 - Shared helpers for wrapping widgets with MaterialApp and routes.
//
// KEY CONCEPTS COVERED:
// 1. Consistent MaterialApp setup for widget tests
// 2. Optional test routes
// =============================================================================

import 'package:flutter/material.dart';

Widget createTestHarness({
  required Widget child,
  Map<String, WidgetBuilder>? routes,
}) {
  return MaterialApp(home: child, routes: routes ?? const {});
}

Widget placeholderScreen(String label) {
  return Scaffold(body: Center(child: Text(label)));
}
