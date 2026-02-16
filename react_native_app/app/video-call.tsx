// =============================================================================
// VIDEO CALL SCREEN
// =============================================================================
// Full-screen call UI: main area = patient (Robert Williams), PIP = caregiver
// (Sarah Johnson). Uses dark palette. Timer from screen open; mic/video
// toggles; ASL Interpreter PIP with connecting then placeholder view.
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { AppAppBar } from '@/components/app-app-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AppColors, Typography } from '../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

const IMG_ROBERT = require('../assets/images/robert.jpg');
const IMG_SARAH = require('../assets/images/sarah.jpg');
const IMG_ASL = require('../assets/images/asl.jpg');

type AslPhase = 'connecting' | 'showing';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/** Main area when patient camera is off: gradient + icon + name */
function PatientCameraOffView() {
  return (
    <LinearGradient
      colors={[AppColors.primary700, AppColors.accent600]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.patientGradient}>
      <View style={styles.patientCenter}>
        <View style={styles.patientIconCircle}>
          <MaterialIcons name="person" size={48} color={AppColors.darkTextPrimary} />
        </View>
        <Text style={[Typography.h3, styles.patientName]}>{'Robert Williams'}</Text>
        <Text style={[Typography.bodySmall, styles.patientRole]}>{'Patient'}</Text>
      </View>
    </LinearGradient>
  );
}

/** Main area when patient camera is on: Robert's video (image) with name overlay */
function PatientCameraOnView() {
  return (
    <View style={styles.patientWrapper}>
      <Image
        source={IMG_ROBERT}
        style={styles.patientImage}
        resizeMode="cover"
        accessibilityLabel="Robert Williams, patient video"
      />
      <View style={styles.patientLabelBottom} pointerEvents="none">
        <Text style={[Typography.h4, styles.patientName]}>{'Robert Williams'}</Text>
        <Text style={[Typography.bodySmall, styles.patientRole]}>{'Patient'}</Text>
      </View>
    </View>
  );
}

/** PIP: caregiver (Sarah Johnson) — image when camera on; placeholder when off */
function CaregiverPip({ cameraOn }: { cameraOn: boolean }) {
  return (
    <View style={styles.pipContainer}>
      <View style={styles.pipVideoArea}>
        {cameraOn ? (
          <Image
            source={IMG_SARAH}
            style={styles.pipImage}
            resizeMode="cover"
            accessibilityLabel="Sarah Johnson, caregiver video"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.pipPlaceholder]}>
            <MaterialIcons name="person" size={32} color={AppColors.darkTextSecondary} />
          </View>
        )}
      </View>
      <View style={styles.pipLabelBar}>
        <Text style={[Typography.captionBold, styles.pipLabel]} numberOfLines={1}>
          Sarah Johnson
        </Text>
      </View>
    </View>
  );
}

/** ASL Interpreter PIP: connecting state with dots, then placeholder */
function AslConnectingDots() {
  const [dot0, setDot0] = useState(new Animated.Value(0));
  const [dot1, setDot1] = useState(new Animated.Value(0));
  const [dot2, setDot2] = useState(new Animated.Value(0));

  useEffect(() => {
    const anim = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, useNativeDriver: true, duration: 300 }),
          Animated.timing(v, { toValue: 0, useNativeDriver: true, duration: 300 }),
        ])
      );
    const a0 = anim(dot0, 0);
    const a1 = anim(dot1, 200);
    const a2 = anim(dot2, 400);
    a0.start();
    a1.start();
    a2.start();
    return () => {
      a0.stop();
      a1.stop();
      a2.stop();
    };
  }, []);

  const translate = (v: Animated.Value) =>
    v.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <View style={styles.aslConnecting}>
      <Text style={[Typography.captionBold, { color: AppColors.darkTextSecondary }]}>
        Connecting…
      </Text>
      <View style={styles.aslDotsRow}>
        <Animated.View style={[styles.aslDot, { transform: [{ translateY: translate(dot0) }] }]} />
        <Animated.View style={[styles.aslDot, { transform: [{ translateY: translate(dot1) }] }]} />
        <Animated.View style={[styles.aslDot, { transform: [{ translateY: translate(dot2) }] }]} />
      </View>
    </View>
  );
}

function AslInterpreterPip({
  phase,
  onClose,
}: {
  phase: AslPhase;
  onClose: () => void;
}) {
  return (
    <View style={styles.aslPipContainer}>
      <View style={styles.aslPipContent}>
        {phase === 'connecting' && <AslConnectingDots />}
        {phase === 'showing' && (
          <View style={styles.aslPipShowing}>
            <Image source={IMG_ASL} style={styles.aslImage} resizeMode="cover" />
          </View>
        )}
      </View>
      <TouchableOpacity
        accessible
        accessibilityLabel="Close ASL interpreter"
        accessibilityRole="button"
        onPress={onClose}
        style={styles.aslCloseBtn}
        hitSlop={8}>
        <MaterialIcons name="close" size={18} color={AppColors.white} />
      </TouchableOpacity>
      <Text style={[Typography.captionBold, styles.aslPipLabel]}>ASL Interpreter</Text>
    </View>
  );
}

