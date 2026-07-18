import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const timestamp = new Date().toLocaleTimeString();

  console.log(`[${timestamp}] 🚀 ${method} en ${pathname}`);
}

// Le dice a Next.js en qué rutas debe ejecutar esta función automáticamente
// matcher: solo se ejecuta cuando la ruta empiece con /api/ seguido de cualquier cosa
// Ejemplo: /api/users ✅,  /api/products/id ✅,  /home ❌
export const config = {
  matcher: "/api/:path*", // :path* = cualquier cosa después de /api/
};
