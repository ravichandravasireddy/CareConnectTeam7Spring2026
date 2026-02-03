import 'dart:async';

import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

// =============================================================================
// VIDEO CALL SCREEN
// =============================================================================
// Full-screen call UI: main area = patient (Robert Williams), PIP = caregiver
// (Sarah Johnson). Uses [AppColors] dark palette. Timer runs from screen open;
// mic/video buttons toggle state and PIP image vs placeholder. ASL Interpreter
// button opens a PIP with connecting animation then asl.jpg. Set assets in pubspec.
// =============================================================================

/// Video call screen: participant view, PIP, timer, and control buttons.
class VideoCallScreen extends StatefulWidget {
  const VideoCallScreen({super.key});

  /// Image asset for the patient (Robert Williams) in the main area. Place image in project (e.g. images/robert.jpg).
  /// When [patientCameraOnForTesting] is true, this image is shown; when false, gradient (camera off) is shown.
  static const String patientImageAsset = 'assets/images/robert.jpg';

  /// Set to your image asset path for the caregiver (Sarah Johnson) in the top-right PIP.
  /// When user's video is on, this image is shown; when video is off, grey + icon placeholder is shown.
  static const String caregiverPipImageAsset = 'assets/images/sarah.jpg';

  /// Image asset for the in-call ASL interpreter PIP.
  static const String aslInterpreterImageAsset = 'assets/images/asl.jpg';

  /// Toggle for testing: true = show patient's image in main area; false = show gradient (camera off).
  /// Change this in code and hot restart, or tap the main video area at runtime to toggle.
  static const bool patientCameraOnForTesting = false;

  @override
  State<VideoCallScreen> createState() => _VideoCallScreenState();
}

enum _AslPipPhase { connecting, showing }

class _VideoCallScreenState extends State<VideoCallScreen> {
  late DateTime _callStartTime;
  int _elapsedSeconds = 0;
  Timer? _timer;
  bool _micOn = true;
  bool _videoOn = true;
  /// Patient (Robert) camera: when true show image; when false show gradient. Toggle in code via [VideoCallScreen.patientCameraOnForTesting] or tap main area.
  late bool _patientCameraOn;
  bool _aslInterpreterVisible = false;
  _AslPipPhase _aslPhase = _AslPipPhase.connecting;
  Timer? _aslTransitionTimer;

  void _openAslInterpreter() {
    setState(() {
      _aslInterpreterVisible = true;
      _aslPhase = _AslPipPhase.connecting;
    });
    _aslTransitionTimer?.cancel();
    _aslTransitionTimer = Timer(const Duration(milliseconds: 2500), () {
      if (!mounted) return;
      setState(() => _aslPhase = _AslPipPhase.showing);
    });
  }

  void _closeAslInterpreter() {
    _aslTransitionTimer?.cancel();
    setState(() {
      _aslInterpreterVisible = false;
      _aslPhase = _AslPipPhase.connecting;
    });
  }

  @override
  void initState() {
    super.initState();
    _patientCameraOn = VideoCallScreen.patientCameraOnForTesting;
    _callStartTime = DateTime.now();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        _elapsedSeconds = DateTime.now().difference(_callStartTime).inSeconds;
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _aslTransitionTimer?.cancel();
    super.dispose();
  }

