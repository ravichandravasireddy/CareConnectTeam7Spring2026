import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Messaging thread screen for chatting with doctors and caregivers
class MessagingThreadScreen extends StatefulWidget {
  final String userName;

  const MessagingThreadScreen({
    super.key,
    this.userName = 'Dr. Sarah Johnson',
  });

  @override
  State<MessagingThreadScreen> createState() => _MessagingThreadScreenState();
}

class _MessagingThreadScreenState extends State<MessagingThreadScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  // Sample messages
  final List<Map<String, dynamic>> _messages = [
    {
      'isCurrentUser': false,
      'content': 'Good morning! I reviewed your latest blood pressure readings and they look great. Keep up the excellent work!',
      'time': '10:30 AM',
    },
    {
      'isCurrentUser': true,
      'content': "Thank you so much! I've been following the exercise routine you recommended.",
      'time': '10:32 AM',
    },
    {
      'isCurrentUser': false,
      'content': "That's wonderful to hear! How are you feeling after the walks?",
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
    super.dispose();
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'isCurrentUser': true,
        'content': _messageController.text,
        'time': 'Now',
      });
      _messageController.clear();
    });

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
    final userInitials = _getInitials(widget.userName);
    
    return Scaffold(
      backgroundColor: AppColors.gray100,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: AppColors.primary600,
              child: Text(
                userInitials,
                style: const TextStyle(
                  color: AppColors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.userName,
                    style: const TextStyle(fontSize: 16),
                  ),
                  Text(
                    'Active now',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.gray700,
                      fontWeight: FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone),
            onPressed: () {
              // TODO: Initiate phone call
            },
          ),
          IconButton(
            icon: const Icon(Icons.videocam),
            onPressed: () {
              // TODO: Initiate video call
            },
          ),
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Messages List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isTyping ? 2 : 1),
              itemBuilder: (context, index) {
                // Date separator
                if (index == 0) {
                  return _buildDateSeparator();
                }

                // Typing indicator
                if (_isTyping && index == _messages.length + 1) {
                  return _buildTypingIndicator();
                }

                final message = _messages[index - 1];
                return _buildMessageBubble(
                  message['content'],
                  message['isCurrentUser'],
                  message['time'],
                );
              },
            ),
          ),

          // Message Input
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.white,
              border: Border(
                top: BorderSide(color: AppColors.gray300),
              ),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: () {
                      // TODO: Add attachment
                    },
                    color: AppColors.gray700,
                  ),
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: InputDecoration(
                        hintText: 'Type a message...',
                        hintStyle: const TextStyle(color: AppColors.gray500),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        filled: true,
                        fillColor: AppColors.gray100,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 10,
                        ),
                      ),
                      textCapitalization: TextCapitalization.sentences,
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.send),
                    onPressed: _sendMessage,
                    style: IconButton.styleFrom(
                      backgroundColor: AppColors.primary600,
                      foregroundColor: AppColors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateSeparator() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        children: [
          Expanded(child: Divider(color: AppColors.gray300)),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Today',
              style: TextStyle(
                color: AppColors.gray700,
                fontSize: 12,
              ),
            ),
          ),
          Expanded(child: Divider(color: AppColors.gray300)),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(String content, bool isCurrentUser, String time) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: isCurrentUser
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isCurrentUser) ...[
            CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.primary600,
              child: Text(
                _getInitials(widget.userName),
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Column(
              crossAxisAlignment: isCurrentUser 
                  ? CrossAxisAlignment.end 
                  : CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isCurrentUser
                        ? AppColors.primary600
                        : AppColors.white,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    content,
                    style: TextStyle(
                      color: isCurrentUser ? AppColors.white : AppColors.gray900,
                      fontSize: 16,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: TextStyle(
                    color: AppColors.gray500,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          if (isCurrentUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.secondary500,
              child: const Text(
                'RW',
                style: TextStyle(
                  color: AppColors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: AppColors.primary600,
            child: Text(
              _getInitials(widget.userName),
              style: const TextStyle(
                color: AppColors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildDot(),
                const SizedBox(width: 4),
                _buildDot(),
                const SizedBox(width: 4),
                _buildDot(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDot() {
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: AppColors.gray500,
        shape: BoxShape.circle,
      ),
    );
  }
}