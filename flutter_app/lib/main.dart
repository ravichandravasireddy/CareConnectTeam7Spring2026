import 'package:flutter/material.dart';
import 'theme/app_colors.dart';
import 'screens/welcome_screen.dart';
import 'screens/registration_screen.dart';
import 'screens/patient_dashboard_screen.dart';
import 'screens/messaging_thread_screen.dart';
import 'screens/patient_profile_screen.dart';
import 'screens/preferences_accessibility_screen.dart';

void main() {
  runApp(const CareConnectApp());
}

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CareConnect',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary600,
          primary: AppColors.primary600,
          secondary: AppColors.secondary500,
          tertiary: AppColors.accent500,
        ),
      ),
      home: const WelcomeScreen(),
      routes: {
        '/registration': (context) => const RegistrationScreen(),
        '/dashboard': (context) => const PatientDashboardScreen(),
        '/messaging': (context) => const MessagingThreadScreen(),
        '/profile': (context) => const PatientProfileScreen(),
        '/preferences': (context) => const PreferencesAccessibilityScreen(),
      },
    );
  }
}