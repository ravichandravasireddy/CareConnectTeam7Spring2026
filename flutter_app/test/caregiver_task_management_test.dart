import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/caregiver_task_management_screen.dart';
import 'test_helpers.dart';

void main() {
  testWidgets('Task management shows filters and tasks', (tester) async {
    await tester.pumpWidget(
      buildTestApp(const CaregiverTaskManagementScreen()),
    );

    expect(find.text('Task Management'), findsOneWidget);
    expect(find.text('All'), findsOneWidget);
    expect(find.text('Today'), findsOneWidget);
    expect(find.text('Completed'), findsOneWidget);
    expect(find.text('Medication check'), findsOneWidget);
  });
}
