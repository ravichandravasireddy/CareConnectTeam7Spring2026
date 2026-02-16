import 'dart:async';

import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

// =============================================================================
// VIDEO CALL SCREEN - ACCESSIBLE VERSION
// =============================================================================
// Full-screen call UI with WCAG 2.1 Level AA accessibility compliance
// Includes screen reader support, keyboard navigation, and semantic labels
// =============================================================================

/// Video call screen: participant view, PIP, timer, and control buttons.
/// Fully accessible with comprehensive WCAG 2.1 Level AA compliance
class VideoCallScreen extends StatefulWidget {
  const VideoCallScreen({super.key});

  /// Image asset for the patient (Robert Williams) in the main area.
  static const String patientImageAsset = 'assets/images/robert.jpg';

  /// Image asset for the caregiver (Sarah Johnson) in the top-right PIP.
  static const String caregiverPipImageAsset = 'assets/images/sarah.jpg';

  /// Image asset for the in-call ASL interpreter PIP.
  static const String aslInterpreterImageAsset = 'assets/images/asl.jpg';

  /// Toggle for testing: true = show patient's image; false = show gradient.
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
  late bool _patientCameraOn;
  bool _aslInterpreterVisible = false;
  _AslPipPhase _aslPhase = _AslPipPhase.connecting;
  Timer? _aslTransitionTimer;

