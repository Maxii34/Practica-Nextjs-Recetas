"use client";

import { useEffect, useState } from "react";

// Este tipo describe los valores que el formulario envía al servidor.
export type RecetaFormValues = {
  titulo: string;
  descripcion?: string;
  ingredientes: string[];
  pasos: string[];
  tiempoMin?: number;
  porciones?: number;
};

type FormState = {
  titulo: string;
  descripcion: string;
  ingredientesText: string;
  pasosText: string;
  tiempoMin: string;
  porciones: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

interface RecetaFormProps {
  initial?: RecetaFormValues;
  submitLabel: string;
  disabled?: boolean;
  onSubmit: (values: RecetaFormValues) => Promise<void>;
  externalError?: string;
}

// Convierte un texto multilinea en un array limpiando espacios en blanco.
const parseLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

// Convierte un string numérico en un número positivo o undefined si no es válido.
const parseNumber = (value: string) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : undefined;
};

// Crea el estado interno del formulario a partir de valores iniciales o valores vacíos.
const getInitialFormState = (initial?: RecetaFormValues): FormState => ({
  titulo: initial?.titulo ?? "",
  descripcion: initial?.descripcion ?? "",
  ingredientesText: initial?.ingredientes.join("\n") ?? "",
  pasosText: initial?.pasos.join("\n") ?? "",
  tiempoMin:
    initial?.tiempoMin !== undefined && initial?.tiempoMin !== null
      ? String(initial.tiempoMin)
      : "",
  porciones:
    initial?.porciones !== undefined && initial?.porciones !== null
      ? String(initial.porciones)
      : "",
});

export default function RecetaForm({
  initial,
  submitLabel,
  disabled,
  onSubmit,
  externalError,
}: RecetaFormProps) {
  const [values, setValues] = useState<FormState>(getInitialFormState(initial));
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setValues(getInitialFormState(initial));
    setErrors({});
  }, [initial]);

  // Actualiza el estado del formulario y borra el error específico del campo.
  const handleChange = (field: keyof FormState, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  // Valida el formulario en el cliente, luego llama a onSubmit si pasa.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ingredientes = parseLines(values.ingredientesText);
    const pasos = parseLines(values.pasosText);
    const validationErrors: FieldErrors = {};

    if (!values.titulo.trim()) {
      validationErrors.titulo = "El título es obligatorio.";
    }
    if (!ingredientes.length) {
      validationErrors.ingredientesText =
        "Agregá al menos un ingrediente.";
    }
    if (!pasos.length) {
      validationErrors.pasosText = "Agregá al menos un paso.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Envío los datos limpios al manejador del formulario.
    await onSubmit({
      titulo: values.titulo.trim(),
      descripcion: values.descripcion.trim() || undefined,
      ingredientes,
      pasos,
      tiempoMin: parseNumber(values.tiempoMin),
      porciones: parseNumber(values.porciones),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Título
        </label>
        <input
          value={values.titulo}
          onChange={(event) => handleChange("titulo", event.target.value)}
          disabled={disabled}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
        {errors.titulo && (
          <p className="mt-2 text-sm text-red-600">{errors.titulo}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Descripción
        </label>
        <textarea
          value={values.descripcion}
          onChange={(event) => handleChange("descripcion", event.target.value)}
          disabled={disabled}
          rows={3}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Ingredientes (una línea por ingrediente)
        </label>
        <textarea
          value={values.ingredientesText}
          onChange={(event) =>
            handleChange("ingredientesText", event.target.value)
          }
          disabled={disabled}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
        {errors.ingredientesText && (
          <p className="mt-2 text-sm text-red-600">{errors.ingredientesText}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Pasos (una línea por paso)
        </label>
        <textarea
          value={values.pasosText}
          onChange={(event) => handleChange("pasosText", event.target.value)}
          disabled={disabled}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
        {errors.pasosText && (
          <p className="mt-2 text-sm text-red-600">{errors.pasosText}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Tiempo en minutos
          </label>
          <input
            value={values.tiempoMin}
            onChange={(event) => handleChange("tiempoMin", event.target.value)}
            disabled={disabled}
            type="number"
            min={1}
            placeholder="Ej. 30"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Porciones
          </label>
          <input
            value={values.porciones}
            onChange={(event) => handleChange("porciones", event.target.value)}
            disabled={disabled}
            type="number"
            min={1}
            placeholder="Ej. 4"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
      </div>

      {externalError ? (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {externalError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex w-full justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitLabel}
      </button>
    </form>
  );
}
