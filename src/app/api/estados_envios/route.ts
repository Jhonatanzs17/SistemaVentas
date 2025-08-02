import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los estados de envío
export async function GET(req: Request) {
  try {
    const estadosEnvios = await prisma.estados_envios.findMany();

    if (!estadosEnvios || estadosEnvios.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron estados de envío" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, estadosEnvios });
  } catch (error) {
    console.error("Error en GET /api/estados_envios:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los estados de envío" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo estado de envío
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

    const nuevoEstadoEnvio = await prisma.estados_envios.create({
      data: {
        nombre,
      },
    });

    return NextResponse.json({ result: true, estadoEnvio: nuevoEstadoEnvio });
  } catch (error: any) {
    console.error("Error en POST /api/estados_envios:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "El estado de envío ya existe"
            : "Error al crear el estado de envío",
      },
      { status: 500 }
    );
  }
}
