import prisma from "@/lib/prisma";
import { Receta } from "@/generated/prisma/client";
import { recetaSchema } from "@/validator/receta.validator";
import { NextResponse, NextRequest } from "next/server";

//Funcion auxiliar para buscar por id!
const getReceta = async (id: string): Promise<Receta | null> => {
  const receta = await prisma.receta.findUnique({
    where: { id: Number(id) },
  });
  return receta;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const receta = await getReceta(id);
    if (!receta) {
      return NextResponse.json(
        { mensaje: "Receta no encontrada" },
        { status: 404 },
      );
    }
    return NextResponse.json(receta);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrió un error al obtener una receta" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const receta = await getReceta(id);
    if (!receta) {
      return NextResponse.json(
        { mensaje: "Receta no encontrada" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const result = recetaSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      return NextResponse.json(errors, { status: 400 });
    }

    const actualizarReceta = await prisma.receta.update({
      where: { id: Number(id) },
      data: result.data,
    });
    return NextResponse.json(actualizarReceta, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ mensaje: "Ocurrió un error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const receta = await getReceta(id);
    if (!receta) {
      return NextResponse.json(
        { mensaje: "Receta no encontrada" },
        { status: 404 },
      );
    }

    const recetaEliminada = await prisma.receta.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(recetaEliminada, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ mensaje: "Ocurrió un error" }, { status: 500 });
  }
}
