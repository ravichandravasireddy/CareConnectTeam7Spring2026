import { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, AppColors } from '../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Message = {
  id: string;
  fromCurrentUser: boolean;
  content: string;
  time: string;
};

interface MessagingThreadScreenProps {
  currentUserName: string;
  otherUserName: string;
  initialMessages: Message[];
  onBack?: () => void;
  onCall?: () => void;
  onVideo?: () => void;
}

export function MessagingThreadScreen({
  currentUserName,
  otherUserName,
  initialMessages,
  onBack,
  onCall,
  onVideo,
}: MessagingThreadScreenProps) {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme] as ThemeColors;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const scrollRef = useRef<ScrollView>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const currentInitials = getInitials(currentUserName);
  const otherInitials = getInitials(otherUserName);

  const handleSend = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `${Date.now()}-me`,
      fromCurrentUser: true,
      content: messageText.trim(),
      time: 'Now',
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.iconButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: colors.text }]}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel={otherUserName}
        >
          {otherUserName}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={onCall}
            style={styles.iconButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Start phone call"
            accessibilityHint="Calls this contact"
          >
            <Ionicons name="call-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onVideo}
            style={styles.iconButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Start video call"
            accessibilityHint="Opens video call"
          >
            <Ionicons name="videocam-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateRow} accessible={true} accessibilityRole="text">
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            Today
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        {messages.map((message) => {
          const isCurrentUser = message.fromCurrentUser;
          const initials = isCurrentUser ? currentInitials : otherInitials;
          const bubbleColor = isCurrentUser ? colors.primary : colors.surface;
          const textColor = isCurrentUser ? AppColors.white : colors.text;

          return (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                isCurrentUser ? styles.rowEnd : styles.rowStart,
              ]}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`${
                isCurrentUser ? currentUserName : otherUserName
              }, ${message.content}, ${message.time}`}
            >
              {!isCurrentUser ? (
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: AppColors.white }]}>
                    {initials}
                  </Text>
                </View>
              ) : null}
              <View style={styles.messageContent}>
                <View style={[styles.bubble, { backgroundColor: bubbleColor }]}>
                  <Text style={[styles.bubbleText, { color: textColor }]}>
                    {message.content}
                  </Text>
                </View>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {message.time}
                </Text>
              </View>
              {isCurrentUser ? (
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: AppColors.white }]}>
                    {initials}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {isTyping ? (
          <View style={styles.typingRow} accessible={true} accessibilityRole="text">
            <View
              style={[styles.avatar, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.avatarText, { color: AppColors.white }]}>
                {otherInitials}
              </Text>
            </View>
            <View style={[styles.typingBubble, { backgroundColor: colors.surface }]}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              Typing…
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.inputBar, { borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => Alert.alert('Attachments', 'Coming soon.')}
          style={styles.iconButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add attachment"
          accessibilityHint="Opens attachment options"
        >
          <Ionicons name="add" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TextInput
          value={messageText}
          onChangeText={(text: string) => setMessageText(text)}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.text },
          ]}
          multiline={true}
          textAlignVertical="top"
          accessibilityLabel="Message input"
          accessibilityHint="Type your message"
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityHint="Sends your message"
        >
          <Ionicons name="send" size={20} color={AppColors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

type ThemeColors = {
  [K in keyof typeof Colors.light]: string;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
    },
    headerTitle: {
      ...Typography.h5,
      flex: 1,
      textAlign: 'center',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    iconButton: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 24,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      gap: 12,
    },
    divider: {
      flex: 1,
      height: 1,
    },
    dateText: {
      ...Typography.captionBold,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 16,
      gap: 8,
    },
    rowStart: {
      justifyContent: 'flex-start',
    },
    rowEnd: {
      justifyContent: 'flex-end',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      ...Typography.captionBold,
    },
    messageContent: {
      maxWidth: '70%',
    },
    bubble: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
    },
    bubbleText: {
      ...Typography.body,
    },
    timeText: {
      ...Typography.caption,
      marginTop: 4,
    },
    typingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 16,
      gap: 4,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.textSecondary,
    },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderTopWidth: 1,
      backgroundColor: colors.background,
      gap: 8,
    },
    input: {
      flex: 1,
      minHeight: 48,
      maxHeight: 120,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      ...Typography.body,
    },
    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
