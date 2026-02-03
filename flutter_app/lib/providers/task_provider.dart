import 'package:flutter/material.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';

// =============================================================================
// TASK PROVIDER
// =============================================================================
// Holds all [Task] entries; used by Calendar screen and [HealthTimelineProvider].
// Use [getScheduledTasksForDate] / [hasScheduledTasksForDate] for calendar (excludes
// completed tasks). Use [getTasksForDate] when completed tasks should be included.
// =============================================================================

/// Provider for managing tasks app-wide.
class TaskProvider with ChangeNotifier {
  final List<Task> _tasks = [];

  List<Task> get tasks => List.unmodifiable(_tasks);

  TaskProvider() {
    _initializeMockTasks();
  }

  void _initializeMockTasks() {
    final now = DateTime.now();

    _tasks.addAll([
      Task(
        id: '1',
        title: 'Morning Medication',
        description: 'Administer morning dose with water and log adherence.',
        date: DateTime(now.year, now.month, 5, 9, 0),
        patientName: 'Mary Johnson',
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      ),
      Task(
        id: '2',
        title: 'Physical Therapy',
        description: 'Guide light stretching and mobility exercises.',
        date: DateTime(now.year, now.month, 5, 10, 30),
        patientName: 'Robert Williams',
        icon: Icons.fitness_center,
        iconBackground: AppColors.success100,
        iconColor: AppColors.success700,
      ),
      Task(
        id: '3',
        title: 'Doctor Appointment',
        description: 'Prepare questions and bring updated medication list.',
        date: DateTime(now.year, now.month, 12, 14, 0),
        patientName: 'Maya Patel',
        icon: Icons.local_hospital,
        iconBackground: AppColors.error100,
        iconColor: AppColors.error700,
      ),
      Task(
        id: '4',
        title: 'Lab Results Review',
        description: 'Review latest lab results and note follow-up actions.',
        date: DateTime(now.year, now.month, 12, 11, 0),
        patientName: 'James Carter',
        icon: Icons.science,
        iconBackground: AppColors.info100,
        iconColor: AppColors.info700,
      ),
      Task(
        id: '5',
        title: 'Medication Refill',
        description: 'Contact pharmacy and confirm refill pickup time.',
        date: DateTime(now.year, now.month, 18, 15, 0),
        patientName: 'Mary Johnson',
        icon: Icons.medication_liquid,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      ),
      Task(
        id: '6',
        title: 'Morning Medication',
        description: 'Check dosage schedule and record completion.',
        date: DateTime(now.year, now.month, now.day, 9, 0),
        patientName: 'Robert Williams',
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      ),
      Task(
        id: '7',
        title: 'Blood Pressure Check',
        description: 'Measure BP and upload readings to the care plan.',
        date: DateTime(now.year, now.month, now.day, 14, 0),
        patientName: 'Maya Patel',
        icon: Icons.monitor_heart,
        iconBackground: AppColors.error100,
        iconColor: AppColors.error700,
      ),
      Task(
        id: '8',
        title: 'Virtual Appointment',
        description: 'Join video consult and summarize key outcomes.',
        date: DateTime(now.year, now.month, now.day, 15, 0),
        patientName: 'Mary Johnson',
        icon: Icons.videocam,
        iconBackground: AppColors.accent100,
        iconColor: AppColors.accent600,
      ),
      Task(
        id: '9',
        title: 'Follow-up Call',
        description: 'Call clinic to confirm next steps and reminders.',
        date: DateTime(now.year, now.month, now.day + 1, 10, 0),
        patientName: 'Robert Williams',
        icon: Icons.phone,
        iconBackground: AppColors.warning100,
        iconColor: AppColors.warning700,
      ),
      Task(
        id: '10',
        title: 'Follow-up Call',
        description: 'Confirm care plan updates and document notes.',
        date: DateTime(now.year, now.month, now.day, 10, 0),
        patientName: 'James Carter',
        icon: Icons.phone,
        iconBackground: AppColors.warning100,
        iconColor: AppColors.warning700,
        completedAt: DateTime(now.year, now.month, now.day, 11, 0),
      ),
      Task(
        id: '11',
        title: 'Video Call with Maya',
        description: 'Discuss today’s care updates and share next steps.',
        date: DateTime(now.year, now.month, 12, 11, 0),
        patientName: 'Maya Patel',
        icon: Icons.phone,
        iconBackground: AppColors.warning100,
        iconColor: AppColors.warning700,
        completedAt: DateTime(now.year, now.month, 12, 11, 0),
      ),
    ]);
  }

  List<Task> getTasksForDate(DateTime date) {
    final dateOnly = DateTime(date.year, date.month, date.day);
    return _tasks.where((task) => task.dateOnly == dateOnly).toList()
      ..sort((a, b) => a.date.compareTo(b.date));
  }

  /// Tasks for [date] that are not completed (scheduled only). Use for calendar.
  List<Task> getScheduledTasksForDate(DateTime date) {
    final dateOnly = DateTime(date.year, date.month, date.day);
    return _tasks
        .where((task) => task.dateOnly == dateOnly && task.completedAt == null)
        .toList()
      ..sort((a, b) => a.date.compareTo(b.date));
  }

  List<Task> getTasksForDay(int day, int month, int year) {
    return getTasksForDate(DateTime(year, month, day));
  }

  bool hasTasksForDate(DateTime date) {
    final dateOnly = DateTime(date.year, date.month, date.day);
    return _tasks.any((task) => task.dateOnly == dateOnly);
  }

  /// True if there are scheduled (incomplete) tasks for [date]. Use for calendar dots.
  bool hasScheduledTasksForDate(DateTime date) {
    final dateOnly = DateTime(date.year, date.month, date.day);
    return _tasks.any(
      (task) => task.dateOnly == dateOnly && task.completedAt == null,
    );
  }

  void addTask(Task task) {
    _tasks.add(task);
    notifyListeners();
  }

  void removeTask(String taskId) {
    _tasks.removeWhere((task) => task.id == taskId);
    notifyListeners();
  }

  void updateTask(Task updatedTask) {
    final index = _tasks.indexWhere((task) => task.id == updatedTask.id);
    if (index != -1) {
      _tasks[index] = updatedTask;
      notifyListeners();
    }
  }

  /// Mark a task as completed. Only completed tasks appear on the history timeline.
  void markCompleted(String taskId, [DateTime? at]) {
    final when = at ?? DateTime.now();
    final index = _tasks.indexWhere((task) => task.id == taskId);
    if (index != -1) {
      _tasks[index] = _tasks[index].copyWith(completedAt: when);
      notifyListeners();
    }
  }

  void clearTasks() {
    _tasks.clear();
    notifyListeners();
  }
}
