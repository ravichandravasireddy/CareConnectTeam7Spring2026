import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/task.dart';
import '../providers/task_provider.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';

// =============================================================================
// CALENDAR SCREEN - ACCESSIBLE VERSION
// =============================================================================
// Month calendar with selectable date; task list shows only scheduled
// (incomplete) tasks for selected date via [TaskProvider.getScheduledTasksForDate].
// Dots on dates indicate [hasScheduledTasksForDate]. Navigate months with arrows.
// WCAG 2.1 Level AA compliant with comprehensive accessibility support.
// =============================================================================

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  late DateTime _currentMonth; // The month/year being displayed
  DateTime? _selectedDate; // The selected date

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _currentMonth = DateTime(now.year, now.month, 1);
    _selectedDate = DateTime(now.year, now.month, now.day);
  }

  /// Get the first day of the month
  DateTime get _firstDayOfMonth => _currentMonth;

  /// Get the first day of the calendar grid (may include previous month)
  DateTime get _firstDayOfGrid {
    final firstDay = _firstDayOfMonth;
    // Get the weekday (0 = Sunday, 6 = Saturday)
    final weekday = firstDay.weekday % 7; // Convert Monday=1 to Sunday=0
    return firstDay.subtract(Duration(days: weekday));
  }

  /// Get all dates for the calendar grid (6 weeks = 42 days)
  List<DateTime> get _calendarDates {
    final dates = <DateTime>[];
    final start = _firstDayOfGrid;
    for (int i = 0; i < 42; i++) {
      dates.add(start.add(Duration(days: i)));
    }
    return dates;
  }

  /// Navigate to previous month
  void _previousMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1, 1);
    });
  }

  /// Navigate to next month
  void _nextMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 1);
    });
  }

  /// Check if a date is today
  bool _isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }

  /// Check if a date is in the current displayed month
  bool _isCurrentMonth(DateTime date) {
    return date.month == _currentMonth.month && date.year == _currentMonth.year;
  }

  /// Check if a date is selected
  bool _isSelected(DateTime date) {
    if (_selectedDate == null) return false;
    return date.year == _selectedDate!.year &&
        date.month == _selectedDate!.month &&
        date.day == _selectedDate!.day;
  }

  /// Format month/year for display
  String get _monthYearText {
    return DateFormat('MMMM yyyy').format(_currentMonth);
  }

  /// Format selected date for display
  String get _selectedDateText {
    if (_selectedDate == null) return 'Select a date to view tasks';
    return 'Tasks for ${DateFormat('MMMM d').format(_selectedDate!)}';
  }

  /// Breakpoint for side-by-side layout: calendar left (max 600px), tasks right.
  static const double _wideBreakpoint = 1000;
  static const double _calendarMaxWidth = 600;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final taskProvider = Provider.of<TaskProvider>(context);
    final width = MediaQuery.sizeOf(context).width;

    final days = const ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    final calendarDates = _calendarDates;

    final selectedTasks = _selectedDate != null
        ? taskProvider.getScheduledTasksForDate(_selectedDate!)
        : <Task>[];

    final calendarSection = _buildCalendarSection(
      context,
      colorScheme: colorScheme,
      textTheme: textTheme,
      taskProvider: taskProvider,
      days: days,
      calendarDates: calendarDates,
    );
    final tasksSection = _buildTasksSection(
      context,
      colorScheme: colorScheme,
      textTheme: textTheme,
      selectedTasks: selectedTasks,
    );

    final useWideLayout = width >= _wideBreakpoint;
    final calendarWidth = useWideLayout
        ? (width * 0.5).clamp(0.0, _calendarMaxWidth)
        : null;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: const AppAppBar(
        title: 'Calendar',
        showMenuButton: false,
        useBackButton: true,
      ),
      body: SafeArea(
        child: useWideLayout
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: calendarWidth,
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.only(bottom: 24),
                      child: calendarSection,
                    ),
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.only(
                        left: 16,
                        right: 16,
                        bottom: 24,
                      ),
                      child: tasksSection,
                    ),
                  ),
                ],
              )
            : SingleChildScrollView(
                padding: const EdgeInsets.only(bottom: 24),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(
                      maxWidth: _calendarMaxWidth,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [calendarSection, tasksSection],
                    ),
                  ),
                ),
              ),
      ),
      bottomNavigationBar: const AppBottomNavBar(
        currentIndex: kPatientNavTasks,
      ),
    );
  }

  Widget _buildCalendarSection(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
    required TaskProvider taskProvider,
    required List<String> days,
    required List<DateTime> calendarDates,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        border: Border(
          bottom: BorderSide(color: colorScheme.outline, width: 1),
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Semantics(
                button: true,
                label: 'Previous month',
                hint: 'Double tap to go to previous month',
                excludeSemantics: true,
                child: IconButton(
                  icon: Icon(
                    Icons.chevron_left,
                    color: colorScheme.onSurfaceVariant,
                    size: 28,
                  ),
                  onPressed: _previousMonth,
                  style: IconButton.styleFrom(minimumSize: const Size(48, 48)),
                  tooltip: 'Previous month',
                ),
              ),
              Semantics(
                header: true,
                label: _monthYearText,
                child: Text(
                  _monthYearText,
                  style: textTheme.headlineMedium?.copyWith(
                    color: colorScheme.onSurface,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Semantics(
                button: true,
                label: 'Next month',
                hint: 'Double tap to go to next month',
                excludeSemantics: true,
                child: IconButton(
                  icon: Icon(
                    Icons.chevron_right,
                    color: colorScheme.onSurfaceVariant,
                    size: 28,
                  ),
                  onPressed: _nextMonth,
                  style: IconButton.styleFrom(minimumSize: const Size(48, 48)),
                  tooltip: 'Next month',
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Semantics(
            label: 'Calendar, $_monthYearText',
            container: true,
            child: GridView.count(
              crossAxisCount: 7,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 4,
              crossAxisSpacing: 4,
              children: [
                for (final day in days)
                  Semantics(
                    header: true,
                    label: day,
                    child: Center(
                      child: Text(
                        day,
                        style: textTheme.labelSmall?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                for (final date in calendarDates)
                  _buildDateCell(
                    date,
                    colorScheme: colorScheme,
                    textTheme: textTheme,
                    taskProvider: taskProvider,
                    isSelected: _isSelected(date),
                    onTap: () {
                      if (_isCurrentMonth(date)) {
                        setState(() {
                          _selectedDate = date;
                        });
                        // Announce date selection
                        ScaffoldMessenger.of(context).clearSnackBars();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Selected ${DateFormat('MMMM d').format(date)}'),
                            duration: const Duration(milliseconds: 500),
                          ),
                        );
                      }
                    },
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTasksSection(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
    required List<Task> selectedTasks,
  }) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Semantics(
            header: true,
            label: '$_selectedDateText, ${selectedTasks.length} task${selectedTasks.length == 1 ? '' : 's'}',
            child: Text(
              _selectedDateText,
              style: textTheme.headlineSmall?.copyWith(
                color: colorScheme.onSurface,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Semantics(
            label: 'Tasks list for selected date, ${selectedTasks.length} task${selectedTasks.length == 1 ? '' : 's'}',
            container: true,
            child: selectedTasks.isEmpty && _selectedDate != null
                ? Semantics(
                    label: 'No tasks scheduled for this day',
                    readOnly: true,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: colorScheme.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: colorScheme.outline, width: 1),
                      ),
                      child: Center(
                        child: Text(
                          'No tasks scheduled for this day',
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ),
                  )
                : Column(
                    children: selectedTasks.map(
                      (task) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Semantics(
                          button: true,
                          label: 'Task: ${task.title}, ${DateFormat.jm().format(task.date)}',
                          hint: 'Double tap to view task details',
                          excludeSemantics: true,
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: () {
                                Navigator.pushNamed(
                                  context,
                                  '/task-details',
                                  arguments: task,
                                );
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: _TaskCard(
                                colorScheme: colorScheme,
                                textTheme: textTheme,
                                icon: task.icon,
                                iconBackground: task.iconBackground,
                                iconColor: task.iconColor,
                                title: task.title,
                                date: task.date,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ).toList(),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateCell(
    DateTime date, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
    required TaskProvider taskProvider,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final isCurrentMonth = _isCurrentMonth(date);
    final isToday = _isToday(date);
    final hasTasks = taskProvider.hasScheduledTasksForDate(date);

    Color backgroundColor;
    Color textColor;
    Color borderColor = colorScheme.surface.withValues(alpha: 0);

    if (isToday) {
      backgroundColor = colorScheme.primary;
      textColor = colorScheme.onPrimary;
    } else if (isSelected && isCurrentMonth) {
      backgroundColor = colorScheme.surface.withValues(alpha: 0);
      textColor = colorScheme.onSurface;
      borderColor = colorScheme.primary;
    } else if (isCurrentMonth) {
      backgroundColor = colorScheme.surface.withValues(alpha: 0);
      textColor = colorScheme.onSurface;
    } else {
      backgroundColor = colorScheme.surface.withValues(alpha: 0);
      textColor = colorScheme.onSurfaceVariant.withValues(alpha: 0.6);
    }

    // Build semantic label
    final formattedDate = DateFormat('EEEE, MMMM d').format(date);
    final parts = <String>[formattedDate];
    if (isToday) parts.add('today');
    if (isSelected) parts.add('selected');
    if (hasTasks) parts.add('has tasks');
    final semanticsLabel = parts.join(', ');

    return Semantics(
      button: true,
      label: semanticsLabel,
      hint: isCurrentMonth ? 'Double tap to select date and view tasks' : 'Not in current month',
      selected: isSelected,
      excludeSemantics: true,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: isCurrentMonth ? onTap : null,
          child: Container(
            constraints: const BoxConstraints(minHeight: 48, minWidth: 48),
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(10),
              border: isSelected && !isToday
                  ? Border.all(color: borderColor, width: 2)
                  : null,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  isCurrentMonth ? '${date.day}' : '',
                  style: (isToday || isSelected)
                      ? textTheme.titleMedium?.copyWith(
                          color: textColor,
                          fontWeight: FontWeight.bold,
                        )
                      : textTheme.bodySmall?.copyWith(color: textColor),
                ),
                if (hasTasks)
                  Semantics(
                    label: 'Task indicator',
                    image: true,
                    child: Container(
                      margin: const EdgeInsets.only(top: 3),
                      width: 4,
                      height: 4,
                      decoration: BoxDecoration(
                        color: isToday
                            ? colorScheme.onPrimary
                            : colorScheme.primary,
                        borderRadius: BorderRadius.circular(2),
                      ),
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

class _TaskCard extends StatelessWidget {
  final ColorScheme colorScheme;
  final TextTheme textTheme;
  final IconData icon;
  final Color iconBackground;
  final Color iconColor;
  final String title;
  final DateTime date;

  const _TaskCard({
    required this.colorScheme,
    required this.textTheme,
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    required this.title,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
    final timeLabel = DateFormat.jm().format(date);
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline, width: 1),
      ),
      child: Row(
        children: [
          Semantics(
            label: '$title icon',
            image: true,
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: iconBackground,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: textTheme.titleMedium?.copyWith(
                    color: colorScheme.onSurface,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  timeLabel,
                  style: textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}