import 'dart:async';

import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Video call screen: full-screen call UI with participant view,
/// PIP (caregiver), timer, and control buttons (mic, video, end, more).
/// Center = patient (Robert Williams). Top-right PIP = caregiver (Sarah Johnson).
class VideoCallScreen extends StatefulWidget {
  const VideoCallScreen({super.key});

  /// Image asset for the patient (Robert Williams) in the main area. Place image in project (e.g. images/robert.jpg).
  /// When [patientCameraOnForTesting] is true, this image is shown; when false, gradient (camera off) is shown.
  static const String? patientImageAsset = 'assets/images/robert.jpg';

  /// Set to your image asset path for the caregiver (Sarah Johnson) in the top-right PIP.
  /// When user's video is on, this image is shown; when video is off, grey + icon placeholder is shown.
  static const String? caregiverPipImageAsset = 'assets/images/sarah.jpg';

  /// Toggle for testing: true = show patient's image in main area; false = show gradient (camera off).
  /// Change this in code and hot restart, or tap the main video area at runtime to toggle.
  static const bool patientCameraOnForTesting = false;

  @override
  State<VideoCallScreen> createState() => _VideoCallScreenState();
}

class _VideoCallScreenState extends State<VideoCallScreen> {
  late DateTime _callStartTime;
  int _elapsedSeconds = 0;
  Timer? _timer;
  bool _micOn = true;
  bool _videoOn = true;
  /// Patient (Robert) camera: when true show image; when false show gradient. Toggle in code via [VideoCallScreen.patientCameraOnForTesting] or tap main area.
  late bool _patientCameraOn;

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
    super.dispose();
  }

  String get _formattedDuration {
    final m = _elapsedSeconds ~/ 60;
    final s = _elapsedSeconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
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
                    onTap: VideoCallScreen.patientImageAsset != null
                        ? () => setState(() => _patientCameraOn = !_patientCameraOn)
                        : null,
                    child: _patientCameraOn &&
                            VideoCallScreen.patientImageAsset != null &&
                            VideoCallScreen.patientImageAsset!.isNotEmpty
                        ? _PatientVideoView(
                            imageAsset: VideoCallScreen.patientImageAsset!,
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
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.darkTextPrimary,
                        ),
                      ),
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
                    onPressed: () => Navigator.maybePop(context),
                  ),
                  const SizedBox(width: 16),
                  _CallButton(
                    icon: Icons.more_vert,
                    semanticLabel: 'More options',
                    backgroundColor: AppColors.darkBgElevated,
                    iconColor: AppColors.white,
                    onPressed: () {},
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
    final colorScheme = Theme.of(context).colorScheme;
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          imageAsset,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => _PatientCameraOffView(),
        ),
        Positioned(
          left: 0,
          right: 0,
          bottom: 24,
          child: Column(
            children: [
              Text(
                'Robert Williams',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
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
                style: TextStyle(
                  fontSize: 12,
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
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: AppColors.darkTextPrimary,
              ),
            ),
            Text(
              'Patient',
              style: TextStyle(
                fontSize: 12,
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
                      errorBuilder: (_, __, ___) => _placeholderContent(),
                    )
                  : _placeholderContent(),
            ),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 6),
              color: AppColors.darkBgSecondary,
              child: Text(
                'Sarah Johnson',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
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
