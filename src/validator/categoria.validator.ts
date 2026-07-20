import { z } from "zod";

export const crearCategoriaSchema = z.object({
  nombre: z
    .string()
    .trim() // saca espacios al principio y al final, para evitar " Postres" y "Postres" como si fueran distintas
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .toLowerCase(), // normaliza a minusculas, asi evitamos duplicados tipo "Postres" y "postres"
});
