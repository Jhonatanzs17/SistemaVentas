import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todas las ventas
export async function GET(req: Request) {
  try {
    const ventas = await prisma.ventas.findMany();

    if (!ventas || ventas.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron ventas" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, ventas });
  } catch (error) {
    console.error("Error en GET /api/ventas:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener las ventas" },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva venta
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_usuario, fecha } = body;

    if (!id_usuario || !fecha) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevaVenta = await prisma.ventas.create({
      data: {
        id_usuario,
        fecha,
      },
    });

    return NextResponse.json({ result: true, venta: nuevaVenta });
  } catch (error: any) {
    console.error("Error en POST /api/ventas:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "La venta ya existe"
            : "Error al crear la venta",
      },
      { status: 500 }
    );
  }
}