function CallButton({
  icon,
  label,
  backgroundColor,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  backgroundColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.callBtn, { backgroundColor }]}
      activeOpacity={0.8}>
      <MaterialIcons name={icon} size={24} color={AppColors.white} />
    </TouchableOpacity>
  );
}

export default function VideoCallScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [patientCameraOn, setPatientCameraOn] = useState(false);
  const [aslVisible, setAslVisible] = useState(false);
  const [aslPhase, setAslPhase] = useState<AslPhase>('connecting');

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!aslVisible) return;
    setAslPhase('connecting');
    const t = setTimeout(() => setAslPhase('showing'), 2500);
    return () => clearTimeout(t);
  }, [aslVisible]);

  const openAsl = () => setAslVisible(true);
  const closeAsl = () => setAslVisible(false);

  return (
    <>
      <AppAppBar
        title="Video Call"
        showMenuButton={false}
        useBackButton={true}
        showNotificationButton={false}
      />
      <View style={styles.screen}>
        <SafeAreaView style={styles.safe} edges={['left', 'right']}>
          <View style={styles.mainArea}>
            <TouchableOpacity
              style={styles.patientTouchable}
              onPress={() => setPatientCameraOn((p) => !p)}
              activeOpacity={1}
              accessible
              accessibilityRole="button"
              accessibilityLabel={patientCameraOn ? 'Patient camera on. Tap to turn off.' : 'Patient camera off. Tap to turn on.'}
            >
              {patientCameraOn ? <PatientCameraOnView /> : <PatientCameraOffView />}
            </TouchableOpacity>

            <View style={styles.timerBadge}>
              <Text style={[Typography.captionBold, styles.timerText]}>
                {formatDuration(elapsedSeconds)}
              </Text>
            </View>

            <View style={styles.caregiverPip}>
              <CaregiverPip cameraOn={videoOn} />
            </View>

            {aslVisible && (
              <View style={styles.aslPipPosition}>
                <AslInterpreterPip phase={aslPhase} onClose={closeAsl} />
              </View>
            )}
          </View>

          <View style={styles.bottomBar}>
            <CallButton
              icon={micOn ? 'mic' : 'mic-off'}
              label={micOn ? 'Microphone on' : 'Microphone off'}
              backgroundColor={micOn ? AppColors.darkBgElevated : AppColors.error700}
              onPress={() => setMicOn((m) => !m)}
            />
            <CallButton
              icon={videoOn ? 'videocam' : 'videocam-off'}
              label={videoOn ? 'Video on' : 'Video off'}
              backgroundColor={videoOn ? AppColors.darkBgElevated : AppColors.error700}
              onPress={() => setVideoOn((v) => !v)}
            />
            <CallButton
              icon="call-end"
              label="End call"
              backgroundColor={AppColors.error700}
              onPress={() => router.back()}
            />
            <CallButton
              icon="more-vert"
              label="More options"
              backgroundColor={AppColors.darkBgElevated}
              onPress={() => {}}
            />
            <TouchableOpacity
              accessible
              accessibilityLabel="ASL Interpreter"
              accessibilityRole="button"
              onPress={openAsl}
              style={[styles.callBtn, { backgroundColor: AppColors.darkBgElevated }]}
              activeOpacity={0.8}>
              <MaterialIcons name="front-hand" size={24} color={AppColors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.darkBgPrimary,
  },
  safe: {
    flex: 1,
  },
  mainArea: {
    flex: 1,
  },
  patientTouchable: {
    flex: 1,
    alignSelf: 'stretch',
  },
  patientGradient: {
    flex: 1,
    alignSelf: 'stretch',
  },
  patientWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    position: 'relative',
  },
  patientImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  patientCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  patientName: {
    color: AppColors.darkTextPrimary,
  },
  patientRole: {
    color: AppColors.darkTextPrimary,
    opacity: 0.9,
  },
  patientLabelBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
  },
  timerBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
  },
  timerText: {
    color: AppColors.darkTextPrimary,
  },
  caregiverPip: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  pipContainer: {
    width: 128,
    height: 160,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: AppColors.white,
    backgroundColor: AppColors.darkBgSecondary,
    overflow: 'hidden',
  },
  pipVideoArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  pipImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  pipPlaceholder: {
    backgroundColor: AppColors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipLabelBar: {
    paddingVertical: 6,
    backgroundColor: AppColors.darkBgSecondary,
    alignItems: 'center',
  },
  pipLabel: {
    color: AppColors.darkTextPrimary,
  },
  aslPipPosition: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  aslPipContainer: {
    width: 140,
    height: 180,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: AppColors.white,
    backgroundColor: AppColors.darkBgSecondary,
    overflow: 'hidden',
  },
  aslPipContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aslConnecting: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  aslDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  aslDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.darkTextSecondary,
  },
  aslPipShowing: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: AppColors.gray700,
    overflow: 'hidden',
  },
  aslImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  aslCloseBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(30,30,30,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aslPipLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    textAlign: 'center',
    color: AppColors.darkTextPrimary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: AppColors.darkBgSecondary,
    gap: 16,
  },
  callBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
