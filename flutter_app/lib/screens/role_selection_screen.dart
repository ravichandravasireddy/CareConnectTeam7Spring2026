import 'package:flutter/material.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
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
          style: TextStyle(
            color: colorScheme.onSurface,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              
              // Main heading
              Text(
                'How will you use\nCareConnect?',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: colorScheme.onSurface,
                  height: 1.2,
                ),
              ),
              
              const SizedBox(height: 16),
              
              // Subtitle
              Text(
                'Select the option that best describes you',
                style: TextStyle(
                  fontSize: 16,
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
              
              const SizedBox(height: 40),
              
              // Care Recipient Card
              RoleCard(
                icon: Icons.favorite,
                iconColor: colorScheme.primary,
                backgroundColor: colorScheme.primary.withValues(alpha: 0.1),
                title: 'Care Recipient',
                description: 'I\'m managing my\nown health and tasks',
                onTap: () {
                  Navigator.pushNamed(context, '/registration');
                },
              ),
              
              const SizedBox(height: 16),
              
              // Caregiver Card
              RoleCard(
                icon: Icons.people,
                iconColor: colorScheme.tertiary,
                backgroundColor: colorScheme.tertiary.withValues(alpha: 0.1),
                title: 'Caregiver',
                description: 'I\'m caring for one or\nmore people',
                onTap: () {
                  Navigator.pushNamed(context, '/registration');
                },
              ),
              
              const Spacer(),
              
              // Info box at bottom
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainer,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: colorScheme.outline,
                    width: 1,
                  ),
                ),
                child: Text(
                  'You can change this later in your account settings',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ),
              
              const SizedBox(height: 24),
            ],
          ),
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
    final colorScheme = Theme.of(context).colorScheme;
    return InkWell(
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
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: backgroundColor,
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: 32,
                color: iconColor,
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
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 14,
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