  String get _formattedDuration {
    final m = _elapsedSeconds ~/ 60;
    final s = _elapsedSeconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return Scaffold(
      backgroundColor: AppColors.darkBgPrimary,
      body: SafeArea(
        child: Column(
          children: [
            // Main video area
            Expanded(
              child: Stack(
                children: [
                  // Center: patient (Robert Williams) — image when camera on, gradient when off (tap to toggle for testing)
                  GestureDetector(
                    onTap: () => setState(() => _patientCameraOn = !_patientCameraOn),
                    child: _patientCameraOn
                        ? _PatientVideoView(
                            imageAsset: VideoCallScreen.patientImageAsset,
                          )
                        : _PatientCameraOffView(),
                  ),
                  // PIP top-right: caregiver (Sarah Johnson) — image when video on, grey+icon when off (video button toggles)
                  Positioned(
                    top: 16,
                    right: 16,
                    child: _CaregiverPipPlaceholder(
                      imageAsset: VideoCallScreen.caregiverPipImageAsset,
                      cameraOn: _videoOn,
                      colorScheme: colorScheme,
                    ),
                  ),
                  // Timer badge top-left (real timer from screen open)
                  Positioned(
                    top: 16,
                    left: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: colorScheme.shadow.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        _formattedDuration,
                        style: textTheme.labelMedium?.copyWith(
                          color: AppColors.darkTextPrimary,
                        ),
                      ),
                    ),
                  ),
                  // ASL Interpreter PIP (lower right): gray + loading dots → image pop
                  if (_aslInterpreterVisible)
                    Positioned(
                      bottom: 16,
                      right: 16,
                      child: _AslInterpreterPip(
                        phase: _aslPhase,
                        imageAsset: VideoCallScreen.aslInterpreterImageAsset,
                        colorScheme: colorScheme,
                        textTheme: textTheme,
                        onClose: _closeAslInterpreter,
                      ),
                    ),
                ],
              ),
            ),
            // Bottom control bar
            Container(
              color: AppColors.darkBgSecondary,
              padding: const EdgeInsets.all(24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _CallButton(
                    icon: _micOn ? Icons.mic : Icons.mic_off,
                    semanticLabel: _micOn ? 'Microphone on' : 'Microphone off',
                    backgroundColor: _micOn
                        ? AppColors.darkBgElevated
                        : AppColors.error700,
                    iconColor: AppColors.white,
                    onPressed: () => setState(() => _micOn = !_micOn),
                  ),
                  const SizedBox(width: 16),
                  _CallButton(
                    icon: _videoOn ? Icons.videocam : Icons.videocam_off,
                    semanticLabel: _videoOn ? 'Video on' : 'Video off',
                    backgroundColor: _videoOn
                        ? AppColors.darkBgElevated
                        : AppColors.error700,
                    iconColor: AppColors.white,
                    onPressed: () => setState(() => _videoOn = !_videoOn),
                  ),
                  const SizedBox(width: 16),
                  _CallButton(
                    icon: Icons.call_end,
                    semanticLabel: 'End call',
                    backgroundColor: AppColors.error700,
                    iconColor: AppColors.white,
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  const SizedBox(width: 16),
                  _CallButton(
                    icon: Icons.more_vert,
                    semanticLabel: 'More options',
                    backgroundColor: AppColors.darkBgElevated,
                    iconColor: AppColors.white,
                    onPressed: () {},
                  ),
                  const SizedBox(width: 12),
                  Semantics(
                    label: 'ASL Interpreter',
                    button: true,
                    child: Material(
                      color: AppColors.darkBgElevated,
                      shape: const CircleBorder(),
                      clipBehavior: Clip.antiAlias,
                      child: InkWell(
                        onTap: _openAslInterpreter,
                        child: const SizedBox(
                          width: 56,
                          height: 56,
                          child: Icon(
                            Icons.sign_language,
                            color: AppColors.white,
                            size: 24,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Main area when patient's camera is on: Robert's image fills the view.
class _PatientVideoView extends StatelessWidget {
  final String imageAsset;

  const _PatientVideoView({required this.imageAsset});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          imageAsset,
          fit: BoxFit.cover,
          errorBuilder: (_, _, _) => _PatientCameraOffView(),
        ),
        Positioned(
          left: 0,
          right: 0,
          bottom: 24,
          child: Column(
            children: [
              Text(
                'Robert Williams',
                style: textTheme.headlineLarge?.copyWith(
                  color: AppColors.darkTextPrimary,
                  shadows: [
                    Shadow(
                      color: colorScheme.shadow,
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
              ),
              Text(
                'Patient',
                style: textTheme.bodySmall?.copyWith(
                  color: AppColors.darkTextPrimary.withValues(alpha: 0.9),
                  shadows: [
                    Shadow(
                      color: colorScheme.shadow,
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Main area when patient's camera is off: gradient (default) with icon and name.
class _PatientCameraOffView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary700,
            AppColors.accent600,
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                color: AppColors.white.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.person,
                size: 48,
                color: AppColors.darkTextPrimary,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Robert Williams',
              style: textTheme.headlineLarge?.copyWith(
                color: AppColors.darkTextPrimary,
              ),
            ),
            Text(
              'Patient',
              style: textTheme.bodySmall?.copyWith(
                color: AppColors.darkTextPrimary.withValues(alpha: 0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// PIP in the upper-right: caregiver (Sarah Johnson).
/// When [cameraOn] is true, [imageAsset] is shown; when false, grey + icon placeholder (video off).
class _CaregiverPipPlaceholder extends StatelessWidget {
  final String? imageAsset;
  final bool cameraOn;
  final ColorScheme colorScheme;

  const _CaregiverPipPlaceholder({
    required this.imageAsset,
    required this.cameraOn,
    required this.colorScheme,
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Container(
      width: 128,
      height: 160,
      decoration: BoxDecoration(
        color: AppColors.darkBgSecondary,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: AppColors.white,
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: cameraOn &&
                      imageAsset != null &&
                      imageAsset!.isNotEmpty
                  ? Image.asset(
                      imageAsset!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => _placeholderContent(),
                    )
                  : _placeholderContent(),
            ),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 6),
              color: AppColors.darkBgSecondary,
              child: Text(
                'Sarah Johnson',
                textAlign: TextAlign.center,
                style: textTheme.labelSmall?.copyWith(
                  color: AppColors.darkTextPrimary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _placeholderContent() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.gray700,
            AppColors.darkBgSecondary,
          ],
        ),
      ),
      child: Center(
        child: Icon(
          Icons.person,
          size: 32,
          color: AppColors.darkTextSecondary,
        ),
      ),
    );
  }
}

// =============================================================================
// ASL INTERPRETER PIP
// =============================================================================
// Gray "connecting" state with loading dots, then asl.jpg pops in. Close button
// to dismiss.
// =============================================================================

class _AslInterpreterPip extends StatelessWidget {
  final _AslPipPhase phase;
  final String imageAsset;
  final ColorScheme colorScheme;
  final TextTheme textTheme;
  final VoidCallback onClose;

  const _AslInterpreterPip({
    required this.phase,
    required this.imageAsset,
    required this.colorScheme,
    required this.textTheme,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 140,
      height: 180,
      decoration: BoxDecoration(
        color: AppColors.darkBgSecondary,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.white, width: 2),
        boxShadow: [
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6),
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (phase == _AslPipPhase.connecting) _AslConnectingView(),
            if (phase == _AslPipPhase.showing)
              _AslImageView(imageAsset: imageAsset),
            Positioned(
              top: 4,
              right: 4,
              child: Material(
                color: AppColors.darkBgSecondary.withValues(alpha: 0.8),
                shape: const CircleBorder(),
                child: InkWell(
                  onTap: onClose,
                  customBorder: const CircleBorder(),
                  child: const Padding(
                    padding: EdgeInsets.all(6),
                    child: Icon(
                      Icons.close,
                      color: AppColors.white,
                      size: 18,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 8,
              child: Text(
                'ASL Interpreter',
                textAlign: TextAlign.center,
                style: textTheme.labelSmall?.copyWith(
                  color: AppColors.darkTextPrimary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Gray screen with animated loading dots (calling / connecting).
class _AslConnectingView extends StatefulWidget {
  @override
  State<_AslConnectingView> createState() => _AslConnectingViewState();
}

class _AslConnectingViewState extends State<_AslConnectingView>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.gray700,
      padding: const EdgeInsets.only(bottom: 24),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Connecting…',
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: AppColors.darkTextSecondary,
                  ),
            ),
            const SizedBox(height: 12),
            AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return Row(
                  mainAxisSize: MainAxisSize.min,
                  children: List.generate(3, (i) {
                    final delay = i * 0.2;
                    final t = ((_controller.value + delay) % 1.0);
                    final y = 1.0 - (t < 0.5 ? t * 2 : 2 - t * 2);
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Transform.translate(
                        offset: Offset(0, 4 * y),
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.darkTextSecondary,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    );
                  }),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

/// ASL interpreter image with pop-in animation.
class _AslImageView extends StatefulWidget {
  final String imageAsset;

  const _AslImageView({required this.imageAsset});

  @override
  State<_AslImageView> createState() => _AslImageViewState();
}

class _AslImageViewState extends State<_AslImageView>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scale;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _scale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    _opacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacity.value,
          child: Transform.scale(
            scale: _scale.value,
            alignment: Alignment.center,
            child: Image.asset(
              widget.imageAsset,
              fit: BoxFit.cover,
              width: double.infinity,
              height: double.infinity,
              errorBuilder: (_, __, ___) => Container(
                color: AppColors.gray700,
                child: const Center(
                  child: Icon(
                    Icons.person,
                    color: AppColors.darkTextSecondary,
                    size: 48,
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _CallButton extends StatelessWidget {
  final IconData icon;
  final String semanticLabel;
  final Color backgroundColor;
  final Color iconColor;
  final VoidCallback onPressed;

  const _CallButton({
    required this.icon,
    required this.semanticLabel,
    required this.backgroundColor,
    required this.iconColor,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticLabel,
      button: true,
      child: Material(
        color: backgroundColor,
        shape: const CircleBorder(),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onPressed,
          child: SizedBox(
            width: 56,
            height: 56,
            child: Icon(icon, color: iconColor, size: 24),
          ),
        ),
      ),
    );
  }
}
