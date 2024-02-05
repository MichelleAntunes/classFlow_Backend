import z from "zod";
export interface CreateAnnotationInputDTO {
  token: string;
  studentId: string;
  annotations: string;
}

export interface CreateAnnotationOutputDTO {
  message: string;
}

export const CreateAnnotationSchema = z
  .object({
    token: z.string().min(1),
    studentId: z.string().min(1),
    annotations: z.string(),
  })
  .transform((data) => data as CreateAnnotationInputDTO);
