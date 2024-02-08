import z from "zod";

export interface DeleteAnnotationInputDTO {
  token: string;
  idToDelete: string;
}

export interface DeleteAnnotationOutputDTO {
  message: string;
}

export const DeleteAnnotationSchema = z
  .object({
    token: z.string(),
    idToDelete: z.string(),
  })
  .transform((data) => data as DeleteAnnotationInputDTO);
