import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todas las empresas
export async function GET(req: Request) {
  try {
    const empresas = await prisma.empresas.findMany();

    if (!empresas || empresas.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron empresas" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, empresas });
  } catch (error) {
    console.error("Error en GET /api/empresas:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener las empresas" },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva empresa
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre } = body;

    if (!nombre) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevaEmpresa = await prisma.empresas.create({
      data: { nombre },
    });

    return NextResponse.json({ result: true, empresa: nuevaEmpresa });
  } catch (error: any) {
    console.error("Error en POST /api/empresas:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "La empresa ya existe"
            : "Error al crear la empresa",
      },
      { status: 500 }
    );
  }
}
