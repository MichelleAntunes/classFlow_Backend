import z from "zod";
export interface CreateNoteInputDTO {
  token: string;
  studentId: string;
  notes: string;
}

export interface CreateNoteOutputDTO {
  message: string;
}

export const CreateNoteSchema = z
  .object({
    token: z.string().min(1),
    studentId: z.string().min(1),
    notes: z.string(),
  })
  .transform((data) => data as CreateNoteInputDTO);
