import 'package:flutter/material.dart';
import 'role_selection_screen.dart';
import '../theme/app_colors.dart';

// =============================================================================
// WELCOME SCREEN
// =============================================================================
// Entry landing: gradient background, app title, and CTA to [RoleSelectionScreen].
// =============================================================================

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return Scaffold(
      body: Container(
        // Gradient background matching your Figma design
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).colorScheme.primary, // Bright blue
              Theme.of(context).colorScheme.tertiary, // Purple
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
                        // Flexible space so content stays centered when scrollable
                        SizedBox(height: constraints.maxHeight * 0.15),

                        // Heart Icon in white circle
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.onInverseSurface,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.favorite,
                    size: 60,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),

                SizedBox(height: 40),

                // App Title
                Text(
                  'CareConnect',
                  style: textTheme.displayLarge?.copyWith(
                    fontSize: 48,
                    color: colorScheme.onPrimary,
                  ),
                ),

                        SizedBox(height: 16),

                        // Description
                Text(
                  'Remote health management and coordination for patients and caregivers',
                  textAlign: TextAlign.center,
                  style: textTheme.titleLarge?.copyWith(
                    color: AppColors.gray300,
                    height: 1.5,
                  ),
                        ),

                        SizedBox(height: constraints.maxHeight * 0.15),

                        // Get Started Button (Primary)
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      // Navigate to role selection screen
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => RoleSelectionScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.onInverseSurface,
                      foregroundColor: Theme.of(context).colorScheme.primary,
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

                        SizedBox(height: 16),

                        // Sign In Button (Outlined)
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: OutlinedButton(
                    onPressed: () {
                      // TODO: Navigate to sign in screen
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Theme.of(context).colorScheme.onPrimary,
                      side: BorderSide(color: Theme.of(context).colorScheme.onPrimary, width: 2),
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

                        SizedBox(height: 32),

                        // HIPAA compliance text
                Text(
                  'HIPAA-compliant • Secure • Private',
                  style: textTheme.bodySmall?.copyWith(
                    color: AppColors.gray300,
                  ),
                        ),

                        SizedBox(height: 24),
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
