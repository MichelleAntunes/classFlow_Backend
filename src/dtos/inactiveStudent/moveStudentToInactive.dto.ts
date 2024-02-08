import z from "zod";

export interface MoveStudentToInactiveInputDTO {
  studentId: string;
  token: string;
}

export interface MoveStudentToInactiveOutputDTO {
  message: string;
}

export const MoveStudentToInactiveSchema = z.object({
  studentId: z.string().min(1),
  token: z.string().min(1),
});

export type MoveStudentToInactiveSchemaType = z.infer<
  typeof MoveStudentToInactiveSchema
>;
