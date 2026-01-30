import 'package:flutter/material.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';

/// Provider for managing tasks app-wide
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
        date: DateTime(now.year, now.month, 5, 9, 0),
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      ),
      Task(
        id: '2',
        title: 'Physical Therapy',
        date: DateTime(now.year, now.month, 5, 10, 30),
        icon: Icons.fitness_center,
        iconBackground: AppColors.success100,
        iconColor: AppColors.success700,
      ),
      Task(
        id: '3',
        title: 'Doctor Appointment',
        date: DateTime(now.year, now.month, 12, 14, 0),
        icon: Icons.local_hospital,
        iconBackground: AppColors.error100,
        iconColor: AppColors.error700,
      ),
      Task(
        id: '4',
        title: 'Lab Results Review',
        date: DateTime(now.year, now.month, 12, 11, 0),
        icon: Icons.science,
        iconBackground: AppColors.info100,
        iconColor: AppColors.info700,
      ),
      Task(
        id: '5',
        title: 'Medication Refill',
        date: DateTime(now.year, now.month, 18, 15, 0),
        icon: Icons.medication_liquid,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      ),
      Task(
        id: '6',
        title: 'Morning Medication',
        date: DateTime(now.year, now.month, now.day, 9, 0),
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      ),
      Task(
        id: '7',
        title: 'Blood Pressure Check',
        date: DateTime(now.year, now.month, now.day, 14, 0),
        icon: Icons.monitor_heart,
        iconBackground: AppColors.error100,
        iconColor: AppColors.error700,
      ),
      Task(
        id: '8',
        title: 'Virtual Appointment',
        date: DateTime(now.year, now.month, now.day, 15, 0),
        icon: Icons.videocam,
        iconBackground: AppColors.accent100,
        iconColor: AppColors.accent600,
      ),
      Task(
        id: '9',
        title: 'Follow-up Call',
        date: DateTime(now.year, now.month, now.day + 1, 10, 0),
        icon: Icons.phone,
        iconBackground: AppColors.warning100,
        iconColor: AppColors.warning700,
      ),
    ]);
  }

  List<Task> getTasksForDate(DateTime date) {
    final dateOnly = DateTime(date.year, date.month, date.day);
    return _tasks
        .where((task) => task.dateOnly == dateOnly)
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

  void clearTasks() {
    _tasks.clear();
    notifyListeners();
  }
}
