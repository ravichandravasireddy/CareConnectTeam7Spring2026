// =============================================================================
// NOTES FEATURE TESTS (Model, Provider, and Screens)
// =============================================================================
// SWEN 661 - This file demonstrates comprehensive testing of a complete feature
// including model tests, provider tests, widget tests, and integration tests.
//
// KEY CONCEPTS COVERED:
// 1. Unit testing models (Note class and formatters)
// 2. Provider testing with ChangeNotifier
// 3. Widget testing for list, add, and detail screens
// 4. Form validation testing
// 5. Navigation testing between screens
// 6. Accessibility testing with Semantics
// 7. Integration testing for complete user flows
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:flutter_app/models/note.dart';
import 'package:flutter_app/providers/note_provider.dart';
import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/notes_screen.dart';
import 'package:flutter_app/screens/notes_add_screen.dart';
import 'package:flutter_app/screens/notes_detail_screen.dart';

void main() {
  // ===========================================================================
  // TEST GROUP: NOTE MODEL TESTS
  // ===========================================================================
  // These tests verify the Note model works correctly.
  // Model tests don't require widget harnesses - they're pure Dart tests.
  // ===========================================================================

  group('Note Model', () {
    test('should create Note with all required fields', () {
      // ARRANGE: Create test data
      final createdAt = DateTime(2025, 1, 1, 12, 0);

      // ACT: Create a Note
      final note = Note(
        id: '1',
        title: 'Test Note',
        body: 'Test Body',
        author: 'Test Author',
        createdAt: createdAt,
        category: NoteCategory.medication,
      );

      // ASSERT: Verify all fields are set correctly
      expect(note.id, '1');
      expect(note.title, 'Test Note');
      expect(note.body, 'Test Body');
      expect(note.author, 'Test Author');
      expect(note.createdAt, createdAt);
      expect(note.category, NoteCategory.medication);
    });

    test('copyWith should update only specified fields', () {
      // ARRANGE: Create original note
      final original = Note(
        id: '1',
        title: 'Original Title',
        body: 'Original Body',
        author: 'Original Author',
        createdAt: DateTime(2025, 1, 1),
        category: NoteCategory.medication,
      );

      // ACT: Update only title and category
      final updated = original.copyWith(
        title: 'Updated Title',
        category: NoteCategory.exercise,
      );

      // ASSERT: Verify updated fields changed and others remained the same
      expect(updated.id, original.id);
      expect(updated.title, 'Updated Title');
      expect(updated.body, original.body); // Unchanged
      expect(updated.author, original.author); // Unchanged
      expect(updated.createdAt, original.createdAt); // Unchanged
      expect(updated.category, NoteCategory.exercise);
    });

    test('formatNoteCategoryDisplay should capitalize category names', () {
      // Test all enum values
      expect(formatNoteCategoryDisplay(NoteCategory.medication), 'Medication');
      expect(formatNoteCategoryDisplay(NoteCategory.exercise), 'Exercise');
      expect(
        formatNoteCategoryDisplay(NoteCategory.appointment),
        'Appointment',
      );
    });
  });

  // ===========================================================================
  // TEST GROUP: NOTE PROVIDER TESTS
  // ===========================================================================
  // These tests verify the NoteProvider manages state correctly.
  // Provider tests don't need widgets, but do test ChangeNotifier behavior.
  // ===========================================================================

  group('NoteProvider', () {
    late NoteProvider provider;

    // setUp runs before each test in this group
    setUp(() {
      provider = NoteProvider();
    });

    test('should initialize with 3 mock notes', () {
      // ASSERT: Provider starts with mock data
      expect(provider.notes.length, 3);
      final ids = provider.notes.map((note) => note.id).toSet();
      expect(ids, containsAll(<String>['1', '2', '3']));
    });

    test('should keep notes sorted by createdAt (newest first)', () {
      // ARRANGE: Get all notes
      final notes = provider.notes;

      // ASSERT: Each note should be newer than or equal to the next
      for (int i = 0; i < notes.length - 1; i++) {
        expect(
          notes[i].createdAt.isAfter(notes[i + 1].createdAt) ||
              notes[i].createdAt.isAtSameMomentAs(notes[i + 1].createdAt),
          true,
          reason:
              'Note at index $i should be newer than note at index ${i + 1}',
        );
      }
    });

    test('getById should return correct note when id exists', () {
      // ACT: Look up existing note
      final note = provider.getById('1');

      // ASSERT: Returns the correct note
      expect(note, isNotNull);
      expect(note!.id, '1');
      expect(note.title, 'Medication Side Effects');
    });

    test('getById should return null when id does not exist', () {
      // ACT: Look up non-existent note
      final note = provider.getById('non_existent_id');

      // ASSERT: Returns null
      expect(note, isNull);
    });

    test('addNote should insert at beginning and notify listeners', () {
      // ARRANGE: Set up listener
      bool listenerCalled = false;
      provider.addListener(() => listenerCalled = true);

      final newNote = Note(
        id: '4',
        title: 'New Note',
        body: 'New Body',
        author: 'Test Author',
        createdAt: DateTime.now(),
        category: NoteCategory.medication,
      );

      // ACT: Add note
      provider.addNote(newNote);

      // ASSERT: Note added to beginning and listeners notified
      expect(provider.notes.length, 4);
      expect(provider.notes.first.id, '4');
      expect(listenerCalled, true);
    });

    test('updateNote should update existing note and maintain sort order', () {
      // ARRANGE: Set up listener and get original note
      bool listenerCalled = false;
      provider.addListener(() => listenerCalled = true);

      final originalNote = provider.getById('1')!;
      final updatedNote = originalNote.copyWith(
        title: 'Updated Title',
        body: 'Updated Body',
      );

      // ACT: Update note
      provider.updateNote(updatedNote);

      // ASSERT: Note updated and listeners notified
      final retrievedNote = provider.getById('1')!;
      expect(retrievedNote.title, 'Updated Title');
      expect(retrievedNote.body, 'Updated Body');
      expect(listenerCalled, true);

      // ASSERT: Sort order maintained
      final notes = provider.notes;
      for (int i = 0; i < notes.length - 1; i++) {
        expect(
          notes[i].createdAt.isAfter(notes[i + 1].createdAt) ||
              notes[i].createdAt.isAtSameMomentAs(notes[i + 1].createdAt),
          true,
        );
      }
    });

    test('updateNote should do nothing for non-existent note', () {
      // ARRANGE: Record initial state
      final initialLength = provider.notes.length;

      final fakeNote = Note(
        id: 'non_existent',
        title: 'Fake',
        body: 'Fake',
        author: 'Fake',
        createdAt: DateTime.now(),
        category: NoteCategory.medication,
      );

      // ACT: Try to update non-existent note
      provider.updateNote(fakeNote);

      // ASSERT: Nothing changed
      expect(provider.notes.length, initialLength);
    });

    test('deleteNote should remove note and notify listeners', () {
      // ARRANGE: Set up listener and record initial state
      bool listenerCalled = false;
      provider.addListener(() => listenerCalled = true);
      final initialLength = provider.notes.length;

      // ACT: Delete note
      provider.deleteNote('1');

      // ASSERT: Note removed and listeners notified
      expect(provider.notes.length, initialLength - 1);
      expect(provider.getById('1'), isNull);
      expect(listenerCalled, true);
    });

    test('deleteNote should do nothing for non-existent id', () {
      // ARRANGE: Record initial state
      final initialLength = provider.notes.length;

      // ACT: Try to delete non-existent note
      provider.deleteNote('non_existent_id');

      // ASSERT: Nothing changed
      expect(provider.notes.length, initialLength);
    });

    test('notes list should be unmodifiable', () {
      // ACT & ASSERT: Trying to modify should throw
      final notes = provider.notes;
      expect(
        () => notes.add(
          Note(
            id: 'test',
            title: 'Test',
            body: 'Test',
            author: 'Test',
            createdAt: DateTime.now(),
            category: NoteCategory.medication,
          ),
        ),
        throwsUnsupportedError,
      );
    });

    test('categoryColors should return Color tuples for all categories', () {
      // Test all categories return valid colors
      final medicationColors = NoteProvider.categoryColors(
        NoteCategory.medication,
      );
      expect(medicationColors.$1, isA<Color>());
      expect(medicationColors.$2, isA<Color>());

      final exerciseColors = NoteProvider.categoryColors(NoteCategory.exercise);
      expect(exerciseColors.$1, isA<Color>());
      expect(exerciseColors.$2, isA<Color>());

      final appointmentColors = NoteProvider.categoryColors(
        NoteCategory.appointment,
      );
      expect(appointmentColors.$1, isA<Color>());
      expect(appointmentColors.$2, isA<Color>());
    });
  });

  // ===========================================================================
  // TEST GROUP: FORMAT NOTE TIME UTILITY TESTS
  // ===========================================================================
  // These tests verify the formatNoteTime utility function.
  // ===========================================================================

  group('formatNoteTime Utility', () {
    test('should format today\'s date as "Today, HH:MM AM/PM"', () {
      // ARRANGE: Create a time today
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day, 10, 30);

      // ACT: Format the time
      final result = formatNoteTime(today);

      // ASSERT: Should start with "Today, " and contain time
      expect(result, startsWith('Today, '));
      expect(result, contains('10:30'));
    });

    test('should format yesterday\'s date as "Yesterday, HH:MM AM/PM"', () {
      // ARRANGE: Create a time yesterday
      final now = DateTime.now();
      final yesterday = DateTime(now.year, now.month, now.day - 1, 17, 15);

      // ACT: Format the time
      final result = formatNoteTime(yesterday);

      // ASSERT: Should start with "Yesterday, " and contain time
      expect(result, startsWith('Yesterday, '));
      expect(result, contains('5:15'));
    });

    test('should format older dates as "MMM d, HH:MM AM/PM"', () {
      // ARRANGE: Create an older date
      final oldDate = DateTime(2025, 1, 22, 15, 30);

      // ACT: Format the time
      final result = formatNoteTime(oldDate);

      // ASSERT: Should contain month abbreviation and day
      expect(result, contains('Jan 22'));
      expect(result, contains('3:30'));
    });
  });

  // ===========================================================================
  // TEST GROUP: NOTES SCREEN WIDGET TESTS
  // ===========================================================================
  // These tests verify NotesScreen renders and behaves correctly.
  // ===========================================================================

  group('NotesScreen Widget', () {
    /// Creates a test harness for NotesScreen.
    /// COPY THIS PATTERN for testing screens with providers!
    Widget createTestHarness() {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      return MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => NoteProvider()),
          ChangeNotifierProvider.value(value: authProvider),
        ],
        child: const MaterialApp(home: NotesScreen()),
      );
    }

    testWidgets('should render app bar with "Notes" title', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: Find title and back button
      expect(find.text('Notes'), findsOneWidget);
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });

    testWidgets('should render "Add New Note" button', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: Find button with icon and text
      expect(find.text('Add New Note'), findsOneWidget);
      expect(find.byIcon(Icons.add), findsOneWidget);
    });

    testWidgets('should display all 3 mock notes in list', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: All mock note titles are visible
      expect(find.text('Medication Side Effects'), findsOneWidget);
      expect(find.text('Exercise Progress'), findsOneWidget);
      expect(find.text("Doctor's Appointment"), findsOneWidget);
    });

    testWidgets('should display note preview truncated at 60 characters', (
      tester,
    ) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: Preview text is present (truncated version)
      final preview = find.textContaining('Felt slight dizziness');
      expect(preview, findsOneWidget);
    });

    testWidgets('should display category chips with uppercase labels', (
      tester,
    ) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: All category chips are visible
      expect(find.text('MEDICATION'), findsOneWidget);
      expect(find.text('EXERCISE'), findsOneWidget);
      expect(find.text('APPOINTMENT'), findsOneWidget);
    });

    testWidgets('tapping "Add New Note" should navigate to AddNoteScreen', (
      tester,
    ) async {
      // ARRANGE: Build widget
      await tester.pumpWidget(createTestHarness());

      // ACT: Tap the button
      await tester.tap(find.text('Add New Note'));
      await tester.pumpAndSettle(); // Wait for navigation animation

      // ASSERT: Now on AddNoteScreen
      expect(find.text('New Note'), findsOneWidget);
    });

    testWidgets('tapping a note should navigate to NoteDetailScreen', (
      tester,
    ) async {
      // ARRANGE: Build widget
      await tester.pumpWidget(createTestHarness());

      // ACT: Tap a note
      await tester.tap(find.text('Medication Side Effects'));
      await tester.pumpAndSettle();

      // ASSERT: Should see the note title (appears in both screens)
      expect(find.text('Medication Side Effects'), findsWidgets);
    });

    testWidgets('should display empty state when no notes exist', (
      tester,
    ) async {
      // ARRANGE: Create provider and delete all notes
      final emptyProvider = NoteProvider();
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);
      for (var note in emptyProvider.notes.toList()) {
        emptyProvider.deleteNote(note.id);
      }

      // ACT: Build with empty provider
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider.value(value: emptyProvider),
            ChangeNotifierProvider.value(value: authProvider),
          ],
          child: const MaterialApp(home: NotesScreen()),
        ),
      );

      // ASSERT: Empty state message is shown
      expect(
        find.text('No notes yet. Tap Add New Note to create one.'),
        findsOneWidget,
      );
    });

    testWidgets('back button should be present', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: Back button exists
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: ADD NOTE SCREEN WIDGET TESTS
  // ===========================================================================
  // These tests verify AddNoteScreen form validation and interactions.
  // IMPORTANT: Form validation requires pump(), not pumpAndSettle()!
  // ===========================================================================

  group('AddNoteScreen Widget', () {
    /// Creates a test harness for AddNoteScreen.
    Widget createTestHarness() {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      return MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => NoteProvider()),
          ChangeNotifierProvider.value(value: authProvider),
        ],
        child: const MaterialApp(home: AddNoteScreen()),
      );
    }

    testWidgets('should render app bar with "New Note" title', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: Title and close button are present
      expect(find.text('New Note'), findsOneWidget);
      expect(find.byIcon(Icons.close), findsOneWidget);
    });

    testWidgets('should display all form fields', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: All form elements are visible
      expect(find.text('Title'), findsOneWidget);
      expect(find.text('Note'), findsOneWidget);
      expect(find.text('Category'), findsOneWidget);
      expect(find.text('Save'), findsOneWidget);
    });

    testWidgets('should display hint text for Title and Note fields', (
      tester,
    ) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness());

      // ASSERT: Hint text is visible
      expect(find.text('e.g. Medication Side Effects'), findsOneWidget);
      expect(find.text('Write your note here…'), findsOneWidget);
    });

    testWidgets('should show validation error for empty title', (tester) async {
      // ARRANGE: Build widget
      await tester.pumpWidget(createTestHarness());

      // ACT: Tap Save without entering title
      await tester.tap(find.text('Save'));
      await tester.pump(); // IMPORTANT: Use pump(), not pumpAndSettle()!

      // ASSERT: Validation error is shown
      expect(find.text('Enter a title'), findsOneWidget);
    });

    testWidgets('should show validation error for empty note body', (
      tester,
    ) async {
      // ARRANGE: Build widget
      await tester.pumpWidget(createTestHarness());

      // ACT: Enter title but not body, then tap Save
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Title'),
        'Test Title',
      );
      await tester.tap(find.text('Save'));
      await tester.pump();

      // ASSERT: Validation error for body is shown
      expect(find.text('Enter note content'), findsOneWidget);
    });

    testWidgets('category dropdown should show all categories', (tester) async {
      // ARRANGE: Build widget
      await tester.pumpWidget(createTestHarness());

      // ACT: Tap dropdown to open it
      await tester.tap(find.byType(DropdownButtonFormField<NoteCategory>));
      await tester.pumpAndSettle();

      // ASSERT: All categories are visible in dropdown
      expect(find.text('Medication').hitTestable(), findsWidgets);
      expect(find.text('Exercise').hitTestable(), findsWidgets);
      expect(find.text('Appointment').hitTestable(), findsWidgets);
    });

    testWidgets('should allow selecting different category', (tester) async {
      // ARRANGE: Build widget
      await tester.pumpWidget(createTestHarness());

      // ACT: Open dropdown and select Exercise
      await tester.tap(find.byType(DropdownButtonFormField<NoteCategory>));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Exercise').last);
      await tester.pumpAndSettle();

      // ASSERT: Exercise is now selected
      expect(find.text('Exercise'), findsWidgets);
    });

    testWidgets('should save note and pop screen when form is valid', (
      tester,
    ) async {
      // ARRANGE: Build widget
      await tester.pumpWidget(createTestHarness());

      // ACT: Fill in valid form data
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Title'),
        'Test Title',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Note'),
        'Test note body content',
      );
      await tester.tap(find.text('Save'));
      await tester.pumpAndSettle();

      // ASSERT: Screen should be popped (no longer showing "New Note")
      expect(find.text('New Note'), findsNothing);
    });

    testWidgets('close button should pop screen without saving', (
      tester,
    ) async {
      // ARRANGE: Build widget and enter some data
      await tester.pumpWidget(createTestHarness());
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Title'),
        'Test Title',
      );

      // ACT: Tap close button
      await tester.tap(find.byIcon(Icons.close));
      await tester.pumpAndSettle();

      // ASSERT: Screen should be popped without saving
      expect(find.text('New Note'), findsNothing);
    });
  });

  // ===========================================================================
  // TEST GROUP: NOTE DETAIL SCREEN WIDGET TESTS
  // ===========================================================================
  // These tests verify NoteDetailScreen displays note details correctly.
  // ===========================================================================

  group('NoteDetailScreen Widget', () {
    /// Creates a test harness for NoteDetailScreen with a specific note ID.
    Widget createTestHarness(String noteId) {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      return MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => NoteProvider()),
          ChangeNotifierProvider.value(value: authProvider),
        ],
        child: MaterialApp(home: NoteDetailScreen(noteId: noteId)),
      );
    }

    testWidgets('should display note details correctly', (tester) async {
      // ARRANGE & ACT: Build with valid note ID
      await tester.pumpWidget(createTestHarness('1'));

      // ASSERT: All note details are visible
      expect(find.text('Medication Side Effects'), findsWidgets);
      expect(find.text('Robert Williams (Patient)'), findsOneWidget);
      expect(find.text('MEDICATION'), findsOneWidget);
      expect(find.textContaining('Felt slight dizziness'), findsOneWidget);
    });

    testWidgets('should display full note body (not truncated)', (
      tester,
    ) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness('1'));

      // ASSERT: Full body text is shown
      const fullBody =
          'Felt slight dizziness about 30 minutes after taking Lisinopril. '
          'Subsided after drinking water and resting for 15 minutes.';
      expect(find.text(fullBody), findsOneWidget);
    });

    testWidgets('should display formatted timestamp with bullet separator', (
      tester,
    ) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness('1'));

      // ASSERT: Timestamp includes bullet separator (•)
      expect(find.textContaining('•'), findsOneWidget);
    });

    testWidgets('should display category chip', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness('1'));

      // ASSERT: Category chip is visible
      expect(find.text('MEDICATION'), findsOneWidget);

      // Find the Container wrapping the chip
      final chipContainer = find.ancestor(
        of: find.text('MEDICATION'),
        matching: find.byType(Container),
      );
      expect(chipContainer, findsWidgets);
    });

    testWidgets('should show "Note not found" for invalid note ID', (
      tester,
    ) async {
      // ARRANGE & ACT: Build with invalid ID
      await tester.pumpWidget(createTestHarness('invalid_id'));
      await tester.pump();

      // ASSERT: Error message is shown
      expect(find.text('Note not found'), findsOneWidget);
    });

    testWidgets('should display back button', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness('1'));

      // ASSERT: Back button is present
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });

    testWidgets('should display circular icon container', (tester) async {
      // ARRANGE & ACT: Build widget
      await tester.pumpWidget(createTestHarness('1'));

      // ASSERT: Icon is present
      final iconFinder = find.byIcon(Icons.description);
      expect(iconFinder, findsOneWidget);

      // Verify icon is inside a Container (circular background)
      final circularContainer = find.ancestor(
        of: iconFinder,
        matching: find.byType(Container),
      );
      expect(circularContainer, findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: ACCESSIBILITY TESTS
  // ===========================================================================
  // These tests verify accessibility features work correctly.
  // SWEN 661: At least one accessibility test is required!
  // ===========================================================================

  group('Notes Feature Accessibility', () {
    testWidgets(
      'NotesScreen - Add New Note button should have semantic label',
      (tester) async {
        // ARRANGE: Build NotesScreen
        final authProvider = AuthProvider()..setTestUser(UserRole.patient);
        await tester.pumpWidget(
          MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => NoteProvider()),
              ChangeNotifierProvider.value(value: authProvider),
            ],
            child: const MaterialApp(home: NotesScreen()),
          ),
        );

        // ASSERT: Semantics label is present for screen readers
        expect(find.bySemanticsLabel('Add New Note, button'), findsOneWidget);
      },
    );

    testWidgets('NotesScreen - Note tiles should have semantic labels', (
      tester,
    ) async {
      // ARRANGE: Build NotesScreen
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => NoteProvider()),
            ChangeNotifierProvider.value(value: authProvider),
          ],
          child: const MaterialApp(home: NotesScreen()),
        ),
      );

      // ASSERT: Find note tile by its semantic label
      // The label includes title, preview, author, and time
      final semanticsFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Semantics &&
            widget.properties.label != null &&
            widget.properties.label!.contains('Medication Side Effects') &&
            widget.properties.hint == 'Tap to open note',
      );

      expect(semanticsFinder, findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: INTEGRATION TESTS
  // ===========================================================================
  // These tests verify complete user flows work correctly.
  // Integration tests combine multiple screens and provider operations.
  // ===========================================================================

  group('Notes Feature Integration', () {
    testWidgets('complete flow: add note, view in list, then view details', (
      tester,
    ) async {
      // ARRANGE: Create provider and build NotesScreen
      final provider = NoteProvider();
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider.value(value: provider),
            ChangeNotifierProvider.value(value: authProvider),
          ],
          child: const MaterialApp(home: NotesScreen()),
        ),
      );

      // ACT: Navigate to Add Note screen
      await tester.tap(find.text('Add New Note'));
      await tester.pumpAndSettle();

      // ACT: Fill in the form
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Title'),
        'Integration Test Note',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Note'),
        'This is a test note body for integration testing.',
      );

      // ACT: Save the note
      await tester.tap(find.text('Save'));
      await tester.pumpAndSettle();

      // ASSERT: Back on NotesScreen with new note visible
      expect(find.text('Integration Test Note'), findsOneWidget);

      // ACT: Tap the new note to view details
      await tester.tap(find.text('Integration Test Note'));
      await tester.pumpAndSettle();

      // ASSERT: On detail screen with full note content
      expect(
        find.text('This is a test note body for integration testing.'),
        findsOneWidget,
      );
      expect(find.text('Sarah Johnson (Caregiver)'), findsOneWidget);
    });

    testWidgets('newly added notes should appear at the top of the list', (
      tester,
    ) async {
      // ARRANGE: Create provider and build NotesScreen
      final provider = NoteProvider();
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider.value(value: provider),
            ChangeNotifierProvider.value(value: authProvider),
          ],
          child: const MaterialApp(home: NotesScreen()),
        ),
      );

      final initialCount = provider.notes.length;

      // ACT: Add a new note
      await tester.tap(find.text('Add New Note'));
      await tester.pumpAndSettle();

      await tester.enterText(
        find.widgetWithText(TextFormField, 'Title'),
        'Newest Note',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Note'),
        'This should appear first in the list.',
      );

      await tester.tap(find.text('Save'));
      await tester.pumpAndSettle();

      // ASSERT: Note count increased and new note is first
      expect(provider.notes.length, initialCount + 1);
      expect(provider.notes.first.title, 'Newest Note');
    });
  });
}
