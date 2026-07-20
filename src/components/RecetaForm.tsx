"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

// Este tipo describe los valores que el formulario envía al servidor.
export type RecetaFormValues = {
  titulo: string;
  descripcion?: string;
  ingredientes: string[];
  pasos: string[];
  tiempoMin?: number;
  porciones?: number;
  categoriaId?: number;
};

type FormState = {
  titulo: string;
  descripcion: string;
  ingredientesText: string;
  pasosText: string;
  tiempoMin: string;
  porciones: string;
  categoriaId: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

interface RecetaFormProps {
  initial?: RecetaFormValues;
  submitLabel: string;
  disabled?: boolean;
  categories: { id: number; nombre: string }[];
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
  categoriaId:
    initial?.categoriaId !== undefined && initial?.categoriaId !== null
      ? String(initial.categoriaId)
      : "",
});

export default function RecetaForm({
  initial,
  submitLabel,
  disabled,
  categories,
  onSubmit,
  externalError,
}: RecetaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: getInitialFormState(initial),
    mode: "onTouched",
  });

  useEffect(() => {
    reset(getInitialFormState(initial));
  }, [initial, reset]);

  const onFormSubmit = async (data: FormState) => {
    const ingredientes = parseLines(data.ingredientesText);
    const pasos = parseLines(data.pasosText);

    await onSubmit({
      titulo: data.titulo.trim(),
      descripcion: data.descripcion.trim() || undefined,
      ingredientes,
      pasos,
      tiempoMin: parseNumber(data.tiempoMin),
      porciones: parseNumber(data.porciones),
      categoriaId: parseNumber(data.categoriaId),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Título
        </label>
        <input
          {...register("titulo", {
            required: "El título es obligatorio.",
            minLength: {
              value: 3,
              message: "El título debe tener al menos 3 caracteres.",
            },
          })}
          disabled={disabled}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
        {errors.titulo?.message && (
          <p className="mt-2 text-sm text-red-600">{errors.titulo.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Descripción
        </label>
        <textarea
          {...register("descripcion")}
          disabled={disabled}
          rows={3}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Categoría
        </label>
        <select
          {...register("categoriaId")}
          disabled={disabled}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <option value="">Sin categoría</option>
          {categories.map((categoria) => (
            <option key={categoria.id} value={String(categoria.id)}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Ingredientes (una línea por ingrediente)
        </label>
        <textarea
          {...register("ingredientesText", {
            required: "Agregá al menos un ingrediente.",
          })}
          disabled={disabled}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
        {errors.ingredientesText?.message && (
          <p className="mt-2 text-sm text-red-600">{errors.ingredientesText.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Pasos (una línea por paso)
        </label>
        <textarea
          {...register("pasosText", {
            required: "Agregá al menos un paso.",
          })}
          disabled={disabled}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
        {errors.pasosText?.message && (
          <p className="mt-2 text-sm text-red-600">{errors.pasosText.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Tiempo en minutos
          </label>
          <input
            {...register("tiempoMin", {
              pattern: {
                value: /^[1-9][0-9]*$/,
                message: "Ingresá un número válido.",
              },
            })}
            disabled={disabled}
            type="number"
            min={1}
            placeholder="Ej. 30"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
          {errors.tiempoMin?.message && (
            <p className="mt-2 text-sm text-red-600">{errors.tiempoMin.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Porciones
          </label>
          <input
            {...register("porciones", {
              pattern: {
                value: /^[1-9][0-9]*$/,
                message: "Ingresá un número válido.",
              },
            })}
            disabled={disabled}
            type="number"
            min={1}
            placeholder="Ej. 4"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
          {errors.porciones?.message && (
            <p className="mt-2 text-sm text-red-600">{errors.porciones.message}</p>
          )}
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
