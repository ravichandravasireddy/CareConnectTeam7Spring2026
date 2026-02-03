// =============================================================================
// PREFERENCES PROVIDER UNIT TESTS
// =============================================================================
// SWEN 661 - Verifies default values and preference toggle setters.
//
// KEY CONCEPTS COVERED:
// 1. Default settings
// 2. Toggle and setter updates
// =============================================================================

import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/providers/preferences_provider.dart';

void main() {
  group('PreferencesProvider', () {
    test('starts with default values', () {
      final provider = PreferencesProvider();

      expect(provider.isDarkMode, isFalse);
      expect(provider.isHighContrast, isFalse);
      expect(provider.textScale, equals(1.0));
      expect(provider.screenReaderEnabled, isTrue);
      expect(provider.reduceMotion, isFalse);
      expect(provider.largeTouchTargets, isTrue);
      expect(provider.boldText, isFalse);
      expect(provider.medicationReminders, isTrue);
      expect(provider.taskAlerts, isTrue);
      expect(provider.healthAlerts, isTrue);
      expect(provider.messageNotifications, isTrue);
      expect(provider.language, equals('English (US)'));
      expect(provider.timeFormat, equals('12-hour'));
      expect(provider.dateFormat, equals('MM/DD/YYYY'));
      expect(provider.biometricLogin, isTrue);
      expect(provider.dataSharing, isTrue);
    });

    test('toggles and setters update values', () {
      final provider = PreferencesProvider();

      provider.toggleDarkMode(true);
      provider.toggleHighContrast(true);
      provider.setTextScale(1.2);
      provider.toggleScreenReader(false);
      provider.toggleReduceMotion(true);
      provider.toggleLargeTouchTargets(false);
      provider.toggleBoldText(true);
      provider.toggleMedicationReminders(false);
      provider.toggleTaskAlerts(false);
      provider.toggleHealthAlerts(false);
      provider.toggleMessageNotifications(false);
      provider.setLanguage('Spanish');
      provider.setTimeFormat('24-hour');
      provider.setDateFormat('YYYY-MM-DD');
      provider.toggleBiometricLogin(false);
      provider.toggleDataSharing(false);

      expect(provider.isDarkMode, isTrue);
      expect(provider.isHighContrast, isTrue);
      expect(provider.textScale, equals(1.2));
      expect(provider.screenReaderEnabled, isFalse);
      expect(provider.reduceMotion, isTrue);
      expect(provider.largeTouchTargets, isFalse);
      expect(provider.boldText, isTrue);
      expect(provider.medicationReminders, isFalse);
      expect(provider.taskAlerts, isFalse);
      expect(provider.healthAlerts, isFalse);
      expect(provider.messageNotifications, isFalse);
      expect(provider.language, equals('Spanish'));
      expect(provider.timeFormat, equals('24-hour'));
      expect(provider.dateFormat, equals('YYYY-MM-DD'));
      expect(provider.biometricLogin, isFalse);
      expect(provider.dataSharing, isFalse);
    });

    test('savePreferences triggers notifyListeners', () async {
      final provider = PreferencesProvider();
      var notifyCount = 0;
      provider.addListener(() => notifyCount++);

      await provider.savePreferences();

      expect(notifyCount, greaterThan(0));
    });

    test('resetToDefaults restores defaults', () {
      final provider = PreferencesProvider();
      provider.toggleDarkMode(true);
      provider.toggleHighContrast(true);
      provider.setTextScale(1.5);
      provider.toggleScreenReader(false);
      provider.setLanguage('Spanish');

      provider.resetToDefaults();

      expect(provider.isDarkMode, isFalse);
      expect(provider.isHighContrast, isFalse);
      expect(provider.textScale, equals(1.0));
      expect(provider.screenReaderEnabled, isTrue);
      expect(provider.language, equals('English (US)'));
    });
  });
}