  void _openAslInterpreter() {
    setState(() {
      _aslInterpreterVisible = true;
      _aslPhase = _AslPipPhase.connecting;
    });
    
    // Announce to screen reader
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Connecting to ASL interpreter'),
        duration: const Duration(milliseconds: 500),
        backgroundColor: AppColors.darkBgSecondary,
      ),
    );
    
    _aslTransitionTimer?.cancel();
    _aslTransitionTimer = Timer(const Duration(milliseconds: 2500), () {
      if (!mounted) return;
      setState(() => _aslPhase = _AslPipPhase.showing);
      
      // Announce connection success
      ScaffoldMessenger.of(context).clearSnackBars();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('ASL interpreter connected'),
          duration: const Duration(milliseconds: 800),
          backgroundColor: AppColors.darkBgSecondary,
        ),
      );
    });
  }

  void _closeAslInterpreter() {
    _aslTransitionTimer?.cancel();
    setState(() {
      _aslInterpreterVisible = false;
      _aslPhase = _AslPipPhase.connecting;
    });
    
    // Announce to screen reader
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('ASL interpreter disconnected'),
        duration: const Duration(milliseconds: 500),
        backgroundColor: AppColors.darkBgSecondary,
      ),
    );
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

  String get _semanticDuration {
    final m = _elapsedSeconds ~/ 60;
    final s = _elapsedSeconds % 60;
    if (m == 0) {
      return '$s second${s != 1 ? 's' : ''}';
    } else if (s == 0) {
      return '$m minute${m != 1 ? 's' : ''}';
    } else {
      return '$m minute${m != 1 ? 's' : ''} and $s second${s != 1 ? 's' : ''}';
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    
    return Scaffold(
      backgroundColor: AppColors.darkBgPrimary,
      body: SafeArea(
        child: Semantics(
          label: 'Video call in progress with Sarah Johnson',
          container: true,
          child: Column(
            children: [
              // Main video area
              Expanded(
                child: Stack(
                  children: [
                    // Center: patient (Robert Williams)
                    Semantics(
                      label: _patientCameraOn 
                          ? 'Robert Williams, Patient, camera on'
                          : 'Robert Williams, Patient, camera off',
                      image: true,
                      button: true,
                      hint: 'Double tap to toggle camera view for testing',
                      child: GestureDetector(
                        onTap: () => setState(() => _patientCameraOn = !_patientCameraOn),
                        child: _patientCameraOn
                            ? _PatientVideoView(
                                imageAsset: VideoCallScreen.patientImageAsset,
                              )
                            : _PatientCameraOffView(),
                      ),
                    ),
                    
                    // PIP top-right: caregiver (Sarah Johnson)
                    Positioned(
                      top: 16,
                      right: 16,
                      child: Semantics(
                        label: _videoOn 
                            ? 'Sarah Johnson, Caregiver, video on'
                            : 'Sarah Johnson, Caregiver, video off',
                        image: true,
                        child: _CaregiverPipPlaceholder(
                          imageAsset: VideoCallScreen.caregiverPipImageAsset,
                          cameraOn: _videoOn,
                          colorScheme: colorScheme,
                        ),
                      ),
                    ),
                    
                    // Timer badge top-left
                    Positioned(
                      top: 16,
                      left: 16,
                      child: Semantics(
                        label: 'Call duration: $_semanticDuration',
                        liveRegion: true,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: colorScheme.shadow.withValues(alpha: 0.5),
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(
                              color: AppColors.white.withValues(alpha: 0.3),
                              width: 1,
                            ),
                          ),
                          child: ExcludeSemantics(
                            child: Text(
                              _formattedDuration,
                              style: textTheme.labelMedium?.copyWith(
                                color: AppColors.darkTextPrimary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    
                    // ASL Interpreter PIP (lower right)
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
              Semantics(
                label: 'Call controls',
                container: true,
                child: Container(
                  color: AppColors.darkBgSecondary,
                  padding: const EdgeInsets.all(24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _CallButton(
                        icon: _micOn ? Icons.mic : Icons.mic_off,
                        semanticLabel: _micOn ? 'Microphone on' : 'Microphone off',
                        semanticState: _micOn ? 'Microphone on' : 'Microphone off',
                        semanticHint: _micOn 
                            ? 'Double tap to mute your microphone'
                            : 'Double tap to unmute your microphone',
                        backgroundColor: _micOn
                            ? AppColors.darkBgElevated
                            : AppColors.error700,
                        iconColor: AppColors.white,
                        onPressed: () {
                          setState(() => _micOn = !_micOn);
                          ScaffoldMessenger.of(context).clearSnackBars();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(_micOn ? 'Microphone on' : 'Microphone off'),
                              duration: const Duration(milliseconds: 500),
                              backgroundColor: AppColors.darkBgSecondary,
                            ),
                          );
                        },
                      ),
                      const SizedBox(width: 16),
                      _CallButton(
                        icon: _videoOn ? Icons.videocam : Icons.videocam_off,
                        semanticLabel: _videoOn ? 'Video on' : 'Video off',
                        semanticState: _videoOn ? 'Video on' : 'Video off',
                        semanticHint: _videoOn 
                            ? 'Double tap to turn off your camera'
                            : 'Double tap to turn on your camera',
                        backgroundColor: _videoOn
                            ? AppColors.darkBgElevated
                            : AppColors.error700,
                        iconColor: AppColors.white,
                        onPressed: () {
                          setState(() => _videoOn = !_videoOn);
                          ScaffoldMessenger.of(context).clearSnackBars();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(_videoOn ? 'Video on' : 'Video off'),
                              duration: const Duration(milliseconds: 500),
                              backgroundColor: AppColors.darkBgSecondary,
                            ),
                          );
                        },
                      ),
                      const SizedBox(width: 16),
                      _CallButton(
                        icon: Icons.call_end,
                        semanticLabel: 'End call',
                        semanticState: '',
                        semanticHint: 'Double tap to end the video call',
                        backgroundColor: AppColors.error700,
                        iconColor: AppColors.white,
                        onPressed: () {
                          Navigator.of(context).pop();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Call ended'),
                              duration: Duration(seconds: 2),
                            ),
                          );
                        },
                      ),
                      const SizedBox(width: 16),
                      _CallButton(
                        icon: Icons.more_vert,
                        semanticLabel: 'More options',
                        semanticState: '',
                        semanticHint: 'Double tap to open more call options',
                        backgroundColor: AppColors.darkBgElevated,
                        iconColor: AppColors.white,
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('More options coming soon'),
                              duration: Duration(seconds: 1),
                            ),
                          );
                        },
                      ),
                      const SizedBox(width: 12),
                      Semantics(
                        label: _aslInterpreterVisible 
                            ? 'ASL Interpreter connected' 
                            : 'Connect ASL Interpreter',
                        hint: _aslInterpreterVisible
                            ? 'ASL interpreter is currently connected'
                            : 'Double tap to connect an ASL interpreter',
                        button: true,
                        enabled: !_aslInterpreterVisible,
                        child: Material(
                          color: _aslInterpreterVisible 
                              ? AppColors.primary700 
                              : AppColors.darkBgElevated,
                          shape: const CircleBorder(),
                          clipBehavior: Clip.antiAlias,
                          child: InkWell(
                            onTap: _aslInterpreterVisible ? null : _openAslInterpreter,
                            child: SizedBox(
                              width: 56,
                              height: 56,
                              child: Icon(
                                Icons.sign_language,
                                color: AppColors.white,
                                size: 24,
                                semanticLabel: 'ASL sign language',
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
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
    
    return ExcludeSemantics(
      child: Stack(
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
                    fontWeight: FontWeight.bold,
                    shadows: [
                      Shadow(
                        color: colorScheme.shadow,
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Patient',
                  style: textTheme.bodySmall?.copyWith(
                    color: AppColors.darkTextPrimary.withValues(alpha: 0.9),
                    shadows: [
                      Shadow(
                        color: colorScheme.shadow,
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Main area when patient's camera is off: gradient with icon and name.
class _PatientCameraOffView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    
    return ExcludeSemantics(
      child: Container(
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
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Patient',
                style: textTheme.bodySmall?.copyWith(
                  color: AppColors.darkTextPrimary.withValues(alpha: 0.8),
                ),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: AppColors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Camera Off',
                  style: textTheme.labelMedium?.copyWith(
                    color: AppColors.darkTextPrimary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// PIP in the upper-right: caregiver (Sarah Johnson).
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
    
    return ExcludeSemantics(
      child: Container(
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
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
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
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person,
              size: 32,
              color: AppColors.darkTextSecondary,
            ),
            const SizedBox(height: 8),
            Text(
              'Camera Off',
              style: TextStyle(
                color: AppColors.darkTextSecondary,
                fontSize: 10,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// ASL INTERPRETER PIP
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
    final isConnecting = phase == _AslPipPhase.connecting;
    
    return Semantics(
      label: isConnecting 
          ? 'ASL Interpreter: Connecting'
          : 'ASL Interpreter: Connected',
      liveRegion: true,
      container: true,
      child: Container(
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
              if (phase == _AslPipPhase.connecting) 
                _AslConnectingView(),
              if (phase == _AslPipPhase.showing)
                _AslImageView(imageAsset: imageAsset),
              
              // Close button
              Positioned(
                top: 4,
                right: 4,
                child: Semantics(
                  button: true,
                  label: 'Close ASL Interpreter',
                  hint: 'Double tap to disconnect ASL interpreter',
                  excludeSemantics: true,
                  child: Material(
                    color: AppColors.darkBgSecondary.withValues(alpha: 0.9),
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
              ),
              
              // Label
              Positioned(
                left: 0,
                right: 0,
                bottom: 8,
                child: ExcludeSemantics(
                  child: Text(
                    'ASL Interpreter',
                    textAlign: TextAlign.center,
                    style: textTheme.labelSmall?.copyWith(
                      color: AppColors.darkTextPrimary,
                      fontWeight: FontWeight.w600,
                      shadows: [
                        Shadow(
                          color: Colors.black.withValues(alpha: 0.8),
                          blurRadius: 4,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Gray screen with animated loading dots (connecting).
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
    return ExcludeSemantics(
      child: Container(
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
    return ExcludeSemantics(
      child: AnimatedBuilder(
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
                errorBuilder: (_, _, _) => Container(
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
      ),
    );
  }
}

class _CallButton extends StatelessWidget {
  final IconData icon;
  final String semanticLabel;
  final String semanticState;
  final String semanticHint;
  final Color backgroundColor;
  final Color iconColor;
  final VoidCallback onPressed;

  const _CallButton({
    required this.icon,
    required this.semanticLabel,
    required this.semanticState,
    required this.semanticHint,
    required this.backgroundColor,
    required this.iconColor,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticLabel,
      value: semanticState,
      hint: semanticHint,
      button: true,
      excludeSemantics: true,
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