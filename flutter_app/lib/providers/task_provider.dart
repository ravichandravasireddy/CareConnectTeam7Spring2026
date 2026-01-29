import 'package:flutter/material.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';

/// Provider for managing tasks app-wide
class TaskProvider with ChangeNotifier {
  final List<Task> _tasks = [];

  /// Get all tasks
  List<Task> get tasks => List.unmodifiable(_tasks);

  /// Initialize with mock data
  TaskProvider() {
    _initializeMockTasks();
  }

  /// Initialize with mock tasks for demonstration
  void _initializeMockTasks() {
    final now = DateTime.now();
    
    // Tasks for various dates in the current month
    _tasks.addAll([
      Task(
        id: '1',
        title: 'Morning Medication',
        time: '9:00 AM',
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
        date: DateTime(now.year, now.month, 5),
      ),
      Task(
        id: '2',
        title: 'Physical Therapy',
        time: '10:30 AM',
        icon: Icons.fitness_center,
        iconBackground: AppColors.success100,
        iconColor: AppColors.success700,
        date: DateTime(now.year, now.month, 5),
      ),
      Task(
        id: '3',
        title: 'Doctor Appointment',
        time: '2:00 PM',
        icon: Icons.local_hospital,
        iconBackground: AppColors.error100,
        iconColor: AppColors.error700,
        date: DateTime(now.year, now.month, 12),
      ),
      Task(
        id: '4',
        title: 'Lab Results Review',
        time: '11:00 AM',
        icon: Icons.science,
        iconBackground: AppColors.info100,
        iconColor: AppColors.info700,
        date: DateTime(now.year, now.month, 12),
      ),
      Task(
        id: '5',
        title: 'Medication Refill',
        time: '3:00 PM',
        icon: Icons.medication_liquid,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
        date: DateTime(now.year, now.month, 18),
      ),
      Task(
        id: '6',
        title: 'Morning Medication',
        time: '9:00 AM',
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
        date: DateTime(now.year, now.month, now.day),
      ),
      Task(
        id: '7',
        title: 'Blood Pressure Check',
        time: '2:00 PM',
        icon: Icons.monitor_heart,
        iconBackground: AppColors.error100,
        iconColor: AppColors.error700,
        date: DateTime(now.year, now.month, now.day),
      ),
      Task(
        id: '8',
        title: 'Virtual Appointment',
        time: '3:00 PM',
        icon: Icons.videocam,
        iconBackground: AppColors.accent100,
        iconColor: AppColors.accent600,
        date: DateTime(now.year, now.month, now.day),
      ),
      Task(
        id: '9',
        title: 'Follow-up Call',
        time: '10:00 AM',
        icon: Icons.phone,
        iconBackground: AppColors.warning100,
        iconColor: AppColors.warning700,
        date: DateTime(now.year, now.month, now.day + 1),
      ),
    ]);
  }

  /// Get tasks for a specific date
  List<Task> getTasksForDate(DateTime date) {
    return _tasks.where((task) {
      return task.date.year == date.year &&
          task.date.month == date.month &&
          task.date.day == date.day;
    }).toList()
      ..sort((a, b) => a.time.compareTo(b.time)); // Sort by time
  }

  /// Get tasks for a specific day of month (for backward compatibility)
  List<Task> getTasksForDay(int day, int month, int year) {
    return getTasksForDate(DateTime(year, month, day));
  }

  /// Check if a date has tasks
  bool hasTasksForDate(DateTime date) {
    return _tasks.any((task) {
      return task.date.year == date.year &&
          task.date.month == date.month &&
          task.date.day == date.day;
    });
  }

  /// Add a new task
  void addTask(Task task) {
    _tasks.add(task);
    notifyListeners();
  }

  /// Remove a task
  void removeTask(String taskId) {
    _tasks.removeWhere((task) => task.id == taskId);
    notifyListeners();
  }

  /// Update an existing task
  void updateTask(Task updatedTask) {
    final index = _tasks.indexWhere((task) => task.id == updatedTask.id);
    if (index != -1) {
      _tasks[index] = updatedTask;
      notifyListeners();
    }
  }

  /// Clear all tasks
  void clearTasks() {
    _tasks.clear();
    notifyListeners();
  }
}
