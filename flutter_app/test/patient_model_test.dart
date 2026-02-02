import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/patient.dart';

void main() {
  test('Patient copyWith updates name', () {
    final patient = Patient(id: 'p1', name: 'Robert');

    final updated = patient.copyWith(name: 'Mary');

    expect(updated.name, 'Mary');
    expect(updated.id, 'p1');
  });
}
