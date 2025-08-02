import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los roles
export async function GET(req: Request) {
  try {
    const roles = await prisma.roles.findMany();

    if (!roles || roles.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron roles" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, roles });
  } catch (error) {
    console.error("Error en GET /api/roles:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los roles" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo rol
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rol } = body;

    if (!rol) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevoRol = await prisma.roles.create({
      data: { rol },
    });

    return NextResponse.json({ result: true, rol: nuevoRol });
  } catch (error: any) {
    console.error("Error en POST /api/roles:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002" ? "El rol ya existe" : "Error al crear el rol",
      },
      { status: 500 }
    );
  }
}
