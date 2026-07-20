import { NextResponse, NextRequest } from "next/server";

export async function POST(request: Request) {
  try {
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrió un error" },
      { status: 500 }
    );
  }
}