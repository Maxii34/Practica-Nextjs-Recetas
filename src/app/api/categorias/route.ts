import prisma from "@/lib/prisma";
import { crearCategoriaSchema } from "@/validator/categoria.validator";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  try {
    const categoria = await prisma.categoria.findMany();
    return NextResponse.json(categoria, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ mensaje: "Ocurrió un error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = crearCategoriaSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      return NextResponse.json(errors, { status: 400 });
    }
    const { nombre } = result.data;
    const existente = await prisma.categoria.findUnique({
      where: { nombre },
    });
    // si ya existe, se corta
    if (existente) {
      return NextResponse.json(
        { mensaje: "Ya existe una categoria con ese nombre" },
        { status: 409 },
      );
    }

    const categoria = await prisma.categoria.create({
      data: result.data,
    });
    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ mensaje: "Ocurrió un error" }, { status: 500 });
  }
}
