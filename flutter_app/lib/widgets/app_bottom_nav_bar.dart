import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

// =============================================================================
// APP BOTTOM NAVIGATION BAR
// =============================================================================
// Reusable bottom nav: patient variant (Home, Tasks, Messages, Health, Profile)
// and caregiver variant (Home, Tasks, Analytics, Monitor). Pass [currentIndex]
// to highlight the active tab. Uses [AuthProvider.userRole] when [isPatient]
// is null to choose patient vs caregiver bar.
// =============================================================================

/// Patient nav indices: Home=0, Tasks=1, Messages=2, Health=3, Profile=4.
const int kPatientNavHome = 0;
const int kPatientNavTasks = 1;
const int kPatientNavMessages = 2;
const int kPatientNavHealth = 3;
const int kPatientNavProfile = 4;

/// Caregiver nav indices: Home=0, Tasks=1, Analytics=2, Monitor=3.
const int kCaregiverNavHome = 0;
const int kCaregiverNavTasks = 1;
const int kCaregiverNavAnalytics = 2;
const int kCaregiverNavMonitor = 3;

class AppBottomNavBar extends StatelessWidget {
  /// Which tab is currently active (0-based).
  final int currentIndex;

  /// If null, uses [AuthProvider.userRole] (patient → true, caregiver → false).
  final bool? isPatient;

  const AppBottomNavBar({
    super.key,
    required this.currentIndex,
    this.isPatient,
  });

  bool _isPatient(BuildContext context) {
    if (isPatient != null) return isPatient!;
    final role = context.read<AuthProvider>().userRole;
    return role == UserRole.patient;
  }

  /// Keep home on stack so back button returns to dashboard instead of black screen.
  static const String _patientHomeRoute = '/dashboard';
  static const String _caregiverHomeRoute = '/caregiver-dashboard';

  void _navigateTo(BuildContext context, String route, bool isPatient) {
    final homeRoute = isPatient ? _patientHomeRoute : _caregiverHomeRoute;
    Navigator.pushNamedAndRemoveUntil(
      context,
      route,
      (route) => route.settings.name == homeRoute,
    );
  }

  void _onTapPatient(BuildContext context, int index) {
    if (index == currentIndex) return;
    final isPatient = true;
    switch (index) {
      case kPatientNavHome:
        _navigateTo(context, '/dashboard', isPatient);
        break;
      case kPatientNavTasks:
        _navigateTo(context, '/calendar', isPatient);
        break;
      case kPatientNavMessages:
        _navigateTo(context, '/messaging', isPatient);
        break;
      case kPatientNavHealth:
        _navigateTo(context, '/health-timeline', isPatient);
        break;
      case kPatientNavProfile:
        _navigateTo(context, '/profile', isPatient);
        break;
    }
  }

  void _onTapCaregiver(BuildContext context, int index) {
    if (index == currentIndex) return;
    final isPatient = false;
    switch (index) {
      case kCaregiverNavHome:
        _navigateTo(context, '/caregiver-dashboard', isPatient);
        break;
      case kCaregiverNavTasks:
        _navigateTo(context, '/caregiver-task-management', isPatient);
        break;
      case kCaregiverNavAnalytics:
        _navigateTo(context, '/caregiver-analytics', isPatient);
        break;
      case kCaregiverNavMonitor:
        _navigateTo(context, '/caregiver-patient-monitoring', isPatient);
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final usePatient = _isPatient(context);

    return Container(
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: colorScheme.outline.withValues(alpha: 0.5)),
        ),
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex.clamp(0, usePatient ? 4 : 3),
        onTap: (index) => usePatient ? _onTapPatient(context, index) : _onTapCaregiver(context, index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: colorScheme.primary,
        unselectedItemColor: colorScheme.onSurfaceVariant,
        selectedFontSize: 12,
        unselectedFontSize: 12,
        items: usePatient ? _patientItems : _caregiverItems,
      ),
    );
  }

  static const List<BottomNavigationBarItem> _patientItems = [
    BottomNavigationBarItem(
      icon: Icon(Icons.home_outlined),
      activeIcon: Icon(Icons.home),
      label: 'Home',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.calendar_today_outlined),
      activeIcon: Icon(Icons.calendar_today),
      label: 'Tasks',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.message_outlined),
      activeIcon: Icon(Icons.message),
      label: 'Messages',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.favorite_outline),
      activeIcon: Icon(Icons.favorite),
      label: 'Health',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.person_outline),
      activeIcon: Icon(Icons.person),
      label: 'Profile',
    ),
  ];

  static const List<BottomNavigationBarItem> _caregiverItems = [
    BottomNavigationBarItem(
      icon: Icon(Icons.home_outlined),
      activeIcon: Icon(Icons.home),
      label: 'Home',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.checklist_outlined),
      activeIcon: Icon(Icons.checklist),
      label: 'Tasks',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.analytics_outlined),
      activeIcon: Icon(Icons.analytics),
      label: 'Analytics',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.monitor_heart_outlined),
      activeIcon: Icon(Icons.monitor_heart),
      label: 'Monitor',
    ),
  ];
}
