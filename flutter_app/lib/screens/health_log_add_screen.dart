import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/health_log.dart';
import '../providers/health_log_provider.dart';

// =============================================================================
// HEALTH LOG ADD SCREEN
// =============================================================================
// Form to create a new [HealthLog]; [initialType] sets the log type and which
// fields are shown (mood, water, sleep, blood pressure, heart rate, generic).
// On save, pops with the new HealthLog; caller (e.g. Health Logs screen) adds
// it via [HealthLogProvider.addLog]. Add new type-specific fields here and in
// [_save] when extending [HealthLogType].
// =============================================================================

/// Screen to add a new health log. Pops with the created [HealthLog] on save.
class HealthLogAddScreen extends StatefulWidget {
  final HealthLogType initialType;

  const HealthLogAddScreen({super.key, required this.initialType});

  @override
  State<HealthLogAddScreen> createState() => _HealthLogAddScreenState();
}

class _HealthLogAddScreenState extends State<HealthLogAddScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();
  final _noteController = TextEditingController();
  final _waterDeltaController = TextEditingController();
  final _systolicController = TextEditingController();
  final _diastolicController = TextEditingController();
  final _heartRateController = TextEditingController();
  double _sleepHours = 7;
  _MoodChoice? _selectedMood;

  late HealthLogType _type;

  @override
  void initState() {
    super.initState();
    _type = widget.initialType;
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _noteController.dispose();
    _waterDeltaController.dispose();
    _systolicController.dispose();
    _diastolicController.dispose();
    _heartRateController.dispose();
    super.dispose();
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    final description = _descriptionController.text.trim();
    final note = _noteController.text.trim();

    if (_type == HealthLogType.mood) {
      final mood = _selectedMood ?? _MoodChoice.happy;
      final log = HealthLog(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: _type,
        description: mood.label,
        createdAt: DateTime.now(),
        emoji: mood.emoji,
        note: note.isEmpty ? null : note,
      );
      Navigator.pop(context, log);
      return;
    }

    if (_type == HealthLogType.water) {
      final deltaText = _waterDeltaController.text.trim();
      if (deltaText.isEmpty) return;
      final delta = double.tryParse(deltaText);
      if (delta == null) return;

      final provider = context.read<HealthLogProvider>();
      final currentTotal = provider.waterTotalForDate(DateTime.now());
      final double newTotal = (currentTotal + delta).clamp(0, double.infinity);
        final description = delta >= 0
          ? 'Added ${delta.toStringAsFixed(0)} oz. Total ${newTotal.toStringAsFixed(0)} oz'
          : 'Removed ${delta.abs().toStringAsFixed(0)} oz. Total ${newTotal.toStringAsFixed(0)} oz';

      final log = HealthLog(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: _type,
        description: description,
        createdAt: DateTime.now(),
        note: note.isEmpty ? null : note,
        waterTotal: newTotal,
        waterDelta: delta,
        waterGoal: HealthLogProvider.defaultWaterGoalOz,
      );
      Navigator.pop(context, log);
      return;
    }

    if (_type == HealthLogType.bloodPressure) {
      final sysText = _systolicController.text.trim();
      final diaText = _diastolicController.text.trim();
      if (sysText.isEmpty || diaText.isEmpty) return;
      final systolic = int.tryParse(sysText);
      final diastolic = int.tryParse(diaText);
      if (systolic == null || diastolic == null) return;
      final log = HealthLog(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: _type,
        description: '${formatHealthLogTypeDisplay(HealthLogType.bloodPressure)}: $systolic/$diastolic mmHg',
        createdAt: DateTime.now(),
        note: note.isEmpty ? null : note,
        systolic: systolic,
        diastolic: diastolic,
      );
      Navigator.pop(context, log);
      return;
    }

    if (_type == HealthLogType.heartRate) {
      final bpmText = _heartRateController.text.trim();
      if (bpmText.isEmpty) return;
      final bpm = int.tryParse(bpmText);
      if (bpm == null) return;
      final log = HealthLog(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: _type,
        description: '${formatHealthLogTypeDisplay(HealthLogType.heartRate)}: $bpm bpm',
        createdAt: DateTime.now(),
        note: note.isEmpty ? null : note,
        heartRateBpm: bpm,
      );
      Navigator.pop(context, log);
      return;
    }

    final computedDescription = _type == HealthLogType.sleep
      ? 'Slept ${_sleepHours.toStringAsFixed(1)} hours'
        : description;

    final log = HealthLog(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      type: _type,
      description: computedDescription,
      createdAt: DateTime.now(),
      note: note.isEmpty ? null : note,
      sleepHours: _type == HealthLogType.sleep ? _sleepHours : null,
    );
    Navigator.pop(context, log);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        title: Text(
          'New Health Log',
          style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
        ),
        leading: IconButton(
          icon: Icon(Icons.close, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _save,
                  style: FilledButton.styleFrom(
                    backgroundColor: colorScheme.primary,
                    foregroundColor: colorScheme.onPrimary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    minimumSize: const Size(0, 48),
                  ),
                  child: const Text('Save Log'),
                ),
              ),
            ),
            Expanded(
              child: Form(
                key: _formKey,
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    DropdownButtonFormField<HealthLogType>(
                      initialValue: _type,
                      decoration: InputDecoration(
                        labelText: 'Log Type',
                        border: const OutlineInputBorder(),
                        filled: true,
                        fillColor: colorScheme.surfaceContainer,
                      ),
                      items: HealthLogType.values
                          .map(
                            (type) => DropdownMenuItem(
                              value: type,
                              child: Text(formatHealthLogTypeDisplay(type)),
                            ),
                          )
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _type = value;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    if (_type == HealthLogType.mood)
                      _MoodSelector(
                        selected: _selectedMood,
                        onSelected: (choice) {
                          setState(() {
                            _selectedMood = choice;
                          });
                        },
                      ),
                    if (_type == HealthLogType.mood) const SizedBox(height: 16),
                    if (_type == HealthLogType.bloodPressure)
                      _BloodPressureFields(
                        systolicController: _systolicController,
                        diastolicController: _diastolicController,
                        noteController: _noteController,
                      ),
                    if (_type == HealthLogType.bloodPressure)
                      const SizedBox(height: 16),
                    if (_type == HealthLogType.heartRate)
                      _HeartRateFields(
                        bpmController: _heartRateController,
                        noteController: _noteController,
                      ),
                    if (_type == HealthLogType.heartRate)
                      const SizedBox(height: 16),
                    if (_type != HealthLogType.mood &&
                        _type != HealthLogType.water &&
                        _type != HealthLogType.sleep &&
                        _type != HealthLogType.bloodPressure &&
                        _type != HealthLogType.heartRate)
                      TextFormField(
                        controller: _descriptionController,
                        decoration: InputDecoration(
                          labelText: 'Description',
                          hintText: _hintForType(_type),
                          border: const OutlineInputBorder(),
                          filled: true,
                          fillColor: colorScheme.surfaceContainer,
                        ),
                        maxLines: 3,
                        validator: (v) => (v == null || v.trim().isEmpty)
                            ? 'Enter a description'
                            : null,
                      ),
                    if (_type != HealthLogType.mood &&
                        _type != HealthLogType.water &&
                        _type != HealthLogType.sleep &&
                        _type != HealthLogType.bloodPressure &&
                        _type != HealthLogType.heartRate)
                      const SizedBox(height: 16),
                    if (_type == HealthLogType.water)
                      _WaterLogFields(
                        noteController: _noteController,
                        deltaController: _waterDeltaController,
                      ),
                    if (_type == HealthLogType.sleep)
                      _SleepLogFields(
                        hours: _sleepHours,
                        onChanged: (value) {
                          setState(() => _sleepHours = value);
                        },
                        noteController: _noteController,
                      ),
                    if (_type == HealthLogType.mood)
                      _NoteField(
                        controller: _noteController,
                        label: 'Add note',
                        hint: 'Add details about your mood',
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
}

class _MoodChoice {
  final String label;
  final String emoji;

  const _MoodChoice(this.label, this.emoji);

  static const ecstatic = _MoodChoice('Ecstatic', '🤩');
  static const happy = _MoodChoice('Happy', '😊');
  static const okay = _MoodChoice('Okay', '🙂');
  static const low = _MoodChoice('Low', '😕');
  static const depressed = _MoodChoice('Depressed', '😞');

  static const values = [ecstatic, happy, okay, low, depressed];
}

class _MoodSelector extends StatelessWidget {
  final _MoodChoice? selected;
  final ValueChanged<_MoodChoice> onSelected;

  const _MoodSelector({required this.selected, required this.onSelected});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Mood',
          style: textTheme.labelMedium?.copyWith(
            color: colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _MoodChoice.values.map((choice) {
            final isSelected = selected == choice;
            return ChoiceChip(
              label: Text('${choice.emoji} ${choice.label}'),
              selected: isSelected,
              onSelected: (_) => onSelected(choice),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class _WaterLogFields extends StatelessWidget {
  final TextEditingController deltaController;
  final TextEditingController noteController;

  const _WaterLogFields({
    required this.deltaController,
    required this.noteController,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final provider = context.watch<HealthLogProvider>();
    final currentTotal = provider.waterTotalForDate(DateTime.now());

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Current total: ${currentTotal.toStringAsFixed(0)} oz',
          style: textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: deltaController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: 'Add (or subtract) ounces',
            hintText: 'e.g. 12 or -8',
            border: const OutlineInputBorder(),
            filled: true,
            fillColor: colorScheme.surfaceContainer,
          ),
          validator: (v) =>
              (v == null || v.trim().isEmpty) ? 'Enter an amount' : null,
        ),
        const SizedBox(height: 16),
        _NoteField(
          controller: noteController,
          label: 'Note (optional)',
          hint: 'Add a quick note',
        ),
      ],
    );
  }
}

class _SleepLogFields extends StatelessWidget {
  final double hours;
  final ValueChanged<double> onChanged;
  final TextEditingController noteController;

  const _SleepLogFields({
    required this.hours,
    required this.onChanged,
    required this.noteController,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Sleep duration: ${hours.toStringAsFixed(1)} hours',
          style: textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurfaceVariant,
          ),
        ),
        Slider(
          value: hours,
          min: 0,
          max: 12,
          divisions: 24,
          label: '${hours.toStringAsFixed(1)}h',
          onChanged: onChanged,
        ),
        const SizedBox(height: 8),
        _NoteField(
          controller: noteController,
          label: 'Note (optional)',
          hint: 'How did you sleep?',
        ),
      ],
    );
  }
}

class _BloodPressureFields extends StatefulWidget {
  final TextEditingController systolicController;
  final TextEditingController diastolicController;
  final TextEditingController noteController;

  const _BloodPressureFields({
    required this.systolicController,
    required this.diastolicController,
    required this.noteController,
  });

  @override
  State<_BloodPressureFields> createState() => _BloodPressureFieldsState();
}

class _BloodPressureFieldsState extends State<_BloodPressureFields> {
  String _label = '';

  void _updateLabel() {
    final sys = int.tryParse(widget.systolicController.text.trim());
    final dia = int.tryParse(widget.diastolicController.text.trim());
    if (sys != null && dia != null) {
      setState(() => _label = bloodPressureCategoryLabel(sys, dia));
    } else {
      setState(() => _label = '');
    }
  }

  @override
  void initState() {
    super.initState();
    widget.systolicController.addListener(_updateLabel);
    widget.diastolicController.addListener(_updateLabel);
  }

  @override
  void dispose() {
    widget.systolicController.removeListener(_updateLabel);
    widget.diastolicController.removeListener(_updateLabel);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: widget.systolicController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Systolic (upper)',
                  hintText: '120',
                  border: const OutlineInputBorder(),
                  filled: true,
                  fillColor: colorScheme.surfaceContainer,
                ),
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Required' : null,
                onChanged: (_) => _updateLabel(),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextFormField(
                controller: widget.diastolicController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Diastolic (lower)',
                  hintText: '80',
                  border: const OutlineInputBorder(),
                  filled: true,
                  fillColor: colorScheme.surfaceContainer,
                ),
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Required' : null,
                onChanged: (_) => _updateLabel(),
              ),
            ),
          ],
        ),
        if (_label.isNotEmpty) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              _label,
              style: textTheme.labelMedium?.copyWith(
                color: colorScheme.onPrimaryContainer,
              ),
            ),
          ),
        ],
        const SizedBox(height: 16),
        _NoteField(
          controller: widget.noteController,
          label: 'Note (optional)',
          hint: 'Add context (e.g. before medication)',
        ),
      ],
    );
  }
}

