import 'package:flutter/material.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';
import '../widgets/app_drawer.dart';

/// Patient profile screen showing personal and medical information
class PatientProfileScreen extends StatelessWidget {
  const PatientProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
                        'RW',
                        style: Theme.of(context).textTheme.displayLarge?.copyWith(
                          color: Theme.of(context).colorScheme.onSecondary,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Robert Williams',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Patient ID: #RW-2847',
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
                        foregroundColor: Theme.of(context).colorScheme.onPrimary,
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
              _buildInfoItem(
                context,
                label: 'Age',
                value: '67 years',
              ),
              _buildInfoItem(
                context,
                label: 'Email',
                value: 'robert.w@email.com',
              ),
              _buildInfoItem(
                context,
                label: 'Phone',
                value: '(555) 123-4567',
              ),
              _buildInfoItem(
                context,
                label: 'Address',
                value: '742 Evergreen Terrace\nSpringfield, IL 62701',
              ),

              const Divider(height: 1),

              // Medical Information Section
              _buildSectionHeader(context, 'Medical Information'),
              _buildInfoItem(
                context,
                label: 'Conditions',
                value: 'Diabetes, Hypertension',
              ),
              _buildInfoItem(
                context,
                label: 'Allergies',
                value: 'Penicillin, Shellfish',
              ),
              _buildInfoItem(
                context,
                label: 'Primary Care Provider',
                value: 'Dr. Sarah Johnson',
              ),
              _buildInfoItem(
                context,
                label: 'Emergency Contact',
                value: 'Mary Smith (Daughter)\n(555) 987-6543',
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
                iconColor: Colors.green,
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
                    side: BorderSide(color: Theme.of(context).colorScheme.error),
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
      bottomNavigationBar: const AppBottomNavBar(currentIndex: kPatientNavProfile, isPatient: true),
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
          Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurfaceVariant),
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
            Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurfaceVariant),
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
                  backgroundColor: Colors.green,
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
