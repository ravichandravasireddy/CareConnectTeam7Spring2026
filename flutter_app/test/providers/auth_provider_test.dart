// =============================================================================
// AUTH PROVIDER UNIT TESTS
// =============================================================================
// SWEN 661 - Validates authentication flows and user roles.
//
// KEY CONCEPTS COVERED:
// 1. Initial unauthenticated state
// 2. Sign-in validation
// 3. Patient vs caregiver roles
// =============================================================================

import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/providers/auth_provider.dart';

void main() {
  group('AuthProvider', () {
    test('starts unauthenticated', () {
      final provider = AuthProvider();

      expect(provider.isAuthenticated, isFalse);
      expect(provider.userEmail, isNull);
      expect(provider.userName, isNull);
      expect(provider.userRole, isNull);
    });

    test('rejects invalid sign in', () async {
      final provider = AuthProvider();

      final result = await provider.signIn('invalid', 'short');

      expect(result, isFalse);
      expect(provider.isAuthenticated, isFalse);
    });

    test('signs in as patient with mock credentials', () async {
      final provider = AuthProvider();

      final result = await provider.signIn(
        'patient@careconnect.demo',
        'password123',
      );

      expect(result, isTrue);
      expect(provider.isAuthenticated, isTrue);
      expect(provider.userEmail, equals('patient@careconnect.demo'));
      expect(provider.userName, equals('Robert Williams'));
      expect(provider.userRole, equals(UserRole.patient));
    });

    test('signs in as caregiver with mock credentials', () async {
      final provider = AuthProvider();

      final result = await provider.signIn(
        'caregiver@careconnect.demo',
        'password123',
      );

      expect(result, isTrue);
      expect(provider.isAuthenticated, isTrue);
      expect(provider.userEmail, equals('caregiver@careconnect.demo'));
      expect(provider.userName, equals('Dr. Sarah Johnson'));
      expect(provider.userRole, equals(UserRole.caregiver));
    });

    test('rejects unknown email with valid password', () async {
      final provider = AuthProvider();

      final result = await provider.signIn('user@example.com', 'password123');

      expect(result, isFalse);
      expect(provider.isAuthenticated, isFalse);
    });

    test('registers and sets user data', () async {
      final provider = AuthProvider();

      final result = await provider.register(
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-123-4567',
        password: 'password123',
      );

      expect(result, isTrue);
      expect(provider.isAuthenticated, isTrue);
      expect(provider.userEmail, equals('jane@example.com'));
      expect(provider.userName, equals('Jane Doe'));
    });

    test('signOut clears user state', () async {
      final provider = AuthProvider();
      await provider.signIn('patient@careconnect.demo', 'password123');

      provider.signOut();

      expect(provider.isAuthenticated, isFalse);
      expect(provider.userEmail, isNull);
      expect(provider.userName, isNull);
      expect(provider.userRole, isNull);
    });

    test('clear resets user state', () async {
      final provider = AuthProvider();
      await provider.signIn('caregiver@careconnect.demo', 'password123');

      provider.clear();

      expect(provider.isAuthenticated, isFalse);
      expect(provider.userEmail, isNull);
      expect(provider.userName, isNull);
      expect(provider.userRole, isNull);
    });
  });
}
