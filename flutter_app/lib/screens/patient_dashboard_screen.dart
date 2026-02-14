import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';
import '../widgets/app_drawer.dart';


class PatientDashboardScreen extends StatelessWidget {
  const PatientDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userName = context.watch<AuthProvider>().userName ?? 'Patient';
    final firstName = userName.split(' ').isNotEmpty
        ? userName.split(' ').first
        : userName;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surfaceContainer,
      appBar: AppAppBar(
        title: 'Home',
        showNotificationBadge: true,
        onNotificationTap: () => Navigator.pushNamed(context, '/notifications'),
      ),
      drawer: const AppDrawer(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Welcome Card with Gradient
              Semantics(
                label: 'Good Morning, $firstName! Here\'s your health overview for today',
                header: true,
                readOnly: true,
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(context).colorScheme.primary,
                        Theme.of(
                          context,
                        ).colorScheme.primary.withValues(alpha: 0.7),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: ExcludeSemantics(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Good Morning, $firstName!',
                          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            color: Theme.of(context).colorScheme.onPrimary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "Here's your health overview for today",
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Theme.of(context).colorScheme.onPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Tasks and BP Cards
              Semantics(
                label: 'Health summary cards',
                container: true,
                child: Row(
                  children: [
                    Expanded(
                      child: _buildSummaryCard(
                        context,
                        icon: Icons.check_circle_outline,
                        iconColor: AppColors.success700,
                        iconBgColor: AppColors.success100,
                        title: 'Tasks',
                        value: '3/5',
                        subtitle: 'Completed today',
                        semanticLabel: 'Tasks: 3 out of 5 completed today',
                        semanticHint: 'Double tap to view all tasks',
                        onTap: () => Navigator.pushNamed(context, '/calendar'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        context,
                        icon: Icons.favorite_outline,
                        iconColor: AppColors.error500,
                        iconBgColor: AppColors.error100,
                        title: 'BP Today',
                        value: '120/80',
                        subtitle: 'Normal',
                        subtitleColor: AppColors.success700,
                        semanticLabel: 'Blood Pressure Today: 120 over 80, Normal',
                        semanticHint: 'Double tap to view health logs',
                        onTap: () => Navigator.pushNamed(context, '/health-logs'),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Upcoming Tasks Section Header
              Semantics(
                container: true,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Semantics(
                      header: true,
                      label: 'Upcoming Tasks',
                      child: Text(
                        'Upcoming Tasks',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                    ),
                    Semantics(
                      button: true,
                      label: 'View All Tasks',
                      hint: 'Double tap to view all tasks in calendar',
                      excludeSemantics: true,
                      child: TextButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/calendar');
                        },
                        child: Text(
                          'View All',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Medication Task
              _buildTaskCard(
                context,
                icon: Icons.medication,
                iconColor: Theme.of(context).colorScheme.onError,
                iconBgColor: Theme.of(context).colorScheme.error,
                title: 'Take\nMedication',
                subtitle: 'Metformin\n500mg',
                dueText: 'DUE IN 15 MIN',
                dueColor: AppColors.error700,
                bgColor: AppColors.error100,
                semanticLabel: 'Take Medication: Metformin 500 milligrams, Due in 15 minutes',
                semanticHint: 'Double tap to view medication details',
                isUrgent: true,
                onTap: () {
                  final task = Task(
                    id: 'medication-1',
                    title: 'Take Medication',
                    description: 'Metformin 500mg',
                    date: DateTime.now().add(const Duration(minutes: 15)),
                    icon: Icons.medication,
                    iconBackground: Theme.of(context).colorScheme.error,
                    iconColor: Theme.of(context).colorScheme.onError,
                  );
                  Navigator.pushNamed(
                    context,
                    '/task-details',
                    arguments: task,
                  );
                },
              ),
              const SizedBox(height: 12),

              // Blood Pressure Check Task
              _buildTaskCard(
                context,
                icon: Icons.favorite,
                iconColor: Theme.of(context).colorScheme.primary,
                iconBgColor: Theme.of(
                  context,
                ).colorScheme.primary.withValues(alpha: 0.1),
                title: 'Blood Pressure Check',
                subtitle: 'Due at 2:00 PM',
                showChevron: true,
                semanticLabel: 'Blood Pressure Check, Due at 2:00 PM',
                semanticHint: 'Double tap to view task details',
                onTap: () {
                  final task = Task(
                    id: 'bp-check-1',
                    title: 'Blood Pressure Check',
                    description: 'Record blood pressure',
                    date: DateTime.now().add(const Duration(hours: 2)),
                    icon: Icons.favorite,
                    iconBackground: Theme.of(
                      context,
                    ).colorScheme.primary.withValues(alpha: 0.1),
                    iconColor: Theme.of(context).colorScheme.primary,
                  );
                  Navigator.pushNamed(
                    context,
                    '/task-details',
                    arguments: task,
                  );
                },
              ),
              const SizedBox(height: 24),

              // Today's Appointments Header
              Semantics(
                header: true,
                label: "Today's Appointments",
                child: Text(
                  "Today's Appointments",
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              _buildAppointmentCard(
                context,
                title: 'Virtual Appointment',
                subtitle: 'Dr. Johnson • 3:00 PM',
                semanticLabel: 'Virtual Appointment with Dr. Johnson at 3:00 PM',
                semanticHint: 'Double tap to join video call',
                onTap: () {
                  Navigator.pushNamed(context, '/video-call');
                },
              ),
              const SizedBox(height: 24),

              // Quick Actions Section
              Semantics(
                label: 'Quick Actions',
                container: true,
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: _buildActionButton(
                            context,
                            icon: Icons.favorite_outline,
                            label: 'Log Health Data',
                            color: Theme.of(context).colorScheme.secondary,
                            semanticLabel: 'Log Health Data',
                            semanticHint: 'Double tap to record health measurements',
                            onTap: () {
                              Navigator.pushNamed(context, '/health-logs');
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildActionButton(
                            context,
                            icon: Icons.message_outlined,
                            label: 'Send Message',
                            color: Theme.of(context).colorScheme.primary,
                            semanticLabel: 'Send Message',
                            semanticHint: 'Double tap to send a message to your care team',
                            onTap: () {
                              Navigator.pushNamed(context, '/messaging');
                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Emergency SOS Button
              Semantics(
                button: true,
                label: 'Emergency SOS',
                hint: 'Double tap to call for emergency help',
                liveRegion: true,
                child: ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Emergency SOS'),
                        content: const Text('Are you experiencing an emergency?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                              Navigator.pushNamed(context, '/emergency-sos');
                            },
                            child: const Text('Yes, Call Help'),
                          ),
                        ],
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.error,
                    foregroundColor: Theme.of(context).colorScheme.onError,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 2,
                    minimumSize: const Size(double.infinity, 56),
                  ),
                  child: Semantics(
                    excludeSemantics: true,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.warning, size: 24),
                        const SizedBox(width: 8),
                        Text(
                          'Emergency SOS',
                          style: Theme.of(context).textTheme.headlineMedium
                              ?.copyWith(
                                color: Theme.of(context).colorScheme.onError,
                              ),
                        ),
                      ],
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
        currentIndex: kPatientNavHome,
        isPatient: true,
      ),
    );
  }

  Widget _buildSummaryCard(
    BuildContext context, {
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String title,
    required String value,
    required String subtitle,
    Color? subtitleColor,
    required String semanticLabel,
    required String semanticHint,
    VoidCallback? onTap,
  }) {
    final content = Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Semantics(
                label: '$title icon',
                image: true,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: iconBgColor,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: iconColor, size: 20),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style:
                (subtitleColor != null
                        ? Theme.of(context).textTheme.titleMedium
                        : Theme.of(context).textTheme.bodyMedium)
                    ?.copyWith(
                      color:
                          subtitleColor ??
                          Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
          ),
        ],
      ),
    );

    if (onTap == null) {
      return Semantics(
        label: semanticLabel,
        readOnly: true,
        child: ExcludeSemantics(child: content),
      );
    }

    return Semantics(
      button: true,
      label: semanticLabel,
      hint: semanticHint,
      excludeSemantics: true,
      child: Material(
        color: Theme.of(context).colorScheme.surface.withValues(alpha: 0),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: content,
        ),
      ),
    );
  }

  Widget _buildTaskCard(
    BuildContext context, {
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String title,
    required String subtitle,
    String? dueText,
    Color? dueColor,
    Color? bgColor,
    bool showChevron = false,
    required String semanticLabel,
    required String semanticHint,
    bool isUrgent = false,
    VoidCallback? onTap,
  }) {
    final content = Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor ?? Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isUrgent 
              ? Theme.of(context).colorScheme.error 
              : Theme.of(context).colorScheme.outline,
          width: isUrgent ? 2 : 1,
        ),
      ),
      child: Row(
        children: [
          Semantics(
            label: '${title.replaceAll('\n', ' ')} icon',
            image: true,
            child: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: iconBgColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface,
                    fontWeight: isUrgent ? FontWeight.bold : FontWeight.normal,
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
          if (dueText != null)
            Semantics(
              label: dueText.replaceAll('DUE IN', 'Due in'),
              readOnly: true,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: dueColor ?? Theme.of(context).colorScheme.outline,
                    width: 1,
                  ),
                ),
                child: Text(
                  dueText,
                  style: Theme.of(
                    context,
                  ).textTheme.labelSmall?.copyWith(
                    color: dueColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          if (showChevron)
            Semantics(
              label: 'Navigate',
              image: true,
              child: Icon(
                Icons.chevron_right,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
        ],
      ),
    );

    if (onTap == null) {
      return Semantics(
        label: semanticLabel,
        readOnly: true,
        child: ExcludeSemantics(child: content),
      );
    }

    return Semantics(
      button: true,
      label: semanticLabel,
      hint: semanticHint,
      excludeSemantics: true,
      child: Material(
        color: Theme.of(context).colorScheme.surface.withValues(alpha: 0),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: content,
        ),
      ),
    );
  }

  Widget _buildAppointmentCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required String semanticLabel,
    required String semanticHint,
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
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.tertiary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Theme.of(context).colorScheme.tertiary,
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Semantics(
                  label: 'Video call icon',
                  image: true,
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.tertiary,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.videocam,
                      color: Theme.of(context).colorScheme.onTertiary,
                      size: 24,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
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
                  button: true,
                  label: 'Join video call',
                  excludeSemantics: true,
                  child: IconButton(
                    onPressed: onTap,
                    icon: Icon(
                      Icons.videocam,
                      color: Theme.of(context).colorScheme.onTertiary,
                    ),
                    style: IconButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.tertiary,
                      minimumSize: const Size(48, 48),
                    ),
                    tooltip: 'Join video call',
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required String semanticLabel,
    required String semanticHint,
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
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Theme.of(context).colorScheme.outline,
                width: 1,
              ),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Semantics(
                  label: '$label icon',
                  image: true,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: color, size: 28),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}