import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/providers/auth_provider.dart';

void main() {
  group('AuthProvider', () {
    test('starts unauthenticated', () {
      final provider = AuthProvider();

      expect(provider.isAuthenticated, isFalse);
      expect(provider.userEmail, isNull);
      expect(provider.userName, isNull);
    });

    test('rejects invalid sign in', () async {
      final provider = AuthProvider();

      final result = await provider.signIn('invalid', 'short');

      expect(result, isFalse);
      expect(provider.isAuthenticated, isFalse);
    });

    test('signs in with valid credentials', () async {
      final provider = AuthProvider();

      final result = await provider.signIn('user@example.com', 'password123');

      expect(result, isTrue);
      expect(provider.isAuthenticated, isTrue);
      expect(provider.userEmail, equals('user@example.com'));
      expect(provider.userName, equals('Robert Williams'));
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
      await provider.signIn('user@example.com', 'password123');

      provider.signOut();

      expect(provider.isAuthenticated, isFalse);
      expect(provider.userEmail, isNull);
      expect(provider.userName, isNull);
    });

    test('clear resets user state', () async {
      final provider = AuthProvider();
      await provider.signIn('user@example.com', 'password123');

      provider.clear();

      expect(provider.isAuthenticated, isFalse);
      expect(provider.userEmail, isNull);
      expect(provider.userName, isNull);
    });
  });
}
