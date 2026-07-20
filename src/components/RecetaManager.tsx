"use client";

import { useEffect, useState } from "react";
import RecetaForm, { RecetaFormValues } from "@/components/RecetaForm";

// Este tipo refleja la estructura de una receta recuperada desde el backend.
type Receta = {
  id: number;
  titulo: string;
  descripcion?: string | null;
  ingredientes: string[];
  pasos: string[];
  tiempoMin?: number | null;
  porciones?: number | null;
};

type LoadStatus = "idle" | "loading" | "success" | "error";

// Base de la URL que corresponde a las rutas API definidas en el backend.
const apiBase = "/api/recetas";

export default function RecetaManager() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [fetchError, setFetchError] = useState<string>("");
  const [operationError, setOperationError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedReceta, setSelectedReceta] = useState<Receta | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const defaultFormValues: RecetaFormValues = {
    titulo: "",
    descripcion: "",
    ingredientes: [],
    pasos: [],
    tiempoMin: undefined,
    porciones: undefined,
  };

  const [formInitialValues, setFormInitialValues] = useState<RecetaFormValues>(
    defaultFormValues,
  );

  // Cargar la lista de recetas cuando el componente se monta.
  useEffect(() => {
    fetchRecetas();
  }, []);

  // Cuando se selecciona una receta para editar, actualizo el formulario con sus valores.
  useEffect(() => {
    if (selectedReceta) {
      setFormInitialValues({
        titulo: selectedReceta.titulo,
        descripcion: selectedReceta.descripcion ?? "",
        ingredientes: selectedReceta.ingredientes,
        pasos: selectedReceta.pasos,
        tiempoMin:
          selectedReceta.tiempoMin !== null
            ? selectedReceta.tiempoMin ?? undefined
            : undefined,
        porciones:
          selectedReceta.porciones !== null
            ? selectedReceta.porciones ?? undefined
            : undefined,
      });
      return;
    }

    setFormInitialValues(defaultFormValues);
  }, [selectedReceta]);

  // Recupera todas las recetas desde la ruta GET /api/recetas.
  const fetchRecetas = async () => {
    setStatus("loading");
    setFetchError("");
    setSuccessMessage("");

    try {
      const response = await fetch(apiBase, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar las recetas.");
      }

      const data: Receta[] = await response.json();
      setRecetas(data);
      setStatus("success");
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error.message
          : "Ocurrió un problema al cargar las recetas.",
      );
      setStatus("error");
    }
  };

  // Extrae un mensaje de error amigable de la respuesta de la API.
  const buildApiError = async (response: Response) => {
    try {
      const json = await response.json();
      if (json && typeof json === "object") {
        if ("mensaje" in json && typeof json.mensaje === "string") {
          return json.mensaje;
        }
        return Object.values(json)
          .filter((value) => typeof value === "string")
          .join(" \n ")
          .trim();
      }
    } catch {
      // ignore parse errors
    }
    return `Error ${response.status}`;
  };

  // Crea una nueva receta usando la ruta POST /api/recetas.
  const handleCreate = async (values: RecetaFormValues) => {
    setIsSaving(true);
    setOperationError("");
    setSuccessMessage("");

    try {
      const response = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const message = await buildApiError(response);
        throw new Error(message || "No se pudo crear la receta.");
      }

      setSuccessMessage("Receta creada correctamente.");
      await fetchRecetas();
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la receta.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Actualiza una receta existente usando la ruta PUT /api/recetas/:id.
  const handleUpdate = async (values: RecetaFormValues) => {
    if (!selectedReceta) {
      setOperationError("No hay receta seleccionada para editar.");
      return;
    }

    setIsSaving(true);
    setOperationError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${apiBase}/${selectedReceta.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const message = await buildApiError(response);
        throw new Error(message || "No se pudo actualizar la receta.");
      }

      setSuccessMessage("Receta actualizada correctamente.");
      setSelectedReceta(null);
      await fetchRecetas();
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la receta.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Elimina una receta usando la ruta DELETE /api/recetas/:id.
  const handleDelete = async (receta: Receta) => {
    const confirmed = window.confirm(
      `¿Eliminar la receta "${receta.titulo}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(receta.id);
    setOperationError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${apiBase}/${receta.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await buildApiError(response);
        throw new Error(message || "No se pudo eliminar la receta.");
      }

      setSuccessMessage("Receta eliminada correctamente.");
      if (selectedReceta?.id === receta.id) {
        setSelectedReceta(null);
      }
      await fetchRecetas();
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la receta.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (receta: Receta) => {
    setSelectedReceta(receta);
    setOperationError("");
    setSuccessMessage("");
  };

  const cancelEdit = () => {
    setSelectedReceta(null);
    setOperationError("");
    setSuccessMessage("");
  };

  const isEditing = selectedReceta !== null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      {/* Contenedor del Formulario Adaptado */}
      <section className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
            {isEditing ? "Editar receta" : "Crear receta"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {isEditing
              ? "Modifica los datos de la receta"
              : "Agrega una nueva receta"}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Completa los campos requeridos y guarda tus cambios.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {successMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {successMessage}
            </div>
          ) : null}

          {operationError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
              {operationError}
            </div>
          ) : null}

          <RecetaForm
            initial={formInitialValues}
            submitLabel={isEditing ? "Actualizar receta" : "Crear receta"}
            disabled={isSaving}
            onSubmit={isEditing ? handleUpdate : handleCreate}
            externalError={operationError}
          />

          {isEditing ? (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={isSaving}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancelar edición
            </button>
          ) : null}
        </div>
      </section>

      {/* Contenedor del Listado */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Listado de recetas
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Todas tus recetas
            </h2>
          </div>
          <button
            type="button"
            onClick={fetchRecetas}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Actualizar lista
          </button>
        </div>

        {status === "loading" ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
            Cargando recetas, por favor esperá un momento.
          </div>
        ) : status === "error" ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p>{fetchError || "No se pudo cargar la lista de recetas."}</p>
            <button
              onClick={fetchRecetas}
              className="mt-4 inline-flex rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              Reintentar
            </button>
          </div>
        ) : recetas.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
            Aún no hay recetas. Completá el formulario para crear la primera.
          </div>
        ) : (
          <div className="space-y-4">
            {recetas.map((receta) => (
              <article
                key={receta.id}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-50/80"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {receta.titulo}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {receta.descripcion || "Sin descripción."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditing(receta)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(receta)}
                      disabled={deletingId === receta.id}
                      className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingId === receta.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-3.5 text-xs text-slate-700 shadow-sm">
                    <p className="font-semibold text-slate-900">Ingredientes</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                      {receta.ingredientes.map((ingrediente, index) => (
                        <li key={index}>{ingrediente}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 text-xs text-slate-700 shadow-sm">
                    <p className="font-semibold text-slate-900">Pasos</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-4">
                      {receta.pasos.map((paso, index) => (
                        <li key={index}>{paso}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                  {receta.tiempoMin ? (
                    <span className="rounded-md bg-slate-200/60 px-2 py-1">
                      ⏱️ {receta.tiempoMin} min
                    </span>
                  ) : null}
                  {receta.porciones ? (
                    <span className="rounded-md bg-slate-200/60 px-2 py-1">
                      🍽️ {receta.porciones} porciones
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}