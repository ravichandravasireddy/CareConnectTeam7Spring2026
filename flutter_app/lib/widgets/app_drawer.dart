import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

// =============================================================================
// APP DRAWER
// =============================================================================
// Reusable drawer with role-based links.
// Patient: Home, Tasks, Messages, Health Logs, Health Timeline, Profile, Notes, Preferences.
// Caregiver: Dashboard, Patient, Task, Analytics, Notes, Messages, Profile, Preferences.
// Uses [AuthProvider] for user name/email and sign out.
// =============================================================================

class AppDrawer extends StatelessWidget {
  /// If null, uses [AuthProvider.userRole] (patient vs caregiver).
  final bool? isPatient;

  const AppDrawer({super.key, this.isPatient});

  bool _isPatient(BuildContext context) {
    if (isPatient != null) return isPatient!;
    final role = context.read<AuthProvider>().userRole;
    return role == UserRole.patient;
  }

  static String _initials(String? name) {
    if (name == null || name.isEmpty) return '?';
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length == 1) {
      final s = parts[0];
      return s.length >= 2 ? s.substring(0, 2).toUpperCase() : s.toUpperCase();
    }
    return (parts.first[0] + parts.last[0]).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final patient = _isPatient(context);
    final displayName = auth.userName ?? 'User';
    final email = auth.userEmail ?? '';

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Theme.of(context).colorScheme.onPrimary,
                  child: Text(
                    _initials(displayName),
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  displayName,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (email.isNotEmpty)
                  Text(
                    email,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onPrimary,
                      fontSize: 14,
                    ),
                  ),
              ],
            ),
          ),
          if (patient) ..._patientTiles(context),
          if (!patient) ..._caregiverTiles(context),
          const Divider(),
          ListTile(
            leading: Icon(Icons.logout, color: Theme.of(context).colorScheme.error),
            title: Text(
              'Sign Out',
              style: TextStyle(color: Theme.of(context).colorScheme.error, fontWeight: FontWeight.w600),
            ),
            onTap: () {
              Navigator.pop(context);
              auth.signOut();
              Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
            },
          ),
        ],
      ),
    );
  }

  List<Widget> _patientTiles(BuildContext context) {
    return [
      _drawerTile(context, Icons.home, 'Home', () => _popAndPush(context, '/dashboard')),
      _drawerTile(context, Icons.task_alt, 'Tasks', () => _popAndPush(context, '/calendar')),
      _drawerTile(context, Icons.message_outlined, 'Messages', () => _popAndPush(context, '/messaging')),
      _drawerTile(context, Icons.favorite_outline, 'Health Logs', () => _popAndPush(context, '/health-logs')),
      _drawerTile(context, Icons.timeline, 'Health Timeline', () => _popAndPush(context, '/health-timeline')),
      _drawerTile(context, Icons.person_outline, 'Profile', () => _popAndPush(context, '/profile')),
      _drawerTile(context, Icons.note_outlined, 'Notes', () => _popAndPush(context, '/notes')),
      _drawerTile(context, Icons.settings_outlined, 'Preferences', () => _popAndPush(context, '/preferences')),
    ];
  }

  List<Widget> _caregiverTiles(BuildContext context) {
    return [
      _drawerTile(context, Icons.dashboard_outlined, 'Dashboard', () => _popAndPush(context, '/caregiver-dashboard')),
      _drawerTile(context, Icons.people_outline, 'Patient', () => _popAndPush(context, '/caregiver-patient-monitoring')),
      _drawerTile(context, Icons.task_alt, 'Task', () => _popAndPush(context, '/caregiver-task-management')),
      _drawerTile(context, Icons.analytics_outlined, 'Analytics', () => _popAndPush(context, '/caregiver-analytics')),
      _drawerTile(context, Icons.note_outlined, 'Notes', () => _popAndPush(context, '/notes')),
      _drawerTile(context, Icons.message_outlined, 'Messages', () => _popAndPush(context, '/messaging')),
      _drawerTile(context, Icons.person_outline, 'Profile', () => _popAndPush(context, '/profile')),
      _drawerTile(context, Icons.settings_outlined, 'Preferences', () => _popAndPush(context, '/preferences')),
    ];
  }

  Widget _drawerTile(BuildContext context, IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      onTap: onTap,
    );
  }

  /// Close drawer, then push [route] on top of the current screen so the app
  /// bar back button (or system back) returns to the previous screen. Pushing
  /// in a post-frame callback ensures the drawer route is fully popped before
  /// we push, avoiding a black screen when going back.
  void _popAndPush(BuildContext context, String route) {
    final navigator = Navigator.of(context);
    navigator.pop(); // close drawer (pops drawer route only)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      navigator.pushNamed(route); // push on stack so back works
    });
  }
}
