import { View } from 'react-native';
import { MessagingThreadScreen } from './MessagingThreadScreen';
import { AppBottomNavBar, kCaregiverNavHome } from '@/components/app-bottom-nav-bar';

const doctorMessages = [
  {
    id: '1',
    fromCurrentUser: false,
    content:
      'Good morning, Dr. Johnson. I checked my blood pressure this morning.',
    time: '8:20 AM',
  },
  {
    id: '2',
    fromCurrentUser: true,
    content:
      "Thanks for checking in! Your readings look stable. Keep taking your meds as prescribed.",
    time: '8:22 AM',
  },
  {
    id: '3',
    fromCurrentUser: false,
    content:
      'Will do. I also completed the walking routine. Feeling better this week.',
    time: '8:24 AM',
  },
  {
    id: '4',
    fromCurrentUser: true,
    content:
      "Great work! I'll update your care plan and we can review at your next appointment.",
    time: '8:26 AM',
  },
];

export default function MessagingThreadDoctorScreen({
  onBack,
  onCall,
  onVideo,
}: {
  onBack?: () => void;
  onCall?: () => void;
  onVideo?: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <MessagingThreadScreen
        currentUserName="Dr. Sarah Johnson"
        otherUserName="Robert Williams"
        initialMessages={doctorMessages}
        onBack={onBack}
        onCall={onCall}
        onVideo={onVideo}
      />
      <AppBottomNavBar currentIndex={kCaregiverNavHome} isPatient={false} />
    </View>
  );
}
