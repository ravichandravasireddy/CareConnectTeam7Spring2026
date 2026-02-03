import 'package:flutter/foundation.dart';

/// User role for post-login navigation (patient vs caregiver workflow).
enum UserRole {
  patient,
  caregiver,
}

/// Authentication provider to manage user login/logout state.
/// Mock credentials: patient@careconnect.demo / password123 → patient dashboard;
/// caregiver@careconnect.demo / password123 → caregiver dashboard.
class AuthProvider extends ChangeNotifier {
  String? _userEmail;
  String? _userName;
  UserRole? _userRole;
  bool _isAuthenticated = false;

  // Getters
  String? get userEmail => _userEmail;
  String? get userName => _userName;
  UserRole? get userRole => _userRole;
  bool get isAuthenticated => _isAuthenticated;

  /// Mock login: patient@careconnect.demo → patient workflow; caregiver@careconnect.demo → caregiver workflow.
  static const String _mockPatientEmail = 'patient@careconnect.demo';
  static const String _mockCaregiverEmail = 'caregiver@careconnect.demo';
  static const String _mockPassword = 'password123';

  /// Sign in user. Returns true if credentials match mock patient or caregiver; otherwise false.
  Future<bool> signIn(String email, String password) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 800));

    // Basic validation
    if (email.isEmpty || !email.contains('@')) {
      return false;
    }
    if (password.isEmpty || password.length < 8) {
      return false;
    }

    final normalizedEmail = email.trim().toLowerCase();
    final normalizedPassword = password.trim();

    if (normalizedEmail == _mockPatientEmail && normalizedPassword == _mockPassword) {
      _userEmail = normalizedEmail;
      _userName = 'Robert Williams';
      _userRole = UserRole.patient;
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }
    if (normalizedEmail == _mockCaregiverEmail && normalizedPassword == _mockPassword) {
      _userEmail = normalizedEmail;
      _userName = 'Dr. Sarah Johnson';
      _userRole = UserRole.caregiver;
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }

    return false;
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
    _userRole = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  /// Clear user data
  void clear() {
    _userEmail = null;
    _userName = null;
    _userRole = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  /// Set user state for testing (e.g. widget tests that need AuthProvider above AppBottomNavBar).
  void setTestUser(UserRole role) {
    _userRole = role;
    _userEmail = role == UserRole.patient ? _mockPatientEmail : _mockCaregiverEmail;
    _userName = role == UserRole.patient ? 'Robert Williams' : 'Dr. Sarah Johnson';
    _isAuthenticated = true;
    notifyListeners();
  }
}
