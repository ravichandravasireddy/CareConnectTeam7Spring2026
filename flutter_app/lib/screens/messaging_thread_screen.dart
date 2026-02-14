import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';

/// Messaging thread screen for chatting with doctors and caregivers
/// Fully accessible with WCAG 2.1 Level AA compliance
class MessagingThreadScreen extends StatefulWidget {
  final String userName;

  const MessagingThreadScreen({super.key, this.userName = 'Dr. Sarah Johnson'});

  @override
  State<MessagingThreadScreen> createState() => _MessagingThreadScreenState();
}

class _MessagingThreadScreenState extends State<MessagingThreadScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final FocusNode _messageFocusNode = FocusNode();

  // Sample messages
  final List<Map<String, dynamic>> _messages = [
    {
      'isCurrentUser': false,
      'content':
          'Good morning! I reviewed your latest blood pressure readings and they look great. Keep up the excellent work!',
      'time': '10:30 AM',
    },
    {
      'isCurrentUser': true,
      'content':
          "Thank you so much! I've been following the exercise routine you recommended.",
      'time': '10:32 AM',
    },
    {
      'isCurrentUser': false,
      'content':
          "That's wonderful to hear! How are you feeling after the walks?",
      'time': '10:33 AM',
    },
    {
      'isCurrentUser': true,
      'content': 'Much better! My energy levels have improved significantly.',
      'time': '10:35 AM',
    },
  ];

  bool _isTyping = false;

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _messageFocusNode.dispose();
    super.dispose();
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    final messageText = _messageController.text.trim();
    setState(() {
      _messages.add({
        'isCurrentUser': true,
        'content': messageText,
        'time': 'Now',
      });
      _messageController.clear();
    });

    // Announce sent message
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Message sent: $messageText'),
        duration: const Duration(milliseconds: 500),
      ),
    );

    // Scroll to bottom
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });

    // Simulate typing indicator
    setState(() => _isTyping = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() => _isTyping = false);
      }
    });
  }

  String _getInitials(String name) {
    final parts = name.split(' ');
    if (parts.isEmpty) return '';
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surfaceContainer,
      appBar: AppAppBar(
        title: widget.userName,
        showMenuButton: false,
        useBackButton: true,
        actions: [
          Semantics(
            button: true,
            label: 'Phone call',
            hint: 'Double tap to call ${widget.userName}',
            excludeSemantics: true,
            child: IconButton(
              icon: const Icon(Icons.phone),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Phone call feature coming soon'),
                  ),
                );
              },
              tooltip: 'Phone call',
            ),
          ),
          Semantics(
            button: true,
            label: 'Video call',
            hint: 'Double tap to start video call with ${widget.userName}',
            excludeSemantics: true,
            child: IconButton(
              icon: const Icon(Icons.videocam),
              onPressed: () {
                Navigator.pushNamed(context, '/video-call');
              },
              tooltip: 'Video call',
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages List
          Expanded(
            child: Semantics(
              label: 'Message conversation with ${widget.userName}, ${_messages.length} messages',
              container: true,
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length + (_isTyping ? 2 : 1),
                itemBuilder: (context, index) {
                  // Date separator
                  if (index == 0) {
                    return _buildDateSeparator(context);
                  }

                  // Typing indicator
                  if (_isTyping && index == _messages.length + 1) {
                    return _buildTypingIndicator(context);
                  }

                  final message = _messages[index - 1];
                  return _buildMessageBubble(
                    context,
                    message['content'],
                    message['isCurrentUser'],
                    message['time'],
                  );
                },
              ),
            ),
          ),

          // Message Input
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              border: Border(
                top: BorderSide(
                  color: Theme.of(context).colorScheme.outline,
                  width: 1,
                ),
              ),
            ),
            child: SafeArea(
              child: Semantics(
                label: 'Message input area',
                container: true,
                child: Row(
                  children: [
                    Semantics(
                      button: true,
                      label: 'Add attachment',
                      hint: 'Double tap to attach a file',
                      excludeSemantics: true,
                      child: IconButton(
                        icon: const Icon(Icons.add),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Attachment feature coming soon'),
                            ),
                          );
                        },
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        tooltip: 'Add attachment',
                      ),
                    ),
                    Expanded(
                      child: Semantics(
                        textField: true,
                        label: 'Message',
                        hint: 'Type a message and press send',
                        child: TextField(
                          controller: _messageController,
                          focusNode: _messageFocusNode,
                          decoration: InputDecoration(
                            hintText: 'Type a message...',
                            hintStyle: Theme.of(context).textTheme.bodyMedium
                                ?.copyWith(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurfaceVariant,
                                ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(24),
                              borderSide: BorderSide.none,
                            ),
                            filled: true,
                            fillColor: Theme.of(
                              context,
                            ).colorScheme.surfaceContainer,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 10,
                            ),
                          ),
                          textCapitalization: TextCapitalization.sentences,
                          onSubmitted: (_) => _sendMessage(),
                          textInputAction: TextInputAction.send,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Semantics(
                      button: true,
                      label: 'Send message',
                      hint: 'Double tap to send your message',
                      excludeSemantics: true,
                      child: IconButton(
                        icon: const Icon(Icons.send),
                        onPressed: _sendMessage,
                        style: IconButton.styleFrom(
                          backgroundColor: Theme.of(context).colorScheme.primary,
                          foregroundColor: Theme.of(context).colorScheme.onPrimary,
                          minimumSize: const Size(48, 48),
                        ),
                        tooltip: 'Send message',
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Builder(
        builder: (context) {
          final isPatient =
              context.read<AuthProvider>().userRole == UserRole.patient;
          final navIndex = isPatient ? kPatientNavMessages : kCaregiverNavHome;
          return AppBottomNavBar(currentIndex: navIndex);
        },
      ),
    );
  }

  Widget _buildDateSeparator(BuildContext context) {
    return Semantics(
      label: 'Today',
      header: true,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: Row(
          children: [
            Expanded(
              child: Divider(color: Theme.of(context).colorScheme.outline),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ExcludeSemantics(
                child: Text(
                  'Today',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            Expanded(
              child: Divider(color: Theme.of(context).colorScheme.outline),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageBubble(
    BuildContext context,
    String content,
    bool isCurrentUser,
    String time,
  ) {
    final sender = isCurrentUser ? 'You' : widget.userName;
    final semanticLabel = '$sender, $time: $content';

    return Semantics(
      label: semanticLabel,
      readOnly: true,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Row(
          mainAxisAlignment: isCurrentUser
              ? MainAxisAlignment.end
              : MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            if (!isCurrentUser) ...[
              Semantics(
                label: '${widget.userName} avatar',
                image: true,
                child: CircleAvatar(
                  radius: 16,
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  child: ExcludeSemantics(
                    child: Text(
                      _getInitials(widget.userName),
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
            ],
            Flexible(
              child: ExcludeSemantics(
                child: Column(
                  crossAxisAlignment: isCurrentUser
                      ? CrossAxisAlignment.end
                      : CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: isCurrentUser
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).colorScheme.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: !isCurrentUser 
                            ? Border.all(
                                color: Theme.of(context).colorScheme.outline,
                                width: 1,
                              )
                            : null,
                      ),
                      child: Text(
                        content,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: isCurrentUser
                              ? Theme.of(context).colorScheme.onPrimary
                              : Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      time,
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            if (isCurrentUser) ...[
              const SizedBox(width: 8),
              Semantics(
                label: 'Your avatar',
                image: true,
                child: CircleAvatar(
                  radius: 16,
                  backgroundColor: Theme.of(context).colorScheme.secondary,
                  child: ExcludeSemantics(
                    child: Text(
                      'RW',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSecondary,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTypingIndicator(BuildContext context) {
    return Semantics(
      label: '${widget.userName} is typing',
      liveRegion: true,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Row(
          children: [
            Semantics(
              label: '${widget.userName} avatar',
              image: true,
              child: CircleAvatar(
                radius: 16,
                backgroundColor: Theme.of(context).colorScheme.primary,
                child: ExcludeSemantics(
                  child: Text(
                    _getInitials(widget.userName),
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Theme.of(context).colorScheme.onPrimary,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            ExcludeSemantics(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Theme.of(context).colorScheme.outline,
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildDot(context),
                    const SizedBox(width: 4),
                    _buildDot(context),
                    const SizedBox(width: 4),
                    _buildDot(context),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDot(BuildContext context) {
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.onSurfaceVariant,
        shape: BoxShape.circle,
      ),
    );
  }
}