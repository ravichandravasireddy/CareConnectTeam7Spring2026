import 'package:flutter/material.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';
import 'registration_screen.dart';

// =============================================================================
// ROLE SELECTION SCREEN
// =============================================================================
// Lets user choose role (Caregiver / Patient); navigates to [CreateAccountScreen]
// for account creation. Uses [AppColors] for cards and buttons.
// =============================================================================

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Text(
          'Select Your Role',
          style: textTheme.headlineLarge?.copyWith(
            color: colorScheme.onSurface,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: constraints.maxHeight * 0.08),

                      // Main heading
                      Text(
                        'How will you use\nCareConnect?',
                        style: textTheme.displayLarge?.copyWith(
                          color: colorScheme.onSurface,
                          height: 1.2,
                        ),
                      ),

                      SizedBox(height: 16),

                      // Subtitle
                      Text(
                        'Select the option that best describes you',
                        style: textTheme.bodyLarge?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),

                      SizedBox(height: 40),

                      // Care Recipient Card
                      RoleCard(
                        icon: Icons.favorite,
                        iconColor: colorScheme.primary,
                        backgroundColor: AppColors.primary100,
                        title: 'Care Recipient',
                        description: 'I\'m managing my\nown health and tasks',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const RegistrationScreen(
                                selectedRole: UserRole.patient,
                              ),
                            ),
                          );
                        },
                      ),

                      SizedBox(height: 16),

                      // Caregiver Card
                      RoleCard(
                        icon: Icons.people,
                        iconColor: colorScheme.tertiary,
                        backgroundColor: AppColors.accent100,
                        title: 'Caregiver',
                        description: 'I\'m caring for one or\nmore people',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const RegistrationScreen(
                                selectedRole: UserRole.caregiver,
                              ),
                            ),
                          );
                        },
                      ),

                      SizedBox(height: constraints.maxHeight * 0.08),

                      // Info box at bottom
                      Container(
                        width: double.infinity,
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: colorScheme.surfaceContainerHighest,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: colorScheme.outline,
                            width: 1,
                          ),
                        ),
                        child: Text(
                          'You can change this later in your account settings',
                          textAlign: TextAlign.center,
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
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
    );
  }
}

// Reusable Role Card Widget
class RoleCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color backgroundColor;
  final String title;
  final String description;
  final VoidCallback onTap;

  const RoleCard({
    super.key,
    required this.icon,
    required this.iconColor,
    required this.backgroundColor,
    required this.title,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: colorScheme.outline, width: 1.5),
        ),
        child: Row(
          children: [
            // Icon Circle
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: backgroundColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 32, color: iconColor),
            ),

            const SizedBox(width: 16),

            // Text content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: textTheme.headlineLarge?.copyWith(
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),

            // Chevron arrow
            Icon(
              Icons.chevron_right,
              color: colorScheme.onSurfaceVariant,
              size: 28,
            ),
          ],
        ),
      ),
    );
  }
}
