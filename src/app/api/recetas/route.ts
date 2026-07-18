import prisma from "@/lib/prisma";
import { recetaSchema } from "@/validator/receta.validator";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  try {
    const recetas = await prisma.receta.findMany();
    return NextResponse.json(recetas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ mensaje: "Ocurrió un error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = recetaSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      // const errors = z.treeifyError(result.error)
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return NextResponse.json(errors, { status: 400 });
    }

    const receta = await prisma.receta.create({
      data: result.data,
    });
    return NextResponse.json(receta, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ mensaje: "Ocurrió un error" }, { status: 500 });
  }
}
