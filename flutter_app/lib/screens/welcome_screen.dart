import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Spacer to push content toward center
                Spacer(flex: 2),

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
                  style: TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onPrimary,
                  ),
                ),

                SizedBox(height: 16),

                // Description
                Text(
                  'Remote health management and coordination for patients and caregivers',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    color: AppColors.gray300,
                    height: 1.5,
                  ),
                ),

                Spacer(flex: 2),

                // Get Started Button (Primary)
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                     onPressed: () {
                      Navigator.pushNamed(context, '/registration');
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
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
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
                      Navigator.pushNamed(context, '/signin');
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
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),

                SizedBox(height: 32),

                // HIPAA compliance text
                Text(
                  'HIPAA-compliant • Secure • Private',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.gray300,
                  ),
                ),

                SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
