import z from "zod";
export interface EditStudentInputDTO {
  name: string;
  token: string;
  idToEdit: string;
  age: number;
  email: string;
  phone: string;
  // notes: string[];
  // annotations: string[];
  photo: string;
}

export interface EditStudentOutputDTO {
  message: string;
}

export const EditStudentSchema = z
  .object({
    name: z.string().min(1).optional(),
    token: z.string().min(1),

    idToEdit: z.string().min(1),
    age: z.number().min(1).optional(),
    email: z.string().email().optional(),
    phone: z
      .string()
      .refine((value) => /^(?:\+|\d{0,4}\s?)?\d{6,14}$/.test(value), {
        message: "'phone' deve ser um número de telefone válido",
      })
      .optional(),
    // notes: z.array(z.string()).default([]),
    // annotations: z.array(z.string()).default([]),
    photo: z
      .string()
      .refine(
        (value) => {
          const isURL = /^(ftp|http|https):\/\/[^ "]+$/.test(value);
          const isImageData = /^data:image\/.+/.test(value);

          return isURL || isImageData;
        },
        {
          message: "'photo' deve ser uma URL válida ou em formatos JPEG pu PNG",
        }
      )
      .optional(),
  })
  .transform((data) => data as EditStudentInputDTO);

// Phone:
// Can start with "+" to indicate an international call.
// Can have up to 4 digits after the "+" (to accommodate country codes).
// May or may not have whitespace after the country code.
// Must have between 6 and 14 digits.
