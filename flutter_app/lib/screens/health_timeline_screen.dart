import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/timeline_event.dart';
import '../providers/health_log_provider.dart';
import '../providers/note_provider.dart';
import '../providers/task_provider.dart';
import '../providers/health_timeline_provider.dart';
import '../widgets/app_bottom_nav_bar.dart';

// =============================================================================
// HEALTH TIMELINE SCREEN
// =============================================================================
// Unified timeline of health logs, notes, and completed tasks. Data comes from
// [HealthTimelineProvider.events]; screen watches HealthLog, Note, Task providers
// so it rebuilds when any change. Empty state shows message; otherwise
// [_TimelineBody] renders a vertical timeline with [_TimelineItem] cards.
// =============================================================================

/// Health Timeline screen: unified timeline of health logs, notes, and tasks.
class HealthTimelineScreen extends StatelessWidget {
  const HealthTimelineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final scaffoldBackground = theme.scaffoldBackgroundColor;

    // Rebuild when any of the three source providers change
    context.watch<HealthLogProvider>();
    context.watch<NoteProvider>();
    context.watch<TaskProvider>();

    final timelineProvider = context.read<HealthTimelineProvider>();
    final events = timelineProvider.events;

    if (events.isEmpty) {
      return Scaffold(
        backgroundColor: scaffoldBackground,
        appBar: AppBar(
          backgroundColor: colorScheme.surface,
          elevation: 0,
          centerTitle: true,
          title: Text(
            'Health Timeline',
            style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
          ),
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text(
                'No timeline events yet. Add health logs, notes, or tasks to see them here.',
                textAlign: TextAlign.center,
                style: textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ),
        ),
        bottomNavigationBar: const AppBottomNavBar(currentIndex: kPatientNavHealth),
      );
    }

    return Scaffold(
      backgroundColor: scaffoldBackground,
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Health Timeline',
          style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          child: _TimelineBody(events: events),
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(currentIndex: kPatientNavHealth),
    );
  }
}

class _TimelineBody extends StatelessWidget {
  final List<TimelineEvent> events;

  const _TimelineBody({required this.events});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: [
            // Vertical line
            Positioned(
              left: 23,
              top: 24,
              bottom: 24,
              child: Container(
                width: 2,
                color: colorScheme.outline,
              ),
            ),
            // Timeline items
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: events
                  .map((e) => Padding(
                        padding: const EdgeInsets.only(bottom: 24),
                        child: _TimelineItem(event: e),
                      ))
                  .toList(),
            ),
          ],
        );
      },
    );
  }
}

class _TimelineItem extends StatelessWidget {
  final TimelineEvent event;

  const _TimelineItem({required this.event});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final timeLabel = _formatTimestamp(event.timestamp);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Circle icon
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: event.iconBackground,
            shape: BoxShape.circle,
            border: Border.all(color: colorScheme.surface, width: 2),
            boxShadow: [
              BoxShadow(
                color: colorScheme.shadow.withValues(alpha: 0.08),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Icon(event.icon, color: event.iconColor, size: 24),
        ),
        const SizedBox(width: 16),
        // Card
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colorScheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: colorScheme.outline, width: 1),
              boxShadow: [
                BoxShadow(
                  color: colorScheme.shadow.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        event.title,
                        style: textTheme.titleMedium?.copyWith(
                          color: colorScheme.onSurface,
                        ),
                      ),
                    ),
                    Text(
                      timeLabel,
                      style: textTheme.labelSmall?.copyWith(
                        fontWeight: FontWeight.w400,
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
                if (event.subtitle != null && event.subtitle!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    event.subtitle!,
                    style: textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurface,
                      height: 1.35,
                    ),
                  ),
                ],
                if (event.statusLabel != null && event.statusLabel!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: colorScheme.secondaryContainer,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      event.statusLabel!,
                      style: textTheme.labelSmall?.copyWith(
                        fontSize: 11,
                        color: colorScheme.onSecondaryContainer,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }

  String _formatTimestamp(DateTime dateTime) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final eventDate = DateTime(dateTime.year, dateTime.month, dateTime.day);
    final timeStr = DateFormat.jm().format(dateTime);

    if (eventDate == today) {
      return 'Today, $timeStr';
    }
    if (eventDate == yesterday) {
      return 'Yesterday, $timeStr';
    }
    if (dateTime.year == now.year) {
      return '${DateFormat.MMMd().format(dateTime)}, $timeStr';
    }
    return '${DateFormat.yMMMd('en_US').format(dateTime)}, $timeStr';
  }
}
