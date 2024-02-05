import z from "zod";
export interface EditAnnotationInputDTO {
  token: string;
  idToEdit: string;
  annotation: string;
}

export interface EditAnnotationOutputDTO {
  message: string;
}

export const EditAnnotationSchema = z
  .object({
    token: z.string().min(1),
    idToEdit: z.string().min(1),
    annotation: z.string().min(1),
  })
  .transform((data) => data as EditAnnotationInputDTO);
