import { View } from 'react-native';
import { MessagingThreadScreen } from './MessagingThreadScreen';
import { useUser } from '@/providers/UserProvider';
import { AppBottomNavBar, kPatientNavMessages, kCaregiverNavHome } from '@/components/app-bottom-nav-bar';

const patientMessages = [
  {
    id: '1',
    fromCurrentUser: false,
    content:
      'Good morning! I reviewed your latest blood pressure readings and they look great. Keep up the excellent work!',
    time: '10:30 AM',
  },
  {
    id: '2',
    fromCurrentUser: true,
    content:
      "Thank you so much! I've been following the exercise routine you recommended.",
    time: '10:32 AM',
  },
  {
    id: '3',
    fromCurrentUser: false,
    content: "That's wonderful to hear! How are you feeling after the walks?",
    time: '10:33 AM',
  },
  {
    id: '4',
    fromCurrentUser: true,
    content: 'Much better! My energy levels have improved significantly.',
    time: '10:35 AM',
  },
];

export default function MessagingThreadPatientScreen({
  onBack,
  onCall,
  onVideo,
}: {
  onBack?: () => void;
  onCall?: () => void;
  onVideo?: () => void;
}) {
  const { isPatient, userName } = useUser();
  
  // Determine user names based on role
  // Current user: from UserProvider (or defaults)
  // Other user: opposite role (patient talks to caregiver, caregiver talks to patient)
  const currentUserName = userName ?? (isPatient ? 'Robert Williams' : 'Dr. Sarah Johnson');
  const otherUserName = isPatient ? 'Dr. Sarah Johnson' : 'Robert Williams';

  return (
    <View style={{ flex: 1 }}>
      <MessagingThreadScreen
        currentUserName={currentUserName}
        otherUserName={otherUserName}
        initialMessages={patientMessages}
        onBack={onBack}
        onCall={onCall}
        onVideo={onVideo}
      />
      <AppBottomNavBar 
        currentIndex={isPatient ? kPatientNavMessages : kCaregiverNavHome}
        isPatient={isPatient}
      />
    </View>
  );
}
