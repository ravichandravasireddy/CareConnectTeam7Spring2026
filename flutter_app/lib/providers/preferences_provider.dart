import 'package:flutter/foundation.dart';

/// Preferences provider to manage app settings and accessibility options
class PreferencesProvider extends ChangeNotifier {
  // Display settings
  bool _isDarkMode = false;
  bool _isHighContrast = false;
  double _textScale = 1.0;

  // Accessibility settings
  bool _screenReaderEnabled = true;
  bool _reduceMotion = false;
  bool _largeTouchTargets = true;
  bool _boldText = false;

  // Notification settings
  bool _medicationReminders = true;
  bool _taskAlerts = true;
  bool _healthAlerts = true;
  bool _messageNotifications = true;

  // Language & Region
  String _language = 'English (US)';
  String _timeFormat = '12-hour';
  String _dateFormat = 'MM/DD/YYYY';

  // Privacy & Security
  bool _biometricLogin = true;
  bool _dataSharing = true;

  // Getters
  bool get isDarkMode => _isDarkMode;
  bool get isHighContrast => _isHighContrast;
  double get textScale => _textScale;
  bool get screenReaderEnabled => _screenReaderEnabled;
  bool get reduceMotion => _reduceMotion;
  bool get largeTouchTargets => _largeTouchTargets;
  bool get boldText => _boldText;
  bool get medicationReminders => _medicationReminders;
  bool get taskAlerts => _taskAlerts;
  bool get healthAlerts => _healthAlerts;
  bool get messageNotifications => _messageNotifications;
  String get language => _language;
  String get timeFormat => _timeFormat;
  String get dateFormat => _dateFormat;
  bool get biometricLogin => _biometricLogin;
  bool get dataSharing => _dataSharing;

  // Display settings methods
  void toggleDarkMode(bool value) {
    _isDarkMode = value;
    notifyListeners();
  }

  void toggleHighContrast(bool value) {
    _isHighContrast = value;
    notifyListeners();
  }

  void setTextScale(double scale) {
    _textScale = scale;
    notifyListeners();
  }

  // Accessibility settings methods
  void toggleScreenReader(bool value) {
    _screenReaderEnabled = value;
    notifyListeners();
  }

  void toggleReduceMotion(bool value) {
    _reduceMotion = value;
    notifyListeners();
  }

  void toggleLargeTouchTargets(bool value) {
    _largeTouchTargets = value;
    notifyListeners();
  }

  void toggleBoldText(bool value) {
    _boldText = value;
    notifyListeners();
  }

  // Notification settings methods
  void toggleMedicationReminders(bool value) {
    _medicationReminders = value;
    notifyListeners();
  }

  void toggleTaskAlerts(bool value) {
    _taskAlerts = value;
    notifyListeners();
  }

  void toggleHealthAlerts(bool value) {
    _healthAlerts = value;
    notifyListeners();
  }

  void toggleMessageNotifications(bool value) {
    _messageNotifications = value;
    notifyListeners();
  }

  // Language & Region methods
  void setLanguage(String lang) {
    _language = lang;
    notifyListeners();
  }

  void setTimeFormat(String format) {
    _timeFormat = format;
    notifyListeners();
  }

  void setDateFormat(String format) {
    _dateFormat = format;
    notifyListeners();
  }

  // Privacy & Security methods
  void toggleBiometricLogin(bool value) {
    _biometricLogin = value;
    notifyListeners();
  }

  void toggleDataSharing(bool value) {
    _dataSharing = value;
    notifyListeners();
  }

  /// Save all preferences (simulated - would save to SharedPreferences in real app)
  Future<void> savePreferences() async {
    // Simulate saving to storage
    await Future.delayed(const Duration(milliseconds: 500));
    notifyListeners();
  }

  /// Reset all preferences to defaults
  void resetToDefaults() {
    _isDarkMode = false;
    _isHighContrast = false;
    _textScale = 1.0;
    _screenReaderEnabled = true;
    _reduceMotion = false;
    _largeTouchTargets = true;
    _boldText = false;
    _medicationReminders = true;
    _taskAlerts = true;
    _healthAlerts = true;
    _messageNotifications = true;
    _language = 'English (US)';
    _timeFormat = '12-hour';
    _dateFormat = 'MM/DD/YYYY';
    _biometricLogin = true;
    _dataSharing = true;
    notifyListeners();
  }
}