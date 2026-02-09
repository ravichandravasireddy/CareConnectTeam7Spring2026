import { MessagingThreadScreen } from './MessagingThreadScreen';

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
  return (
    <MessagingThreadScreen
      currentUserName="Riley Wilson"
      otherUserName="Dr. Sarah Johnson"
      initialMessages={patientMessages}
      onBack={onBack}
      onCall={onCall}
      onVideo={onVideo}
    />
  );
}
