import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
// import 'screens/welcome_screen.dart';
import 'screens/temporary_screen.dart';
import 'theme/app_colors.dart';
import 'theme/app_typography.dart';
import 'providers/task_provider.dart';
import 'providers/notification_provider.dart';
import 'providers/note_provider.dart';
import 'providers/health_log_provider.dart';
import 'providers/health_timeline_provider.dart';

// =============================================================================
// MAIN ENTRY & APP SHELL
// =============================================================================
// Registers all providers (Task, Notification, Note, HealthLog, HealthTimeline)
// and configures MaterialApp theme (light/dark from [AppColors]). Change [home]
// to switch the initial screen; uncomment imports above for other screens.
// =============================================================================

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TaskProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
        ChangeNotifierProvider(create: (_) => NoteProvider()),
        ChangeNotifierProvider(create: (_) => HealthLogProvider()),
        ProxyProvider3<HealthLogProvider, NoteProvider, TaskProvider,
            HealthTimelineProvider>(
          update: (_, health, note, task, _) =>
              HealthTimelineProvider(
                healthLogProvider: health,
                noteProvider: note,
                taskProvider: task,
              ),
        ),
      ],
      child: MaterialApp(
        title: 'CareConnect',
        themeMode: ThemeMode.system,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: const ColorScheme(
            brightness: Brightness.light,
            primary: AppColors.primary600,
            onPrimary: AppColors.white,
            primaryContainer: AppColors.primary700,
            onPrimaryContainer: AppColors.white,
            secondary: AppColors.secondary700,
            onSecondary: AppColors.white,
            secondaryContainer: AppColors.secondary700,
            onSecondaryContainer: AppColors.white,
            tertiary: AppColors.accent500,
            onTertiary: AppColors.white,
            tertiaryContainer: AppColors.accent600,
            onTertiaryContainer: AppColors.white,
            error: AppColors.error700,
            onError: AppColors.white,
            errorContainer: AppColors.error700,
            onErrorContainer: AppColors.white,
            surface: AppColors.white,
            onSurface: AppColors.gray900,
            surfaceContainer: AppColors.gray100,
            onSurfaceVariant: AppColors.gray700,
            outline: AppColors.gray300,
            shadow: Colors.black,
            inverseSurface: AppColors.gray900,
            onInverseSurface: AppColors.white,
            inversePrimary: AppColors.primary100,
          ),
          scaffoldBackgroundColor: AppColors.gray100,
          focusColor: AppColors.primary600,
          textTheme: appTextTheme(
            ThemeData.light().textTheme,
            AppColors.gray900,
          ),
        ),
        darkTheme: ThemeData(
          useMaterial3: true,
          colorScheme: const ColorScheme(
            brightness: Brightness.dark,
            primary: AppColors.primary600,
            onPrimary: AppColors.white,
            primaryContainer: AppColors.darkBgElevated,
            onPrimaryContainer: AppColors.darkTextPrimary,
            secondary: AppColors.secondary600,
            onSecondary: AppColors.white,
            secondaryContainer: AppColors.darkBgElevated,
            onSecondaryContainer: AppColors.darkTextPrimary,
            tertiary: AppColors.accent500,
            onTertiary: AppColors.white,
            tertiaryContainer: AppColors.darkBgElevated,
            onTertiaryContainer: AppColors.darkTextPrimary,
            error: AppColors.error700,
            onError: AppColors.white,
            errorContainer: AppColors.error700,
            onErrorContainer: AppColors.white,
            surface: AppColors.darkBgSecondary,
            onSurface: AppColors.darkTextPrimary,
            surfaceContainer: AppColors.darkBgElevated,
            onSurfaceVariant: AppColors.darkTextSecondary,
            outline: AppColors.darkBorder,
            shadow: Colors.black,
            inverseSurface: AppColors.white,
            onInverseSurface: AppColors.gray900,
            inversePrimary: AppColors.primary100,
          ),
          scaffoldBackgroundColor: AppColors.darkBgPrimary,
          focusColor: AppColors.primary500,
          textTheme: appTextTheme(
            ThemeData.dark().textTheme,
            AppColors.darkTextPrimary,
          ),
        ),
        home: const TemporaryScreen(),
      ),
    );
  }
}
