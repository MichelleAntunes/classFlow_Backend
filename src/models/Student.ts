class Student {
  id: string;
  name: string;
  email: string;
  phone: number | null;
  age: number | null;
  notes: Note[];
  annotations: Annotation[];
  photo: ImageData | string | null;
  teacherId: string;
  classId: string;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: number | null,
    age: number | null,
    notes: Note[],
    annotations: Annotation[],
    photo: ImageData | string | null,
    teacherId: string,
    classId: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.age = age;
    this.notes = notes;
    this.annotations = annotations;
    this.photo = photo;
    this.teacherId = teacherId;
    this.classId = classId;
  }
}
