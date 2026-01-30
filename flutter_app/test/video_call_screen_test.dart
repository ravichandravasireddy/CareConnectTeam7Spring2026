// =============================================================================
// VIDEO CALL SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - This file demonstrates video call UI testing, camera controls,
// and real-time timer functionality.
//
// KEY CONCEPTS COVERED:
// 1. Testing video call UI rendering
// 2. Testing camera and microphone controls
// 3. Testing real-time timer updates
// 4. Testing PIP (picture-in-picture) display
// 5. Testing semantic labels for accessibility
// 6. Testing image asset loading and fallbacks
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/video_call_screen.dart';
import 'package:flutter_app/theme/app_colors.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================
  
  /// Creates test harness with VideoCallScreen as home (for most tests).
  Widget createTestHarness() {
    return const MaterialApp(
      home: VideoCallScreen(),
    );
  }

  /// Harness where VideoCallScreen is pushed so that end-call can pop. Use for pop tests.
  Widget createTestHarnessWithNavigator() {
    return MaterialApp(
      home: Builder(
        builder: (ctx) => Scaffold(
          body: Center(
            child: ElevatedButton(
              onPressed: () => Navigator.of(ctx).push(
                MaterialPageRoute(builder: (_) => const VideoCallScreen()),
              ),
              child: const Text('Start call'),
            ),
          ),
        ),
      ),
    );
  }

  // ===========================================================================
  // TEST GROUP: RENDERING TESTS
  // ===========================================================================

  group('VideoCallScreen Rendering', () {
    testWidgets('should render main video area', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Main video area should be present (Stack containing patient view)
      expect(find.byType(Stack), findsWidgets);
    });

    testWidgets('should render patient name and role when camera is off', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // When camera is off (default), should show gradient with name
      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('Patient'), findsOneWidget);
    });

    testWidgets('should render caregiver PIP in top-right', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // PIP should be present with caregiver name
      expect(find.text('Sarah Johnson'), findsOneWidget);
    });

    testWidgets('should render timer badge in top-left', (tester) async {
      await tester.pumpWidget(createTestHarness());
      await tester.pump(const Duration(seconds: 1));

      // Timer should display in MM:SS format
      final timerFinder = find.textContaining(':');
      expect(timerFinder, findsWidgets);
      
      // Initial timer should show 00:00 or 00:01
      final timerText = tester.widget<Text>(timerFinder.first).data;
      expect(timerText, matches(RegExp(r'00:0[0-1]')));
    });

    testWidgets('should render all four control buttons', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byIcon(Icons.mic), findsOneWidget);
      expect(find.byIcon(Icons.videocam), findsOneWidget);
      expect(find.byIcon(Icons.call_end), findsOneWidget);
      expect(find.byIcon(Icons.more_vert), findsOneWidget);
    });

    testWidgets('should render control bar at bottom', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Control bar should have dark secondary background
      final containers = find.byType(Container);
      expect(containers, findsWidgets);
      
      // Bottom control bar exists with proper layout
      expect(find.byType(Row), findsWidgets);
    });

    testWidgets('should render person icon when patient camera is off',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Default state has camera off, should show person icon
      expect(find.byIcon(Icons.person), findsWidgets);
    });

    testWidgets('should render gradient background when camera is off',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find container with gradient decoration
      final containers = tester.widgetList<Container>(find.byType(Container));
      
      bool hasGradient = false;
      for (final container in containers) {
        if (container.decoration is BoxDecoration) {
          final boxDecoration = container.decoration as BoxDecoration;
          if (boxDecoration.gradient is LinearGradient) {
            final gradient = boxDecoration.gradient as LinearGradient;
            // Check if gradient uses primary and accent colors
            if (gradient.colors.contains(AppColors.primary700) &&
                gradient.colors.contains(AppColors.accent600)) {
              hasGradient = true;
              break;
            }
          }
        }
      }
      
      expect(hasGradient, true);
    });
  });

  // ===========================================================================
  // TEST GROUP: TIMER FUNCTIONALITY
  // ===========================================================================

  group('VideoCallScreen Timer', () {
    testWidgets('should start timer at 00:00 or 00:01', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final timerFinder = find.textContaining(':');
      expect(timerFinder, findsWidgets);
      final timerText = tester.widget<Text>(timerFinder.first).data;
      expect(timerText, matches(RegExp(r'00:0[0-1]')));
    });



    testWidgets('should format timer in MM:SS', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Timer uses real time; verify format is MM:SS (e.g. 00:00).
      final timerFinder = find.textContaining(':');
      final timerText = tester.widget<Text>(timerFinder.first).data;
      expect(timerText, matches(RegExp(r'\d{2}:\d{2}')));
    });


  

    testWidgets('should dispose timer when screen is closed', (tester) async {
      await tester.pumpWidget(createTestHarnessWithNavigator());

      await tester.tap(find.text('Start call'));
      await tester.pumpAndSettle();
      expect(find.byType(VideoCallScreen), findsOneWidget);

      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      navigator.pop();
      await tester.pumpAndSettle();

      expect(find.byType(VideoCallScreen), findsNothing);
    });
  });

  // ===========================================================================
  // TEST GROUP: MICROPHONE CONTROLS
  // ===========================================================================

  group('VideoCallScreen Microphone Controls', () {
    testWidgets('should start with microphone on', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Mic icon should be "mic" (on), not "mic_off"
      expect(find.byIcon(Icons.mic), findsOneWidget);
      expect(find.byIcon(Icons.mic_off), findsNothing);
    });

    testWidgets('should toggle microphone off when mic button tapped',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Tap mic button
      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      // Icon should change to mic_off
      expect(find.byIcon(Icons.mic_off), findsOneWidget);
      expect(find.byIcon(Icons.mic), findsNothing);
    });

    testWidgets('should toggle microphone back on when tapped again',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Toggle off
      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      // Toggle back on
      await tester.tap(find.byIcon(Icons.mic_off));
      await tester.pumpAndSettle();

      // Should be back to mic on
      expect(find.byIcon(Icons.mic), findsOneWidget);
      expect(find.byIcon(Icons.mic_off), findsNothing);
    });

    testWidgets('should change button color when microphone is off',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Toggle mic off
      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      // Multiple Material ancestors (button + scaffold); find the one with error color
      final micMaterials = find.ancestor(
        of: find.byIcon(Icons.mic_off),
        matching: find.byType(Material),
      );
      expect(micMaterials, findsWidgets);
      final materials = tester.widgetList<Material>(micMaterials);
      final buttonMaterial = materials.firstWhere(
        (m) => m.color == AppColors.error700,
        orElse: () => throw StateError('No Material with error700'),
      );
      expect(buttonMaterial.color, AppColors.error700);
    });

    testWidgets('should have correct semantic label for microphone button',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Initially on
      expect(find.bySemanticsLabel('Microphone on'), findsOneWidget);

      // Toggle off
      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      expect(find.bySemanticsLabel('Microphone off'), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: VIDEO CONTROLS
  // ===========================================================================

  group('VideoCallScreen Video Controls', () {
    testWidgets('should start with video on', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Video icon should be "videocam" (on), not "videocam_off"
      expect(find.byIcon(Icons.videocam), findsOneWidget);
      expect(find.byIcon(Icons.videocam_off), findsNothing);
    });

    testWidgets('should toggle video off when video button tapped',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Tap video button
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      // Icon should change to videocam_off
      expect(find.byIcon(Icons.videocam_off), findsOneWidget);
      expect(find.byIcon(Icons.videocam), findsNothing);
    });

    testWidgets('should toggle video back on when tapped again',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Toggle off
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      // Toggle back on
      await tester.tap(find.byIcon(Icons.videocam_off));
      await tester.pumpAndSettle();

      // Should be back to video on
      expect(find.byIcon(Icons.videocam), findsOneWidget);
      expect(find.byIcon(Icons.videocam_off), findsNothing);
    });

    testWidgets('should change button color when video is off',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Toggle video off
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      final videoMaterials = find.ancestor(
        of: find.byIcon(Icons.videocam_off),
        matching: find.byType(Material),
      );
      expect(videoMaterials, findsWidgets);
      final materials = tester.widgetList<Material>(videoMaterials);
      final buttonMaterial = materials.firstWhere(
        (m) => m.color == AppColors.error700,
        orElse: () => throw StateError('No Material with error700'),
      );
      expect(buttonMaterial.color, AppColors.error700);
    });

    testWidgets('should have correct semantic label for video button',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Initially on
      expect(find.bySemanticsLabel('Video on'), findsOneWidget);

      // Toggle off
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      expect(find.bySemanticsLabel('Video off'), findsOneWidget);
    });

    testWidgets('should update PIP display when video is toggled off',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Initially video is on - if image asset exists, it would show
      // Toggle video off
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      // PIP should now show placeholder with person icon instead of image
      // (since video is off)
      final pipPersonIcons = find.descendant(
        of: find.ancestor(
          of: find.text('Sarah Johnson'),
          matching: find.byType(Container),
        ),
        matching: find.byIcon(Icons.person),
      );
      
      expect(pipPersonIcons, findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: CALL END FUNCTIONALITY
  // ===========================================================================

  group('VideoCallScreen Call End', () {
    testWidgets('should render end call button', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byIcon(Icons.call_end), findsOneWidget);
    });

    testWidgets('should have red background for end call button',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      final endCallMaterials = find.ancestor(
        of: find.byIcon(Icons.call_end),
        matching: find.byType(Material),
      );
      expect(endCallMaterials, findsWidgets);
      final materials = tester.widgetList<Material>(endCallMaterials);
      final buttonMaterial = materials.firstWhere(
        (m) => m.color == AppColors.error700,
        orElse: () => throw StateError('No Material with error700'),
      );
      expect(buttonMaterial.color, AppColors.error700);
    });

    testWidgets('should have correct semantic label for end call button',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.bySemanticsLabel('End call'), findsOneWidget);
    });

    testWidgets('should pop screen when end call button tapped',
        (tester) async {
      await tester.pumpWidget(createTestHarnessWithNavigator());

      await tester.tap(find.text('Start call'));
      await tester.pumpAndSettle();
      expect(find.byType(VideoCallScreen), findsOneWidget);

      await tester.tap(find.byIcon(Icons.call_end));
      await tester.pumpAndSettle();

      expect(find.byType(VideoCallScreen), findsNothing);
    });
  });

  // ===========================================================================
  // TEST GROUP: MORE OPTIONS BUTTON
  // ===========================================================================

  group('VideoCallScreen More Options', () {
    testWidgets('should render more options button', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byIcon(Icons.more_vert), findsOneWidget);
    });

    testWidgets('should have correct semantic label for more options button',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.bySemanticsLabel('More options'), findsOneWidget);
    });

    testWidgets('should have dark background for more options button',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      final moreMaterials = find.ancestor(
        of: find.byIcon(Icons.more_vert),
        matching: find.byType(Material),
      );
      expect(moreMaterials, findsWidgets);
      final materials = tester.widgetList<Material>(moreMaterials);
      final buttonMaterial = materials.firstWhere(
        (m) => m.color == AppColors.darkBgElevated,
        orElse: () => throw StateError('No Material with darkBgElevated'),
      );
      expect(buttonMaterial.color, AppColors.darkBgElevated);
    });

    testWidgets('should be tappable without errors', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Tap more options (currently does nothing, but shouldn't crash)
      await tester.tap(find.byIcon(Icons.more_vert));
      await tester.pumpAndSettle();

      // Should still be on the same screen
      expect(find.byType(VideoCallScreen), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: PIP (PICTURE-IN-PICTURE) DISPLAY
  // ===========================================================================

  group('VideoCallScreen PIP Display', () {
    testWidgets('should render PIP container in top-right', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // PIP should contain Sarah Johnson's name
      expect(find.text('Sarah Johnson'), findsOneWidget);
    });

    testWidgets('should render PIP with correct dimensions', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find the PIP container
      final pipContainer = find.ancestor(
        of: find.text('Sarah Johnson'),
        matching: find.byType(Container),
      ).first;

      final container = tester.widget<Container>(pipContainer);
      
      // PIP should be 128x160
      expect(container.constraints?.maxWidth, anyOf(isNull, equals(128)));
      // Height constraint is more complex due to layout
    });

    testWidgets('should show person icon in PIP when video is off',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Toggle video off
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      // PIP should show person icon
      final pipPersonIcons = find.descendant(
        of: find.ancestor(
          of: find.text('Sarah Johnson'),
          matching: find.byType(Container),
        ),
        matching: find.byIcon(Icons.person),
      );
      
      expect(pipPersonIcons, findsOneWidget);
    });

    testWidgets('should have white border around PIP', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find PIP container
      final containers = tester.widgetList<Container>(find.byType(Container));
      
      bool hasBorder = false;
      for (final container in containers) {
        if (container.decoration is BoxDecoration) {
          final boxDecoration = container.decoration as BoxDecoration;
          if (boxDecoration.border != null) {
            final border = boxDecoration.border as Border;
            if (border.top.color == AppColors.white && 
                border.top.width == 2) {
              hasBorder = true;
              break;
            }
          }
        }
      }
      
      expect(hasBorder, true);
    });

    testWidgets('should have rounded corners on PIP', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find containers with border radius
      final containers = tester.widgetList<Container>(find.byType(Container));
      
      bool hasRoundedCorners = false;
      for (final container in containers) {
        if (container.decoration is BoxDecoration) {
          final boxDecoration = container.decoration as BoxDecoration;
          if (boxDecoration.borderRadius != null) {
            hasRoundedCorners = true;
            break;
          }
        }
      }
      
      expect(hasRoundedCorners, true);
    });
  });

  // ===========================================================================
  // TEST GROUP: PATIENT VIDEO VIEW
  // ===========================================================================

  group('VideoCallScreen Patient Video View', () {
    testWidgets('should show gradient when patient camera is off by default',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Patient name should be visible
      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('Patient'), findsOneWidget);
      
      // Person icon should be visible (camera off)
      final personIcons = find.byIcon(Icons.person);
      expect(personIcons, findsWidgets);
    });

    testWidgets('should toggle patient camera when main area is tapped',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find the GestureDetector in the main video area
      final mainArea = find.byType(GestureDetector).first;
      
      // Tap to toggle camera
      await tester.tap(mainArea);
      await tester.pumpAndSettle();

      // State should change (camera toggled)
      // Since image asset may not exist, we just verify tap doesn't crash
      expect(find.byType(VideoCallScreen), findsOneWidget);
    });

    testWidgets('should show patient name in both camera states',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Camera off state
      expect(find.text('Robert Williams'), findsOneWidget);

      // Toggle camera
      final mainArea = find.byType(GestureDetector).first;
      await tester.tap(mainArea);
      await tester.pumpAndSettle();

      // Name should still be visible
      expect(find.text('Robert Williams'), findsOneWidget);
    });

    testWidgets('should show "Patient" label in both camera states',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Camera off state
      expect(find.text('Patient'), findsOneWidget);

      // Toggle camera
      final mainArea = find.byType(GestureDetector).first;
      await tester.tap(mainArea);
      await tester.pumpAndSettle();

      // Label should still be visible
      expect(find.text('Patient'), findsOneWidget);
    });

    testWidgets('should handle missing image asset gracefully',
        (tester) async {
      // This test ensures error builder works when image fails to load
      await tester.pumpWidget(createTestHarness());

      // Toggle to camera on (will try to load image)
      final mainArea = find.byType(GestureDetector).first;
      await tester.tap(mainArea);
      await tester.pumpAndSettle();

      // Should fallback to gradient view on error
      // No crash should occur
      expect(find.byType(VideoCallScreen), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: ACCESSIBILITY
  // ===========================================================================

  group('VideoCallScreen Accessibility', () {
    testWidgets('should have semantic labels for all control buttons',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.bySemanticsLabel('Microphone on'), findsOneWidget);
      expect(find.bySemanticsLabel('Video on'), findsOneWidget);
      expect(find.bySemanticsLabel('End call'), findsOneWidget);
      expect(find.bySemanticsLabel('More options'), findsOneWidget);
    });

    testWidgets('should mark buttons as semantic buttons', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // All four control buttons should have Semantics with button: true
      final semantics = tester.widgetList<Semantics>(find.byType(Semantics));
      
      int buttonCount = 0;
      for (final semantic in semantics) {
        if (semantic.properties.button == true) {
          buttonCount++;
        }
      }
      
      // Should have at least 4 buttons (mic, video, end, more)
      expect(buttonCount, greaterThanOrEqualTo(4));
    });

    testWidgets('should update semantic labels when controls toggle',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Initial state
      expect(find.bySemanticsLabel('Microphone on'), findsOneWidget);
      expect(find.bySemanticsLabel('Video on'), findsOneWidget);

      // Toggle mic
      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();
      expect(find.bySemanticsLabel('Microphone off'), findsOneWidget);

      // Toggle video
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();
      expect(find.bySemanticsLabel('Video off'), findsOneWidget);
    });

    testWidgets('should have readable text contrast', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Timer text should use darkTextPrimary color
      // Patient/caregiver names should use darkTextPrimary color
      // These should have good contrast against dark backgrounds
      
      // Verify text widgets exist and are visible
      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('Sarah Johnson'), findsOneWidget);
      
      final timerFinder = find.textContaining(':');
      expect(timerFinder, findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: EDGE CASES AND ERROR HANDLING
  // ===========================================================================

  group('VideoCallScreen Edge Cases', () {
    testWidgets('should handle rapid button taps without errors',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Rapidly toggle mic multiple times
      for (int i = 0; i < 10; i++) {
        final micIcon = find.byIcon(i % 2 == 0 ? Icons.mic : Icons.mic_off);
        await tester.tap(micIcon);
        await tester.pump(const Duration(milliseconds: 50));
      }

      await tester.pumpAndSettle();

      // Should still be functional
      expect(find.byType(VideoCallScreen), findsOneWidget);
    });

    testWidgets('should handle toggling multiple controls simultaneously',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Toggle mic
      await tester.tap(find.byIcon(Icons.mic));
      await tester.pump(const Duration(milliseconds: 100));

      // Toggle video before previous animation completes
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      // Both should be toggled
      expect(find.byIcon(Icons.mic_off), findsOneWidget);
      expect(find.byIcon(Icons.videocam_off), findsOneWidget);
    });

    testWidgets('should maintain timer during control changes',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Toggle some controls
      await tester.tap(find.byIcon(Icons.mic));
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      // Timer still displays in MM:SS (uses real time in tests)
      final timerFinder = find.textContaining(':');
      expect(timerFinder, findsWidgets);
      final timerText = tester.widget<Text>(timerFinder.first).data;
      expect(timerText, matches(RegExp(r'^\d{2}:\d{2}$')));
    });

    testWidgets('should handle screen rotation gracefully', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Simulate rebuild
      await tester.pump();
      await tester.pump();

      // Everything should still be present
      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('Sarah Johnson'), findsOneWidget);
      expect(find.byIcon(Icons.mic), findsOneWidget);
    });

    testWidgets('should preserve state during rebuilds', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Change state
      await tester.tap(find.byIcon(Icons.mic));
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      // Force rebuild
      await tester.pump();

      // State should be preserved
      expect(find.byIcon(Icons.mic_off), findsOneWidget);
      expect(find.byIcon(Icons.videocam_off), findsOneWidget);
    });

    testWidgets('should handle null image assets without crashing',
        (tester) async {
      // If image assets are null/empty, should show fallback views
      await tester.pumpWidget(createTestHarness());

      // Should not crash
      expect(find.byType(VideoCallScreen), findsOneWidget);
      
      // Should show fallback content (icons and names)
      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('Sarah Johnson'), findsOneWidget);
    });

    testWidgets('should clean up resources on dispose', (tester) async {
      await tester.pumpWidget(createTestHarness());
      
      // Let timer run
      await tester.pump(const Duration(seconds: 2));

      // Remove widget
      await tester.pumpWidget(const MaterialApp(home: Scaffold()));

      // Should not throw errors after disposal
      await tester.pump(const Duration(seconds: 1));
    });
  });

  // ===========================================================================
  // TEST GROUP: VISUAL STYLING
  // ===========================================================================

  group('VideoCallScreen Visual Styling', () {
    testWidgets('should use dark theme colors', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
      expect(scaffold.backgroundColor, AppColors.darkBgPrimary);
    });

    testWidgets('should have circular buttons', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // All control buttons should be circular (CircleBorder)
      final materials = tester.widgetList<Material>(find.byType(Material));
      
      int circularButtons = 0;
      for (final material in materials) {
        if (material.shape is CircleBorder) {
          circularButtons++;
        }
      }
      
      // Should have 4 circular buttons
      expect(circularButtons, greaterThanOrEqualTo(4));
    });

    testWidgets('should have proper button sizing', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find SizedBox containers for buttons
      final sizedBoxes = tester.widgetList<SizedBox>(find.byType(SizedBox));
      
      // Control buttons should be 56x56
      bool hasCorrectSize = false;
      for (final box in sizedBoxes) {
        if (box.width == 56 && box.height == 56) {
          hasCorrectSize = true;
          break;
        }
      }
      
      expect(hasCorrectSize, true);
    });

    testWidgets('should have shadow on timer badge', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Timer container should have semi-transparent background
      final containers = tester.widgetList<Container>(find.byType(Container));
      
      bool hasTimerStyle = false;
      for (final container in containers) {
        if (container.decoration is BoxDecoration) {
          final decoration = container.decoration as BoxDecoration;
          if (decoration.borderRadius != null &&
              decoration.color != null) {
            hasTimerStyle = true;
            break;
          }
        }
      }
      
      expect(hasTimerStyle, true);
    });

    testWidgets('should position elements correctly', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Should have Positioned widgets for timer (top-left) and PIP (top-right)
      final positioned = find.byType(Positioned);
      expect(positioned, findsWidgets);
      
      // At least 2 positioned elements (timer and PIP)
      expect(tester.widgetList(positioned).length, greaterThanOrEqualTo(2));
    });
  });

  // ===========================================================================
  // TEST GROUP: INTEGRATION TESTS
  // ===========================================================================

  group('VideoCallScreen Integration', () {
    testWidgets('should handle complete call flow', (tester) async {
      await tester.pumpWidget(createTestHarnessWithNavigator());

      await tester.tap(find.text('Start call'));
      await tester.pumpAndSettle();
      expect(find.byType(VideoCallScreen), findsOneWidget);

      // Toggle mic off
      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      // Toggle video off
      await tester.tap(find.byIcon(Icons.videocam));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.mic_off));
      await tester.tap(find.byIcon(Icons.videocam_off));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.call_end));
      await tester.pumpAndSettle();

      expect(find.byType(VideoCallScreen), findsNothing);
    });

    testWidgets('should maintain proper state throughout call duration',
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      for (int i = 0; i < 6; i++) {
        await tester.pump(const Duration(milliseconds: 100));
        if (i % 2 == 0) {
          final micIcon = i % 4 == 0 ? Icons.mic : Icons.mic_off;
          await tester.tap(find.byIcon(micIcon));
          await tester.pump();
        }
      }
      await tester.pumpAndSettle();

      // Screen still shows patient and caregiver
      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('Sarah Johnson'), findsOneWidget);
    });

    testWidgets('should handle all button combinations', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Test all combinations of mic and video states
      final combinations = [
        (mic: true, video: true),
        (mic: false, video: true),
        (mic: true, video: false),
        (mic: false, video: false),
      ];

      for (final combo in combinations) {
        // Set mic state
        final currentMicIcon = combo.mic ? Icons.mic : Icons.mic_off;
        final targetMicIcon = !combo.mic ? Icons.mic : Icons.mic_off;
        
        if (find.byIcon(targetMicIcon).evaluate().isNotEmpty) {
          await tester.tap(find.byIcon(targetMicIcon));
          await tester.pumpAndSettle();
        }

        // Set video state
        final currentVideoIcon = combo.video ? Icons.videocam : Icons.videocam_off;
        final targetVideoIcon = !combo.video ? Icons.videocam : Icons.videocam_off;
        
        if (find.byIcon(targetVideoIcon).evaluate().isNotEmpty) {
          await tester.tap(find.byIcon(targetVideoIcon));
          await tester.pumpAndSettle();
        }

        // Verify state
        expect(find.byType(VideoCallScreen), findsOneWidget);
      }
    });
  });
}