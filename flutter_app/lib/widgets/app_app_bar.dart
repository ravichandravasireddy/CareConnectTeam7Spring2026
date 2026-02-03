import 'package:flutter/material.dart';

// =============================================================================
// APP APP BAR
// =============================================================================
// Reusable top app bar: leading menu (opens drawer), centered title,
// optional notification icon with badge, optional trailing actions.
// =============================================================================

class AppAppBar extends StatelessWidget implements PreferredSizeWidget {
  /// Centered title text.
  final String title;

  /// Show leading menu button that opens the drawer. Default true.
  /// If [useBackButton] is true, shows back button instead (for sub-screens).
  final bool showMenuButton;

  /// When true, leading is a back button that pops the route. Takes precedence over [showMenuButton].
  final bool useBackButton;

  /// Show a dot badge on the notification icon. Default false.
  final bool showNotificationBadge;

  /// Optional extra actions (e.g. settings). Shown after the notification icon.
  final List<Widget>? actions;

  /// Callback when notification icon is tapped. If null, no notification button.
  final VoidCallback? onNotificationTap;

  const AppAppBar({
    super.key,
    required this.title,
    this.showMenuButton = true,
    this.useBackButton = false,
    this.showNotificationBadge = false,
    this.actions,
    this.onNotificationTap,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    final list = <Widget>[];
    if (onNotificationTap != null) {
      list.add(
        Semantics(
          label: 'Notifications',
          button: true,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: onNotificationTap,
              ),
              if (showNotificationBadge)
                Positioned(
                  right: 12,
                  top: 12,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.error,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
            ],
          ),
        ),
      );
    }
    if (actions != null) list.addAll(actions!);

    return AppBar(
      leading: useBackButton
          ? IconButton(
              icon: Icon(Icons.arrow_back, color: Theme.of(context).colorScheme.onSurface),
              onPressed: () => Navigator.of(context).pop(),
            )
          : showMenuButton
              ? Builder(
                  builder: (context) => IconButton(
                    icon: const Icon(Icons.menu),
                    onPressed: () => Scaffold.of(context).openDrawer(),
                  ),
                )
              : null,
      title: Text(title),
      centerTitle: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
      actions: list.isEmpty ? null : list,
    );
  }
}