class _HeartRateFields extends StatefulWidget {
  final TextEditingController bpmController;
  final TextEditingController noteController;

  const _HeartRateFields({
    required this.bpmController,
    required this.noteController,
  });

  @override
  State<_HeartRateFields> createState() => _HeartRateFieldsState();
}

class _HeartRateFieldsState extends State<_HeartRateFields> {
  String _label = '';

  void _updateLabel() {
    final bpm = int.tryParse(widget.bpmController.text.trim());
    if (bpm != null) {
      setState(() => _label = heartRateCategoryLabel(bpm));
    } else {
      setState(() => _label = '');
    }
  }

  @override
  void initState() {
    super.initState();
    widget.bpmController.addListener(_updateLabel);
  }

  @override
  void dispose() {
    widget.bpmController.removeListener(_updateLabel);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          controller: widget.bpmController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: 'Heart rate (bpm)',
            hintText: '72',
            border: const OutlineInputBorder(),
            filled: true,
            fillColor: colorScheme.surfaceContainer,
          ),
          validator: (v) =>
              (v == null || v.trim().isEmpty) ? 'Enter bpm' : null,
          onChanged: (_) => _updateLabel(),
        ),
        if (_label.isNotEmpty) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              _label,
              style: textTheme.labelMedium?.copyWith(
                color: colorScheme.onPrimaryContainer,
              ),
            ),
          ),
        ],
        const SizedBox(height: 16),
        _NoteField(
          controller: widget.noteController,
          label: 'Note (optional)',
          hint: 'e.g. resting, after exercise',
        ),
      ],
    );
  }
}

class _NoteField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;

  const _NoteField({
    required this.controller,
    this.label = 'Add note',
    this.hint = 'Add a note',
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: const OutlineInputBorder(),
        filled: true,
        fillColor: colorScheme.surfaceContainer,
      ),
      maxLines: 3,
    );
  }
}

String _hintForType(HealthLogType type) {
  switch (type) {
    case HealthLogType.meals:
      return 'What did you eat today?';
    case HealthLogType.symptoms:
      return 'What symptoms did you notice?';
    case HealthLogType.exercise:
      return 'What activity did you do today?';
    case HealthLogType.general:
      return 'Add a general note';
    case HealthLogType.mood:
    case HealthLogType.water:
    case HealthLogType.sleep:
    case HealthLogType.bloodPressure:
    case HealthLogType.heartRate:
      return 'Add details';
  }
}
