import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los contratos
export async function GET(req: Request) {
  try {
    const contratos = await prisma.contratos.findMany();

    if (!contratos || contratos.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron contratos" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, contratos });
  } catch (error) {
    console.error("Error en GET /api/contratos:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los contratos" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo contrato
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_empresa, fecha_inicio, fecha_fin, estado } = body;

    if (!id_empresa || !fecha_inicio || !fecha_fin || estado === undefined) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevoContrato = await prisma.contratos.create({
      data: {
        id_empresa,
        fecha_inicio,
        fecha_fin,
        estado,
      },
    });

    return NextResponse.json({ result: true, contrato: nuevoContrato });
  } catch (error: any) {
    console.error("Error en POST /api/contratos:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "El contrato ya existe"
            : "Error al crear el contrato",
      },
      { status: 500 }
    );
  }
}
