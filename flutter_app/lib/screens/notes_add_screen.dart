import 'package:flutter/material.dart';
import '../models/note.dart';

// =============================================================================
// NOTES ADD SCREEN - ACCESSIBLE VERSION
// =============================================================================
// WCAG 2.1 Level AA compliant note creation form with screen reader support
// =============================================================================

/// Current user for new notes (will be linked to logged-in profile later).
const String kCurrentUserAuthor = 'Sarah Johnson (Caregiver)';

/// Screen to add a new note. Pops with the created [Note] on save (caller adds to provider).
class AddNoteScreen extends StatefulWidget {
  const AddNoteScreen({super.key});

  @override
  State<AddNoteScreen> createState() => _AddNoteScreenState();
}

class _AddNoteScreenState extends State<AddNoteScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _bodyController = TextEditingController();
  final _titleFocusNode = FocusNode();
  final _bodyFocusNode = FocusNode();
  NoteCategory _category = NoteCategory.medication;

  @override
  void dispose() {
    _titleController.dispose();
    _bodyController.dispose();
    _titleFocusNode.dispose();
    _bodyFocusNode.dispose();
    super.dispose();
  }

  void _save() {
    if (!_formKey.currentState!.validate()) {
      // Announce validation errors
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fix the errors in the form'),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }
    
    final title = _titleController.text.trim();
    final body = _bodyController.text.trim();
    if (title.isEmpty || body.isEmpty) return;
    
    final note = Note(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      body: body,
      author: kCurrentUserAuthor,
      createdAt: DateTime.now(),
      category: _category,
    );
    Navigator.pop(context, note);
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
        title: Semantics(
          header: true,
          label: 'New Note',
          child: Text(
            'New Note',
            style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
          ),
        ),
        leading: Semantics(
          button: true,
          label: 'Cancel',
          hint: 'Double tap to cancel and go back to notes list',
          excludeSemantics: true,
          child: IconButton(
            icon: Icon(Icons.close, color: colorScheme.onSurface),
            onPressed: () => Navigator.pop(context),
            tooltip: 'Cancel',
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Semantics(
                button: true,
                label: 'Save Note',
                hint: 'Double tap to save this note',
                excludeSemantics: true,
                child: FilledButton(
                  onPressed: _save,
                  style: FilledButton.styleFrom(
                    backgroundColor: colorScheme.primary,
                    foregroundColor: colorScheme.onPrimary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    minimumSize: const Size(0, 56),
                  ),
                  child: const Text('Save'),
                ),
              ),
            ),
            Expanded(
              child: Form(
                key: _formKey,
                child: Semantics(
                  label: 'Note creation form',
                  container: true,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      // Title field
                      Semantics(
                        textField: true,
                        label: 'Title',
                        hint: 'Enter a title for your note, for example, Medication Side Effects',
                        child: TextFormField(
                          controller: _titleController,
                          focusNode: _titleFocusNode,
                          decoration: InputDecoration(
                            labelText: 'Title',
                            hintText: 'e.g. Medication Side Effects',
                            border: const OutlineInputBorder(),
                            filled: true,
                            fillColor: colorScheme.surfaceContainer,
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: colorScheme.error,
                                width: 2,
                              ),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: colorScheme.error,
                                width: 2,
                              ),
                            ),
                          ),
                          validator: (v) =>
                              (v == null || v.trim().isEmpty) ? 'Enter a title' : null,
                          textInputAction: TextInputAction.next,
                          onFieldSubmitted: (_) {
                            FocusScope.of(context).requestFocus(_bodyFocusNode);
                          },
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Body field
                      Semantics(
                        textField: true,
                        label: 'Note',
                        hint: 'Enter the content of your note',
                        child: TextFormField(
                          controller: _bodyController,
                          focusNode: _bodyFocusNode,
                          decoration: InputDecoration(
                            labelText: 'Note',
                            hintText: 'Write your note here…',
                            border: const OutlineInputBorder(),
                            filled: true,
                            fillColor: colorScheme.surfaceContainer,
                            alignLabelWithHint: true,
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: colorScheme.error,
                                width: 2,
                              ),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: colorScheme.error,
                                width: 2,
                              ),
                            ),
                          ),
                          maxLines: 6,
                          validator: (v) =>
                              (v == null || v.trim().isEmpty) ? 'Enter note content' : null,
                          textInputAction: TextInputAction.done,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Category dropdown
                      Semantics(
                        label: 'Category: ${formatNoteCategoryDisplay(_category)}',
                        hint: 'Double tap to select a category',
                        child: DropdownButtonFormField<NoteCategory>(
                          value: _category,
                          decoration: InputDecoration(
                            labelText: 'Category',
                            border: const OutlineInputBorder(),
                            filled: true,
                            fillColor: colorScheme.surfaceContainer,
                          ),
                          items: NoteCategory.values
                              .map(
                                (c) => DropdownMenuItem<NoteCategory>(
                                  value: c,
                                  child: Semantics(
                                    label: formatNoteCategoryDisplay(c),
                                    selected: c == _category,
                                    child: Text(formatNoteCategoryDisplay(c)),
                                  ),
                                ),
                              )
                              .toList(),
                          onChanged: (v) {
                            if (v != null) {
                              setState(() => _category = v);
                              // Announce category change
                              ScaffoldMessenger.of(context).clearSnackBars();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Category changed to ${formatNoteCategoryDisplay(v)}'),
                                  duration: const Duration(milliseconds: 500),
                                ),
                              );
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}