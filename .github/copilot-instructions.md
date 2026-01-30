# Copilot instructions

## Repo layout (multi-app workspace)

- Flutter app lives in [flutter_app/](flutter_app/). Entry point and global providers are wired in [flutter_app/lib/main.dart](flutter_app/lib/main.dart).
- React web app is a Create React App in [react_web_app/](react_web_app/).
- Electron app is a minimal shell in [electron_app/](electron_app/).
- React Native app folder exists in [react_native_app/](react_native_app/), but no app code surfaced in this scan.

## Flutter architecture and patterns

- State is centralized with Provider in [flutter_app/lib/main.dart](flutter_app/lib/main.dart); `TaskProvider`, `NotificationProvider`, and `NoteProvider` are `ChangeNotifier`s.
- Providers seed in-memory mock data in their constructors (see [flutter_app/lib/providers/task_provider.dart](flutter_app/lib/providers/task_provider.dart), [flutter_app/lib/providers/note_provider.dart](flutter_app/lib/providers/note_provider.dart), [flutter_app/lib/providers/notification_provider.dart](flutter_app/lib/providers/notification_provider.dart)). Keep this pattern if adding demo data.
- Models are simple immutable data objects with `copyWith()` and optional helpers (see [flutter_app/lib/models/note.dart](flutter_app/lib/models/note.dart), [flutter_app/lib/models/task.dart](flutter_app/lib/models/task.dart), [flutter_app/lib/models/notification_item.dart](flutter_app/lib/models/notification_item.dart)).
- Notes flow: list screen uses `context.watch<NoteProvider>()`, pushes a screen with `MaterialPageRoute`, and expects a `Note` from `Navigator.pop` (see [flutter_app/lib/screens/notes_screen.dart](flutter_app/lib/screens/notes_screen.dart), [flutter_app/lib/screens/notes_add_screen.dart](flutter_app/lib/screens/notes_add_screen.dart)).
- The app uses a centralized color system in [flutter_app/lib/theme/app_colors.dart](flutter_app/lib/theme/app_colors.dart); light/dark `ColorScheme`s are defined in [flutter_app/lib/main.dart](flutter_app/lib/main.dart). Always use `AppColors` and the theme `ColorScheme` for UI colors (no hard-coded colors). This is important for dark mode support.
- Date/time display uses `intl`’s `DateFormat` for UI labels (e.g., notes and notifications screens/providers).
- Accessibility: UI elements include `Semantics` labels for screen reader hints in the notes list (see [flutter_app/lib/screens/notes_screen.dart](flutter_app/lib/screens/notes_screen.dart)). Also read the guidelines in [guidelines.md](guidelines.md).

## React web app (CRA)

- Standard CRA scripts are defined in [react_web_app/package.json](react_web_app/package.json) and documented in [react_web_app/README.md](react_web_app/README.md).

## Electron app

- Minimal setup with Electron dependency and only a placeholder test script in [electron_app/package.json](electron_app/package.json).

## Known dependencies

- Flutter: `provider` for state management and `intl` for date/time formatting (see [flutter_app/pubspec.yaml](flutter_app/pubspec.yaml)).
- React web: `react-scripts` with Testing Library stack (see [react_web_app/package.json](react_web_app/package.json)).

## Tests and assets

- Flutter widget tests are present under [flutter_app/test/](flutter_app/test/), including tests for notes, notifications, and calendar flows.
- Flutter build artifacts and coverage output exist under [flutter_app/build/](flutter_app/build/) and [flutter_app/coverage/](flutter_app/coverage/); do not edit these.
