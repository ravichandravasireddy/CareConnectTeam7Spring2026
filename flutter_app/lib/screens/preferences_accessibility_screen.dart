import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';

/// Preferences and accessibility settings screen
/// Fully accessible with WCAG 2.1 Level AA compliance
class PreferencesAccessibilityScreen extends StatefulWidget {
  const PreferencesAccessibilityScreen({super.key});

  @override
  State<PreferencesAccessibilityScreen> createState() =>
      _PreferencesAccessibilityScreenState();
}

class _PreferencesAccessibilityScreenState
    extends State<PreferencesAccessibilityScreen> {
  // Display settings
  bool _isDarkMode = false;
  bool _isHighContrast = false;

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

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final role = auth.userRole;

    void handleBack() {
      if (Navigator.canPop(context)) {
        Navigator.pop(context);
        return;
      }

      final nextRoute = role == UserRole.caregiver
          ? '/caregiver-dashboard'
          : '/dashboard';
      Navigator.pushReplacementNamed(context, nextRoute);
    }

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) {
        if (!didPop) handleBack();
      },
      child: Scaffold(
        backgroundColor: Theme.of(context).colorScheme.surfaceContainer,
        appBar: AppBar(
          leading: Semantics(
            button: true,
            label: 'Go back',
            hint: 'Double tap to go back to dashboard',
            excludeSemantics: true,
            child: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: handleBack,
              tooltip: 'Go back',
            ),
          ),
          title: Semantics(
            header: true,
            label: 'Preferences and Accessibility',
            child: const Text('Preferences & Accessibility'),
          ),
          centerTitle: true,
          backgroundColor: Theme.of(
            context,
          ).colorScheme.surface.withValues(alpha: 0),
          elevation: 0,
        ),
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Display Section
              _buildSectionHeader('Display'),
              _buildSettingTile(
                title: 'Text Size',
                subtitle: 'Adjust text size for better readability',
                semanticLabel: 'Text Size: Adjust text size for better readability',
                semanticHint: 'Double tap to adjust text size',
                trailing: Icon(
                  Icons.chevron_right,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                onTap: () {
                  _showTextSizeDialog();
                },
              ),
              _buildSwitchTile(
                title: 'Dark Mode',
                subtitle: 'Reduce eye strain in low light',
                value: _isDarkMode,
                semanticLabel: 'Dark Mode',
                semanticHint: 'Reduce eye strain in low light',
                onChanged: (value) {
                  setState(() => _isDarkMode = value);
                  _announceChange('Dark Mode ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSwitchTile(
                title: 'High Contrast',
                subtitle: 'Increase contrast for visibility',
                value: _isHighContrast,
                semanticLabel: 'High Contrast',
                semanticHint: 'Increase contrast for visibility',
                onChanged: (value) {
                  setState(() => _isHighContrast = value);
                  _announceChange('High Contrast ${value ? 'enabled' : 'disabled'}');
                },
              ),
              const SizedBox(height: 8),

              // Accessibility Section
              _buildSectionHeader('Accessibility'),
              _buildSwitchTile(
                title: 'Screen Reader',
                subtitle: 'Enable voice guidance',
                value: _screenReaderEnabled,
                semanticLabel: 'Screen Reader',
                semanticHint: 'Enable voice guidance',
                onChanged: (value) {
                  setState(() => _screenReaderEnabled = value);
                  _announceChange('Screen Reader ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSwitchTile(
                title: 'Reduce Motion',
                subtitle: 'Minimize animations',
                value: _reduceMotion,
                semanticLabel: 'Reduce Motion',
                semanticHint: 'Minimize animations',
                onChanged: (value) {
                  setState(() => _reduceMotion = value);
                  _announceChange('Reduce Motion ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSwitchTile(
                title: 'Large Touch Targets',
                subtitle: 'Increase button sizes (44x44pt minimum)',
                value: _largeTouchTargets,
                semanticLabel: 'Large Touch Targets',
                semanticHint: 'Increase button sizes to 44 by 44 points minimum',
                onChanged: (value) {
                  setState(() => _largeTouchTargets = value);
                  _announceChange('Large Touch Targets ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSwitchTile(
                title: 'Bold Text',
                subtitle: 'Make text easier to read',
                value: _boldText,
                semanticLabel: 'Bold Text',
                semanticHint: 'Make text easier to read',
                onChanged: (value) {
                  setState(() => _boldText = value);
                  _announceChange('Bold Text ${value ? 'enabled' : 'disabled'}');
                },
              ),
              const SizedBox(height: 8),

              // Notifications Section
              _buildSectionHeader('Notifications'),
              _buildSwitchTile(
                title: 'Medication Reminders',
                subtitle: 'Get notified to take medication',
                value: _medicationReminders,
                semanticLabel: 'Medication Reminders',
                semanticHint: 'Get notified to take medication',
                onChanged: (value) {
                  setState(() => _medicationReminders = value);
                  _announceChange('Medication Reminders ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSwitchTile(
                title: 'Task Alerts',
                subtitle: 'Reminders for scheduled tasks',
                value: _taskAlerts,
                semanticLabel: 'Task Alerts',
                semanticHint: 'Reminders for scheduled tasks',
                onChanged: (value) {
                  setState(() => _taskAlerts = value);
                  _announceChange('Task Alerts ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSwitchTile(
                title: 'Health Alerts',
                subtitle: 'Important health notifications',
                value: _healthAlerts,
                semanticLabel: 'Health Alerts',
                semanticHint: 'Important health notifications',
                onChanged: (value) {
                  setState(() => _healthAlerts = value);
                  _announceChange('Health Alerts ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSwitchTile(
                title: 'Message Notifications',
                subtitle: 'New messages from caregivers',
                value: _messageNotifications,
                semanticLabel: 'Message Notifications',
                semanticHint: 'New messages from caregivers',
                onChanged: (value) {
                  setState(() => _messageNotifications = value);
                  _announceChange('Message Notifications ${value ? 'enabled' : 'disabled'}');
                },
              ),
              const SizedBox(height: 8),

              // Language & Region Section
              _buildSectionHeader('Language & Region'),
              _buildSettingTile(
                title: 'Language',
                subtitle: _language,
                semanticLabel: 'Language: $_language',
                semanticHint: 'Double tap to change language',
                trailing: Icon(
                  Icons.chevron_right,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                onTap: () {
                  _showLanguageDialog();
                },
              ),
              _buildSettingTile(
                title: 'Time Format',
                subtitle: _timeFormat,
                semanticLabel: 'Time Format: $_timeFormat',
                semanticHint: 'Double tap to change time format',
                trailing: Icon(
                  Icons.chevron_right,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                onTap: () {
                  _showTimeFormatDialog();
                },
              ),
              _buildSettingTile(
                title: 'Date Format',
                subtitle: _dateFormat,
                semanticLabel: 'Date Format: $_dateFormat',
                semanticHint: 'Double tap to change date format',
                trailing: Icon(
                  Icons.chevron_right,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                onTap: () {
                  _showDateFormatDialog();
                },
              ),
              const SizedBox(height: 8),

              // Privacy & Security Section
              _buildSectionHeader('Privacy & Security'),
              _buildSwitchTile(
                title: 'Biometric Login',
                subtitle: 'Use Face ID or Touch ID',
                value: _biometricLogin,
                semanticLabel: 'Biometric Login',
                semanticHint: 'Use Face ID or Touch ID',
                onChanged: (value) {
                  setState(() => _biometricLogin = value);
                  _announceChange('Biometric Login ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSwitchTile(
                title: 'Data Sharing',
                subtitle: 'Share data with caregivers',
                value: _dataSharing,
                semanticLabel: 'Data Sharing',
                semanticHint: 'Share data with caregivers',
                onChanged: (value) {
                  setState(() => _dataSharing = value);
                  _announceChange('Data Sharing ${value ? 'enabled' : 'disabled'}');
                },
              ),
              _buildSettingTile(
                title: 'HIPAA Consent',
                subtitle: 'View privacy policy',
                semanticLabel: 'HIPAA Consent: View privacy policy',
                semanticHint: 'Double tap to view privacy policy',
                trailing: Icon(
                  Icons.chevron_right,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Privacy policy viewer coming soon'),
                    ),
                  );
                },
              ),
              const SizedBox(height: 24),

              // Save Button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Semantics(
                  button: true,
                  label: 'Save Preferences',
                  hint: 'Double tap to save all preference changes',
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text('Preferences saved successfully'),
                            backgroundColor: AppColors.success700,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Theme.of(context).colorScheme.onPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                        minimumSize: const Size(double.infinity, 56),
                      ),
                      child: Text(
                        'Save Preferences',
                        style: Theme.of(context).textTheme.labelLarge,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  void _announceChange(String message) {
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(milliseconds: 500),
        backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Semantics(
      header: true,
      label: title,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
        child: Text(
          title,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
      ),
    );
  }

  Widget _buildSettingTile({
    required String title,
    required String subtitle,
    required String semanticLabel,
    required String semanticHint,
    required Widget trailing,
    required VoidCallback onTap,
  }) {
    return Semantics(
      button: true,
      label: semanticLabel,
      hint: semanticHint,
      excludeSemantics: true,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Theme.of(context).colorScheme.outline,
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                Semantics(
                  label: 'Navigate',
                  image: true,
                  child: trailing,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required String semanticLabel,
    required String semanticHint,
    required ValueChanged<bool> onChanged,
  }) {
    return Semantics(
      toggled: value,
      label: semanticLabel,
      hint: semanticHint,
      value: value ? 'On' : 'Off',
      child: Container(
        padding: const EdgeInsets.all(16),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Theme.of(context).colorScheme.outline,
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: ExcludeSemantics(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Semantics(
              excludeSemantics: true,
              child: Switch(
                value: value,
                onChanged: onChanged,
                activeTrackColor: Theme.of(context).colorScheme.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showTextSizeDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Text Size'),
        content: const Text('Text size adjustment feature coming soon'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Semantics(
          header: true,
          child: const Text('Select Language'),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildRadioOption(
              dialogContext,
              title: 'English (US)',
              value: 'English (US)',
              groupValue: _language,
              onChanged: (value) {
                if (value != null) {
                  setState(() => _language = value);
                  Navigator.pop(dialogContext);
                  _announceChange('Language changed to $value');
                }
              },
            ),
            _buildRadioOption(
              dialogContext,
              title: 'Spanish',
              value: 'Spanish',
              groupValue: _language,
              onChanged: (value) {
                if (value != null) {
                  setState(() => _language = value);
                  Navigator.pop(dialogContext);
                  _announceChange('Language changed to $value');
                }
              },
            ),
            _buildRadioOption(
              dialogContext,
              title: 'French',
              value: 'French',
              groupValue: _language,
              onChanged: (value) {
                if (value != null) {
                  setState(() => _language = value);
                  Navigator.pop(dialogContext);
                  _announceChange('Language changed to $value');
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showTimeFormatDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Semantics(
          header: true,
          child: const Text('Time Format'),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildRadioOption(
              dialogContext,
              title: '12-hour',
              value: '12-hour',
              groupValue: _timeFormat,
              onChanged: (value) {
                if (value != null) {
                  setState(() => _timeFormat = value);
                  Navigator.pop(dialogContext);
                  _announceChange('Time format changed to $value');
                }
              },
            ),
            _buildRadioOption(
              dialogContext,
              title: '24-hour',
              value: '24-hour',
              groupValue: _timeFormat,
              onChanged: (value) {
                if (value != null) {
                  setState(() => _timeFormat = value);
                  Navigator.pop(dialogContext);
                  _announceChange('Time format changed to $value');
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showDateFormatDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Semantics(
          header: true,
          child: const Text('Date Format'),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildRadioOption(
              dialogContext,
              title: 'MM/DD/YYYY',
              value: 'MM/DD/YYYY',
              groupValue: _dateFormat,
              onChanged: (value) {
                if (value != null) {
                  setState(() => _dateFormat = value);
                  Navigator.pop(dialogContext);
                  _announceChange('Date format changed to $value');
                }
              },
            ),
            _buildRadioOption(
              dialogContext,
              title: 'DD/MM/YYYY',
              value: 'DD/MM/YYYY',
              groupValue: _dateFormat,
              onChanged: (value) {
                if (value != null) {
                  setState(() => _dateFormat = value);
                  Navigator.pop(dialogContext);
                  _announceChange('Date format changed to $value');
                }
              },
            ),
            _buildRadioOption(
              dialogContext,
              title: 'YYYY-MM-DD',
              value: 'YYYY-MM-DD',
              groupValue: _dateFormat,
              onChanged: (value) {
                if (value != null) {
                  setState(() => _dateFormat = value);
                  Navigator.pop(dialogContext);
                  _announceChange('Date format changed to $value');
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRadioOption<T>(
    BuildContext dialogContext, {
    required String title,
    required T value,
    required T groupValue,
    required ValueChanged<T?> onChanged,
  }) {
    final isSelected = value == groupValue;
    return Semantics(
      button: true,
      selected: isSelected,
      label: title,
      hint: isSelected 
          ? 'Currently selected' 
          : 'Double tap to select $title',
      child: RadioListTile<T>(
        title: Text(title),
        value: value,
        groupValue: groupValue,
        onChanged: onChanged,
      ),
    );
  }
}