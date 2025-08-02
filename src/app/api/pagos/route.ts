import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los pagos
export async function GET(req: Request) {
  try {
    const pagos = await prisma.pagos.findMany();

    if (!pagos || pagos.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron pagos" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, pagos });
  } catch (error) {
    console.error("Error en GET /api/pagos:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los pagos" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo pago
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_cliente, monto, metodo_pago, observaciones, fecha } = body;

    if (!id_cliente || !monto || !metodo_pago || !fecha) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevoPago = await prisma.pagos.create({
      data: {
        id_cliente,
        monto,
        metodo_pago,
        observaciones,
        fecha,
      },
    });

    return NextResponse.json({ result: true, pago: nuevoPago });
  } catch (error: any) {
    console.error("Error en POST /api/pagos:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "El pago ya existe"
            : "Error al crear el pago",
      },
      { status: 500 }
    );
  }
}
