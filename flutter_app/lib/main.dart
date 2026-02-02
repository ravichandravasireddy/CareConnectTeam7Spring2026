import 'package:flutter/material.dart';
import 'screens/welcome_screen.dart';
import 'screens/registration_screen.dart';
import 'screens/patient_dashboard_screen.dart';
import 'screens/messaging_thread_screen.dart';
import 'screens/patient_profile_screen.dart';
import 'screens/preferences_accessibility_screen.dart';
import 'screens/role_selection_screen.dart';
import 'theme/app_colors.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/preferences_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => PreferencesProvider()),
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
          textTheme: ThemeData.light().textTheme.apply(
                bodyColor: AppColors.gray900,
                displayColor: AppColors.gray900,
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
          textTheme: ThemeData.dark().textTheme.apply(
                bodyColor: AppColors.darkTextPrimary,
                displayColor: AppColors.darkTextPrimary,
              ),
        ),
        home: const WelcomeScreen(),
        routes: {
          '/registration': (context) => const RegistrationScreen(),
          '/role-selection': (context) => const RoleSelectionScreen(),
          '/dashboard': (context) => const PatientDashboardScreen(),
          '/messaging': (context) => const MessagingThreadScreen(),
          '/profile': (context) => const PatientProfileScreen(),
          '/preferences': (context) => const PreferencesAccessibilityScreen(),
        },
      ),
    );
  }
}