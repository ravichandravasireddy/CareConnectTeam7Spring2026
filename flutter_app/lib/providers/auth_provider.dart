import 'package:flutter/foundation.dart';

/// Authentication provider to manage user login/logout state
class AuthProvider extends ChangeNotifier {
  String? _userEmail;
  String? _userName;
  bool _isAuthenticated = false;

  // Getters
  String? get userEmail => _userEmail;
  String? get userName => _userName;
  bool get isAuthenticated => _isAuthenticated;

  /// Sign in user
  Future<bool> signIn(String email, String password) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    // Basic validation
    if (email.isEmpty || !email.contains('@')) {
      return false;
    }
    if (password.isEmpty || password.length < 8) {
      return false;
    }

    // Set user data
    _userEmail = email;
    _userName = 'Robert Williams'; // Mock user name
    _isAuthenticated = true;
    notifyListeners();
    return true;
  }

  /// Register new user
  Future<bool> register({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String password,
  }) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    // Basic validation
    if (email.isEmpty || !email.contains('@')) {
      return false;
    }
    if (password.isEmpty || password.length < 8) {
      return false;
    }

    // Set user data
    _userEmail = email;
    _userName = '$firstName $lastName';
    _isAuthenticated = true;
    notifyListeners();
    return true;
  }

  /// Sign out user
  void signOut() {
    _userEmail = null;
    _userName = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  /// Clear user data
  void clear() {
    _userEmail = null;
    _userName = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}