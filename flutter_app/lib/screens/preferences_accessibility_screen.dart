import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Preferences and accessibility settings screen
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
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surfaceContainer,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Preferences & Accessibility'),
        centerTitle: true,
        backgroundColor: Theme.of(context).colorScheme.surface.withValues(alpha: 0),
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
              trailing: Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurfaceVariant),
              onTap: () {
                _showTextSizeDialog();
              },
            ),
            _buildSwitchTile(
              title: 'Dark Mode',
              subtitle: 'Reduce eye strain in low light',
              value: _isDarkMode,
              onChanged: (value) {
                setState(() => _isDarkMode = value);
              },
            ),
            _buildSwitchTile(
              title: 'High Contrast',
              subtitle: 'Increase contrast for visibility',
              value: _isHighContrast,
              onChanged: (value) {
                setState(() => _isHighContrast = value);
              },
            ),
            const SizedBox(height: 8),

            // Accessibility Section
            _buildSectionHeader('Accessibility'),
            _buildSwitchTile(
              title: 'Screen Reader',
              subtitle: 'Enable voice guidance',
              value: _screenReaderEnabled,
              onChanged: (value) {
                setState(() => _screenReaderEnabled = value);
              },
            ),
            _buildSwitchTile(
              title: 'Reduce Motion',
              subtitle: 'Minimize animations',
              value: _reduceMotion,
              onChanged: (value) {
                setState(() => _reduceMotion = value);
              },
            ),
            _buildSwitchTile(
              title: 'Large Touch Targets',
              subtitle: 'Increase button sizes (44x44pt minimum)',
              value: _largeTouchTargets,
              onChanged: (value) {
                setState(() => _largeTouchTargets = value);
              },
            ),
            _buildSwitchTile(
              title: 'Bold Text',
              subtitle: 'Make text easier to read',
              value: _boldText,
              onChanged: (value) {
                setState(() => _boldText = value);
              },
            ),
            const SizedBox(height: 8),

            // Notifications Section
            _buildSectionHeader('Notifications'),
            _buildSwitchTile(
              title: 'Medication Reminders',
              subtitle: 'Get notified to take medication',
              value: _medicationReminders,
              onChanged: (value) {
                setState(() => _medicationReminders = value);
              },
            ),
            _buildSwitchTile(
              title: 'Task Alerts',
              subtitle: 'Reminders for scheduled tasks',
              value: _taskAlerts,
              onChanged: (value) {
                setState(() => _taskAlerts = value);
              },
            ),
            _buildSwitchTile(
              title: 'Health Alerts',
              subtitle: 'Important health notifications',
              value: _healthAlerts,
              onChanged: (value) {
                setState(() => _healthAlerts = value);
              },
            ),
            _buildSwitchTile(
              title: 'Message Notifications',
              subtitle: 'New messages from caregivers',
              value: _messageNotifications,
              onChanged: (value) {
                setState(() => _messageNotifications = value);
              },
            ),
            const SizedBox(height: 8),

            // Language & Region Section
            _buildSectionHeader('Language & Region'),
            _buildSettingTile(
              title: 'Language',
              subtitle: _language,
              trailing: Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurfaceVariant),
              onTap: () {
                _showLanguageDialog();
              },
            ),
            _buildSettingTile(
              title: 'Time Format',
              subtitle: _timeFormat,
              trailing: Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurfaceVariant),
              onTap: () {
                _showTimeFormatDialog();
              },
            ),
            _buildSettingTile(
              title: 'Date Format',
              subtitle: _dateFormat,
              trailing: Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurfaceVariant),
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
              onChanged: (value) {
                setState(() => _biometricLogin = value);
              },
            ),
            _buildSwitchTile(
              title: 'Data Sharing',
              subtitle: 'Share data with caregivers',
              value: _dataSharing,
              onChanged: (value) {
                setState(() => _dataSharing = value);
              },
            ),
            _buildSettingTile(
              title: 'HIPAA Consent',
              subtitle: 'View privacy policy',
              trailing: Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurfaceVariant),
              onTap: () {
                // TODO: Show privacy policy
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
                  ),
                  child: Text(
                    'Save Preferences',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
      child: Text(
        title,
        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: Theme.of(context).colorScheme.onSurface,
            ),
      ),
    );
  }

  Widget _buildSettingTile({
    required String title,
    required String subtitle,
    required Widget trailing,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Theme.of(context).colorScheme.outline),
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
            trailing,
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).colorScheme.outline),
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
          Switch(
            value: value,
            onChanged: onChanged,
            activeTrackColor: Theme.of(context).colorScheme.primary,
          ),
        ],
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
        title: const Text('Select Language'),
        content: RadioGroup<String>(
          groupValue: _language,
          onChanged: (value) {
            if (value != null) {
              setState(() => _language = value);
              Navigator.pop(dialogContext);
            }
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RadioListTile<String>(
                title: const Text('English (US)'),
                value: 'English (US)',
              ),
              RadioListTile<String>(
                title: const Text('Spanish'),
                value: 'Spanish',
              ),
              RadioListTile<String>(
                title: const Text('French'),
                value: 'French',
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showTimeFormatDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Time Format'),
        content: RadioGroup<String>(
          groupValue: _timeFormat,
          onChanged: (value) {
            if (value != null) {
              setState(() => _timeFormat = value);
              Navigator.pop(dialogContext);
            }
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RadioListTile<String>(
                title: const Text('12-hour'),
                value: '12-hour',
              ),
              RadioListTile<String>(
                title: const Text('24-hour'),
                value: '24-hour',
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDateFormatDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Date Format'),
        content: RadioGroup<String>(
          groupValue: _dateFormat,
          onChanged: (value) {
            if (value != null) {
              setState(() => _dateFormat = value);
              Navigator.pop(dialogContext);
            }
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RadioListTile<String>(
                title: const Text('MM/DD/YYYY'),
                value: 'MM/DD/YYYY',
              ),
              RadioListTile<String>(
                title: const Text('DD/MM/YYYY'),
                value: 'DD/MM/YYYY',
              ),
              RadioListTile<String>(
                title: const Text('YYYY-MM-DD'),
                value: 'YYYY-MM-DD',
              ),
            ],
          ),
        ),
      ),
    );
  }
}