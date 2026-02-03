import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';
import '../widgets/app_drawer.dart';

/// Patient profile screen showing personal and medical information
class PatientProfileScreen extends StatelessWidget {
  const PatientProfileScreen({super.key});

  String _initialsForName(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return '?';
    if (parts.length == 1) {
      final part = parts.first;
      return part.length >= 2
          ? part.substring(0, 2).toUpperCase()
          : part.toUpperCase();
    }
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final isCaregiver = auth.userRole == UserRole.caregiver;
    final displayName =
        auth.userName ??
        (isCaregiver ? 'Dr. Sarah Johnson' : 'Robert Williams');
    final displayEmail =
        auth.userEmail ??
        (isCaregiver ? 'sarah.johnson@careconnect.demo' : 'robert.w@email.com');
    final initials = _initialsForName(displayName);
    final profileId = isCaregiver
        ? 'Caregiver ID: #SJ-1024'
        : 'Patient ID: #RW-2847';
    final ageValue = isCaregiver ? '41 years' : '67 years';
    final phoneValue = isCaregiver ? '(555) 555-0183' : '(555) 123-4567';
    final addressValue = isCaregiver
        ? '1250 Health Ave\nRochester, NY 14620'
        : '742 Evergreen Terrace\nSpringfield, IL 62701';
    final conditionsValue = isCaregiver
        ? 'Primary Care'
        : 'Diabetes, Hypertension';
    final allergiesValue = isCaregiver ? 'N/A' : 'Penicillin, Shellfish';
    final primaryProviderLabel = isCaregiver
        ? 'Care Team Lead'
        : 'Primary Care Provider';
    final primaryProviderValue = isCaregiver
        ? 'Dr. Avery Chen'
        : 'Dr. Sarah Johnson';
    final emergencyContactValue = isCaregiver
        ? 'Operations Desk\n(555) 555-0199'
        : 'Mary Smith (Daughter)\n(555) 987-6543';

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surfaceContainer,
      appBar: AppAppBar(
        title: 'Profile',
        onNotificationTap: () => Navigator.pushNamed(context, '/notifications'),
      ),
      drawer: const AppDrawer(isPatient: true),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Profile Header
              Container(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: Theme.of(context).colorScheme.secondary,
                      child: Text(
                        initials,
                        style: Theme.of(context).textTheme.displayLarge
                            ?.copyWith(
                              color: Theme.of(context).colorScheme.onSecondary,
                            ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      displayName,
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      profileId,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        // TODO: Navigate to edit profile
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Edit profile feature coming soon'),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Theme.of(
                          context,
                        ).colorScheme.onPrimary,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(24),
                        ),
                        elevation: 0,
                      ),
                      child: const Text('Edit Profile'),
                    ),
                  ],
                ),
              ),

              const Divider(height: 1),

              // Personal Information Section
              _buildSectionHeader(context, 'Personal Information'),
              _buildInfoItem(context, label: 'Age', value: ageValue),
              _buildInfoItem(context, label: 'Email', value: displayEmail),
              _buildInfoItem(context, label: 'Phone', value: phoneValue),
              _buildInfoItem(context, label: 'Address', value: addressValue),

              const Divider(height: 1),

              // Medical Information Section
              _buildSectionHeader(context, 'Medical Information'),
              _buildInfoItem(
                context,
                label: 'Conditions',
                value: conditionsValue,
              ),
              _buildInfoItem(
                context,
                label: 'Allergies',
                value: allergiesValue,
              ),
              _buildInfoItem(
                context,
                label: primaryProviderLabel,
                value: primaryProviderValue,
              ),
              _buildInfoItem(
                context,
                label: 'Emergency Contact',
                value: emergencyContactValue,
              ),

              const Divider(height: 1),

              // Account Settings Section
              _buildSectionHeader(context, 'Account Settings'),
              _buildSettingItem(
                context,
                icon: Icons.settings,
                iconColor: Theme.of(context).colorScheme.primary,
                label: 'Preferences & Accessibility',
                onTap: () {
                  Navigator.pushNamed(context, '/preferences');
                },
              ),
              _buildSettingItem(
                context,
                icon: Icons.notifications,
                iconColor: Theme.of(context).colorScheme.tertiary,
                label: 'Notification Settings',
                onTap: () {
                  // TODO: Navigate to notification settings
                },
              ),
              _buildSettingItem(
                context,
                icon: Icons.people,
                iconColor: AppColors.success700,
                label: 'Connected Caregivers',
                onTap: () {
                  // TODO: Navigate to connected caregivers
                },
              ),

              const SizedBox(height: 16),

              // Sign Out Button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: OutlinedButton(
                  onPressed: () {
                    _showSignOutDialog(context);
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Theme.of(context).colorScheme.error,
                    side: BorderSide(
                      color: Theme.of(context).colorScheme.error,
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: SizedBox(
                    width: double.infinity,
                    child: Text(
                      'Sign Out',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(
        currentIndex: kPatientNavProfile,
        isPatient: true,
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
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

  Widget _buildInfoItem(
    BuildContext context, {
    required String label,
    required String value,
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
                  label,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            Icons.chevron_right,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ],
      ),
    );
  }

  Widget _buildSettingItem(
    BuildContext context, {
    required IconData icon,
    required Color iconColor,
    required String label,
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
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                label,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ],
        ),
      ),
    );
  }

  void _showSignOutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Handle sign out and navigate to sign in
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Signed out successfully'),
                  backgroundColor: AppColors.success700,
                ),
              );
            },
            child: Text(
              'Sign Out',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: Theme.of(context).colorScheme.error,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
