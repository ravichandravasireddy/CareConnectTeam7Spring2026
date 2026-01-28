import 'package:flutter/material.dart';

class CalendarScreen extends StatelessWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final days = const [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ];

    // Match the JSX logic: 35 cells, starting at -3
    final dates = List<int>.generate(35, (index) => index - 3);

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        centerTitle: true,
        title: const Text(
          'Calendar',
          style: TextStyle(
            color: Colors.black,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.only(bottom: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Month header + calendar grid
                    Container(
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        border: Border(
                          bottom: BorderSide(
                            color: Color(0xFFE5E7EB),
                            width: 1,
                          ),
                        ),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              IconButton(
                                icon: const Icon(
                                  Icons.chevron_left,
                                  color: Color(0xFF374151),
                                  size: 28,
                                ),
                                onPressed: () {
                                  // TODO: Change to previous month
                                },
                              ),
                              const Text(
                                'January 2026',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF111827),
                                ),
                              ),
                              IconButton(
                                icon: const Icon(
                                  Icons.chevron_right,
                                  color: Color(0xFF374151),
                                  size: 28,
                                ),
                                onPressed: () {
                                  // TODO: Change to next month
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          // Calendar grid
                          GridView.count(
                            crossAxisCount: 7,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            mainAxisSpacing: 4,
                            crossAxisSpacing: 4,
                            children: [
                              // Day headers
                              for (final day in days)
                                Center(
                                  child: Text(
                                    day,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF4B5563),
                                    ),
                                  ),
                                ),
                              // Date cells
                              for (int i = 0; i < dates.length; i++)
                                _buildDateCell(dates[i]),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // Today's tasks
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Tasks for January 26',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 12),
                          _TaskCard(
                            icon: Icons.medication,
                            iconBackground: const Color(0xFFDBEAFE),
                            iconColor: const Color(0xFF2563EB),
                            title: 'Morning Medication',
                            time: '9:00 AM',
                          ),
                          const SizedBox(height: 12),
                          _TaskCard(
                            icon: Icons.monitor_heart,
                            iconBackground: const Color(0xFFFEE2E2),
                            iconColor: const Color(0xFFDC2626),
                            title: 'Blood Pressure Check',
                            time: '2:00 PM',
                          ),
                          const SizedBox(height: 12),
                          _TaskCard(
                            icon: Icons.videocam,
                            iconBackground: const Color(0xFFEDE9FE),
                            iconColor: const Color(0xFF7C3AED),
                            title: 'Virtual Appointment',
                            time: '3:00 PM',
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateCell(int date) {
    final bool isCurrentMonth = date > 0 && date <= 31;
    const int todayDate = 26;
    final bool isToday = date == todayDate;
    final bool hasTasks = const [5, 12, 18, 26, 27].contains(date);

    Color backgroundColor;
    Color textColor;

    if (isToday) {
      backgroundColor = const Color(0xFF2563EB);
      textColor = Colors.white;
    } else if (isCurrentMonth) {
      backgroundColor = Colors.transparent;
      textColor = const Color(0xFF111827);
    } else {
      backgroundColor = Colors.transparent;
      textColor = const Color(0xFF9CA3AF);
    }

    return InkWell(
      borderRadius: BorderRadius.circular(10),
      onTap: isCurrentMonth ? () {} : null,
      child: Container(
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              isCurrentMonth ? '$date' : '',
              style: TextStyle(
                fontSize: 14,
                fontWeight: isToday ? FontWeight.bold : FontWeight.normal,
                color: textColor,
              ),
            ),
            if (hasTasks)
              Container(
                margin: const EdgeInsets.only(top: 3),
                width: 4,
                height: 4,
                decoration: BoxDecoration(
                  color: isToday ? Colors.white : const Color(0xFF2563EB),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _TaskCard extends StatelessWidget {
  final IconData icon;
  final Color iconBackground;
  final Color iconColor;
  final String title;
  final String time;

  const _TaskCard({
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    required this.title,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFFE5E7EB),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: iconBackground,
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: iconColor,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF6B7280),
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

