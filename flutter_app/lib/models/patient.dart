class Patient {
  final String id;
  final String name;

  Patient({
    required this.id,
    required this.name,
  });

  Patient copyWith({String? id, String? name}) {
    return Patient(
      id: id ?? this.id,
      name: name ?? this.name,
    );
  }
}
