import z from "zod";
export interface EditStudentInputDTO {
  name: string;
  token: string;
  idToEdit: string;
}

export interface EditStudentOutputDTO {
  message: string;
}

export const EditStudentSchema = z
  .object({
    name: z.string().min(1),
    token: z.string().min(1),
    idToEdit: z.string().min(1),
  })
  .transform((data) => data as EditStudentInputDTO);
