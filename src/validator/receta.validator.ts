import { z } from "zod";

export const recetaSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().optional(),
  ingredientes: z.array(z.string()).min(1, "Agregá al menos un ingrediente"),
  pasos: z.array(z.string()).min(1, "Agregá al menos un paso"),
  tiempoMin: z.number().int().positive().optional(),
  porciones: z.number().int().positive().optional(),
  categoriaId: z.number().int().positive().optional(),
});


