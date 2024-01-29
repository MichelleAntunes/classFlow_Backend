import z from "zod";

export interface DeleteStudentInputDTO {
  token: string;
  idToDelete: string;
}

export interface DeleteStudentOutputDTO {
  message: string;
}

export const DeleteStudentSchema = z
  .object({
    token: z.string(),
    idToEdit: z.string(), // Certifique-se de que está definido como uma string
  })
  .transform(
    (data) =>
      ({
        token: data.token,
        idToDelete: data.idToEdit as string, // Ajuste aqui
      } as DeleteStudentInputDTO)
  );
