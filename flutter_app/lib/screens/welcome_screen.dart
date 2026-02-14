import 'package:flutter/material.dart';
// import 'role_selection_screen.dart';
import 'navigation_hub_screen.dart';
// import '../theme/app_colors.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              colorScheme.primary,
              colorScheme.tertiary,
            ],
          ),
        ),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: constraints.maxHeight),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(height: constraints.maxHeight * 0.15),

                        // Decorative heart icon (excluded from screen readers)
                        ExcludeSemantics(
                          child: Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              color: colorScheme.surface,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              Icons.favorite,
                              size: 60,
                              color: colorScheme.primary,
                            ),
                          ),
                        ),

                        const SizedBox(height: 40),

                        // App Title as header
                        Semantics(
                          header: true,
                          child: Text(
                            'CareConnect',
                            style: textTheme.displayLarge?.copyWith(
                              color: colorScheme.onPrimary,
                            ),
                          ),
                        ),

                        const SizedBox(height: 16),

                        Text(
                          'Remote health management and coordination for patients and caregivers',
                          textAlign: TextAlign.center,
                          style: textTheme.titleLarge?.copyWith(
                            color: colorScheme.onPrimary.withValues(alpha: 0.9),
                          ),
                        ),

                        SizedBox(height: constraints.maxHeight * 0.15),

                        // Get Started Button
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: Semantics(
                            button: true,
                            label:
                                'Get started. Navigate to role selection screen.',
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.pushNamed(
                                    context, '/role-selection');
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: colorScheme.surface,
                                foregroundColor: colorScheme.primary,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                              child: Text(
                                'Get Started',
                                style: textTheme.headlineMedium?.copyWith(
                                  color: colorScheme.primary,
                                ),
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 16),

                        // Sign In Button
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: Semantics(
                            button: true,
                            label:
                                'Sign in to your existing CareConnect account.',
                            child: OutlinedButton(
                              onPressed: () {
                                Navigator.pushNamed(context, '/signin');
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: colorScheme.onPrimary,
                                side: BorderSide(
                                  color: colorScheme.onPrimary,
                                  width: 2,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: Text(
                                'Sign In',
                                style: textTheme.headlineMedium?.copyWith(
                                  color: colorScheme.onPrimary,
                                ),
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 32),

                        Text(
                          'HIPAA-compliant • Secure • Private',
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onPrimary
                                .withValues(alpha: 0.8),
                          ),
                        ),

                        const SizedBox(height: 24),

                        // Navigation Hub Button
                        Semantics(
                          button: true,
                          label: 'Open navigation hub screen.',
                          child: TextButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      const NavigationHubScreen(),
                                ),
                              );
                            },
                            child: Text(
                              'Open Navigation Hub',
                              style: textTheme.bodySmall?.copyWith(
                                color: colorScheme.onPrimary,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 16),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
