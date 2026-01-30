import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/task.dart';
import '../providers/task_provider.dart';

// =============================================================================
// CALENDAR SCREEN
// =============================================================================
// Month calendar with selectable date; task list shows only scheduled
// (incomplete) tasks for selected date via [TaskProvider.getScheduledTasksForDate].
// Dots on dates indicate [hasScheduledTasksForDate]. Navigate months with arrows.
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

  /// Get the last day of the month
  // DateTime get _lastDayOfMonth {
  //   final nextMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 1);
  //   return nextMonth.subtract(const Duration(days: 1));
  // }

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
    return date.month == _currentMonth.month &&
        date.year == _currentMonth.year;
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

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final taskProvider = Provider.of<TaskProvider>(context);
    
    final days = const ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    final calendarDates = _calendarDates;
    
    final selectedTasks = _selectedDate != null
        ? taskProvider.getScheduledTasksForDate(_selectedDate!)
        : <Task>[];

    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0.5,
        centerTitle: true,
        title: Text(
          'Calendar',
          style: TextStyle(
            color: colorScheme.onSurface,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.only(bottom: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Month header + calendar grid
                    Container(
                      decoration: BoxDecoration(
                        color: colorScheme.surface,
                        border: Border(
                          bottom: BorderSide(
                            color: colorScheme.outline,
                            width: 1,
                          ),
                        ),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Semantics(
                                label: 'Previous month',
                                button: true,
                                child: IconButton(
                                  icon: Icon(
                                    Icons.chevron_left,
                                    color: colorScheme.onSurfaceVariant,
                                    size: 28,
                                  ),
                                  onPressed: _previousMonth,
                                  style: IconButton.styleFrom(
                                    minimumSize: const Size(48, 48),
                                  ),
                                ),
                              ),
                              Semantics(
                                label: _monthYearText,
                                header: true,
                                child: Text(
                                  _monthYearText,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: colorScheme.onSurface,
                                  ),
                                ),
                              ),
                              Semantics(
                                label: 'Next month',
                                button: true,
                                child: IconButton(
                                  icon: Icon(
                                    Icons.chevron_right,
                                    color: colorScheme.onSurfaceVariant,
                                    size: 28,
                                  ),
                                  onPressed: _nextMonth,
                                  style: IconButton.styleFrom(
                                    minimumSize: const Size(48, 48),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          // Calendar grid
                          Semantics(
                            label: 'Calendar, $_monthYearText',
                            child: GridView.count(
                              crossAxisCount: 7,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              mainAxisSpacing: 4,
                              crossAxisSpacing: 4,
                              children: [
                                // Day headers
                                for (final day in days)
                                  Center(
                                    child: Text(
                                      day,
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: colorScheme.onSurfaceVariant,
                                      ),
                                    ),
                                  ),
                                // Date cells
                                for (final date in calendarDates)
                                  _buildDateCell(
                                    date,
                                    colorScheme: colorScheme,
                                    taskProvider: taskProvider,
                                    isSelected: _isSelected(date),
                                    onTap: () {
                                      if (_isCurrentMonth(date)) {
                                        setState(() {
                                          _selectedDate = date;
                                        });
                                      }
                                    },
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Semantics(
                        label: _selectedDateText,
                        header: true,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _selectedDateText,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: colorScheme.onSurface,
                              ),
                            ),
                            const SizedBox(height: 12),
                            if (selectedTasks.isEmpty && _selectedDate != null)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: colorScheme.surface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: colorScheme.outline,
                                  width: 1,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  'No tasks scheduled for this day',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ),
                            )
                          else
                            ...selectedTasks.map((task) => Padding(
                                  padding: const EdgeInsets.only(bottom: 12),
                                  child: _TaskCard(
                                    colorScheme: colorScheme,
                                    icon: task.icon,
                                    iconBackground: task.iconBackground,
                                    iconColor: task.iconColor,
                                    title: task.title,
                                    date: task.date,
                                  ),
                                )),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateCell(
    DateTime date, {
    required ColorScheme colorScheme,
    required TaskProvider taskProvider,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final isCurrentMonth = _isCurrentMonth(date);
    final isToday = _isToday(date);
    final hasTasks = taskProvider.hasScheduledTasksForDate(date);

    Color backgroundColor;
    Color textColor;
    Color borderColor = Colors.transparent;

    if (isToday) {
      backgroundColor = colorScheme.primary;
      textColor = colorScheme.onPrimary;
    } else if (isSelected && isCurrentMonth) {
      backgroundColor = Colors.transparent;
      textColor = colorScheme.onSurface;
      borderColor = colorScheme.primary;
    } else if (isCurrentMonth) {
      backgroundColor = Colors.transparent;
      textColor = colorScheme.onSurface;
    } else {
      backgroundColor = Colors.transparent;
      textColor = colorScheme.onSurfaceVariant.withValues(alpha: 0.6);
    }

    final parts = <String>['${date.day}'];
    if (isToday) parts.add('today');
    if (hasTasks) parts.add('has tasks');
    final semanticsLabel = parts.join(', ');

    return Semantics(
      label: semanticsLabel,
      hint: isCurrentMonth ? 'Tap to select' : null,
      button: true,
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
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: (isToday || isSelected) ? FontWeight.bold : FontWeight.normal,
                  color: textColor,
                ),
              ),
              if (hasTasks)
                Container(
                  margin: const EdgeInsets.only(top: 3),
                  width: 4,
                  height: 4,
                  decoration: BoxDecoration(
                    color: isToday ? colorScheme.onPrimary : colorScheme.primary,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TaskCard extends StatelessWidget {
  final ColorScheme colorScheme;
  final IconData icon;
  final Color iconBackground;
  final Color iconColor;
  final String title;
  final DateTime date;

  const _TaskCard({
    required this.colorScheme,
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    required this.title,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
    final timeLabel = DateFormat.jm().format(date);
    // Semantic label: title and formatted time from date
    return Semantics(
      label: '$title, $timeLabel',
      child: ExcludeSemantics(
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: colorScheme.outline,
              width: 1,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: iconBackground,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: iconColor,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: colorScheme.onSurface,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      timeLabel,
                      style: TextStyle(
                        fontSize: 13,
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
