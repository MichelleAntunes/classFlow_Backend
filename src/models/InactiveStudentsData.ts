class InactiveStudentsData {
  id: string;
  name: string;
  email: string;
  phone?: number;
  age?: number;
  notes: string;
  annotations: string;
  photo: Buffer;
  teacherId: string;
  classId: string;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: number | undefined,
    age: number | undefined,
    notes: string,
    annotations: string,
    photo: Buffer,
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
