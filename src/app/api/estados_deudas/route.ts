import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los estados de deuda
export async function GET(req: Request) {
  try {
    const estadosDeudas = await prisma.estados_deudas.findMany();

    if (!estadosDeudas || estadosDeudas.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron estados de deuda" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, estadosDeudas });
  } catch (error) {
    console.error("Error en GET /api/estados_deudas:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los estados de deuda" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo estado de deuda
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

    const nuevoEstadoDeuda = await prisma.estados_deudas.create({
      data: {
        nombre,
      },
    });

    return NextResponse.json({ result: true, estadoDeuda: nuevoEstadoDeuda });
  } catch (error: any) {
    console.error("Error en POST /api/estados_deudas:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "El estado de deuda ya existe"
            : "Error al crear el estado de deuda",
      },
      { status: 500 }
    );
  }
}
