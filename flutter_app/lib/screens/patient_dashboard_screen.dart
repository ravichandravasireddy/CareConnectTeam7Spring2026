import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';
import '../widgets/app_drawer.dart';

/// Patient dashboard screen showing health overview and tasks
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
              Container(
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
              const SizedBox(height: 20),

              // Tasks and BP Cards
              Row(
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
                      onTap: () => Navigator.pushNamed(context, '/calendar'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      context,
                      icon: Icons.favorite_outline,
                      iconColor: AppColors.error700,
                      iconBgColor: AppColors.error100,
                      title: 'BP Today',
                      value: '120/80',
                      subtitle: 'Normal',
                      subtitleColor: AppColors.success700,
                      onTap: () => Navigator.pushNamed(context, '/health-logs'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Upcoming Tasks Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Upcoming Tasks',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  TextButton(
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
                ],
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

              // Today's Appointments
              Text(
                "Today's Appointments",
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 12),

              _buildAppointmentCard(
                context,
                title: 'Virtual Appointment',
                subtitle: 'Dr. Johnson • 3:00 PM',
                onTap: () {
                  Navigator.pushNamed(context, '/video-call');
                },
              ),
              const SizedBox(height: 24),

              // Quick Actions
              Row(
                children: [
                  Expanded(
                    child: _buildActionButton(
                      context,
                      icon: Icons.favorite_outline,
                      label: 'Log Health Data',
                      color: Theme.of(context).colorScheme.secondary,
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
                      onTap: () {
                        Navigator.pushNamed(context, '/messaging');
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Emergency SOS Button
              ElevatedButton(
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
                  elevation: 0,
                ),
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
    VoidCallback? onTap,
  }) {
    final content = Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).colorScheme.outline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: iconBgColor,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface,
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

    if (onTap == null) return content;

    return Material(
      color: Theme.of(context).colorScheme.surface.withValues(alpha: 0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: content,
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
    VoidCallback? onTap,
  }) {
    final content = Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor ?? Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).colorScheme.outline),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: iconBgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 24),
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
          if (dueText != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                dueText,
                style: Theme.of(
                  context,
                ).textTheme.labelSmall?.copyWith(color: dueColor),
              ),
            ),
          if (showChevron)
            Icon(
              Icons.chevron_right,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
        ],
      ),
    );

    if (onTap == null) return content;

    return Material(
      color: Theme.of(context).colorScheme.surface.withValues(alpha: 0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: content,
      ),
    );
  }

  Widget _buildAppointmentCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.tertiary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).colorScheme.tertiary),
      ),
      child: Row(
        children: [
          Container(
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
          IconButton(
            onPressed: onTap,
            icon: Icon(
              Icons.videocam,
              color: Theme.of(context).colorScheme.onTertiary,
            ),
            style: IconButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.tertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Theme.of(context).colorScheme.outline),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
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
    );
  }
}
