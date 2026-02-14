import 'package:flutter/material.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';
import 'registration_screen.dart';

// =============================================================================
// ROLE SELECTION SCREEN - ACCESSIBLE VERSION
// =============================================================================
// WCAG 2.1 Level AA compliant role selection with comprehensive accessibility
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
        leading: Semantics(
          button: true,
          label: 'Go back to previous screen',
          hint: 'Double tap to navigate back',
          excludeSemantics: true,
          child: IconButton(
            icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
            onPressed: () {
              Navigator.pop(context);
            },
            tooltip: 'Go back',
          ),
        ),
        title: Semantics(
          header: true,
          label: 'Select Your Role',
          child: Text(
            'Select Your Role',
            style: textTheme.headlineLarge?.copyWith(
              color: colorScheme.onSurface,
            ),
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
                      Semantics(
                        header: true,
                        label: 'How will you use CareConnect?',
                        child: Text(
                          'How will you use\nCareConnect?',
                          style: textTheme.displayLarge?.copyWith(
                            color: colorScheme.onSurface,
                            height: 1.2,
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Subtitle
                      Semantics(
                        label: 'Select the option that best describes you',
                        child: Text(
                          'Select the option that best describes you',
                          style: textTheme.bodyLarge?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),

                      const SizedBox(height: 40),

                      // Care Recipient Card
                      RoleCard(
                        icon: Icons.favorite,
                        iconColor: colorScheme.primary,
                        backgroundColor: AppColors.primary100,
                        title: 'Care Recipient',
                        description: 'I\'m managing my\nown health and tasks',
                        semanticLabel: 'Care Recipient: I\'m managing my own health and tasks',
                        semanticHint: 'Double tap to register as a care recipient',
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

                      const SizedBox(height: 16),

                      // Caregiver Card
                      RoleCard(
                        icon: Icons.people,
                        iconColor: colorScheme.tertiary,
                        backgroundColor: AppColors.accent100,
                        title: 'Caregiver',
                        description: 'I\'m caring for one or\nmore people',
                        semanticLabel: 'Caregiver: I\'m caring for one or more people',
                        semanticHint: 'Double tap to register as a caregiver',
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
                      Semantics(
                        label: 'Information: You can change this later in your account settings',
                        readOnly: true,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: colorScheme.surfaceContainerHighest,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: colorScheme.outline,
                              width: 1,
                            ),
                          ),
                          child: ExcludeSemantics(
                            child: Text(
                              'You can change this later in your account settings',
                              textAlign: TextAlign.center,
                              style: textTheme.bodySmall?.copyWith(
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),
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

// Reusable Role Card Widget with Accessibility
class RoleCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color backgroundColor;
  final String title;
  final String description;
  final String semanticLabel;
  final String semanticHint;
  final VoidCallback onTap;

  const RoleCard({
    super.key,
    required this.icon,
    required this.iconColor,
    required this.backgroundColor,
    required this.title,
    required this.description,
    required this.semanticLabel,
    required this.semanticHint,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    
    return Semantics(
      button: true,
      label: semanticLabel,
      hint: semanticHint,
      excludeSemantics: true,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: colorScheme.outline,
                width: 1.5,
              ),
            ),
            child: Row(
              children: [
                // Icon Circle
                Semantics(
                  label: '$title icon',
                  image: true,
                  child: Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: backgroundColor,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, size: 32, color: iconColor),
                  ),
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
                Semantics(
                  label: 'Navigate',
                  image: true,
                  child: Icon(
                    Icons.chevron_right,
                    color: colorScheme.onSurfaceVariant,
                    size: 28,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}