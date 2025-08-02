import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los estados de factura
export async function GET(req: Request) {
  try {
    const estadosFacturas = await prisma.estados_facturas.findMany();

    if (!estadosFacturas || estadosFacturas.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron estados de factura" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, estadosFacturas });
  } catch (error) {
    console.error("Error en GET /api/estados_facturas:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los estados de factura" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo estado de factura
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

    const nuevoEstadoFactura = await prisma.estados_facturas.create({
      data: {
        nombre,
      },
    });

    return NextResponse.json({
      result: true,
      estadoFactura: nuevoEstadoFactura,
    });
  } catch (error: any) {
    console.error("Error en POST /api/estados_facturas:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "El estado de factura ya existe"
            : "Error al crear el estado de factura",
      },
      { status: 500 }
    );
  }
}
