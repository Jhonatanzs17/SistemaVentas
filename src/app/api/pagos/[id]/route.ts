import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un pago por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const pago = await prisma.pagos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pago) {
      return NextResponse.json(
        { result: false, error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, pago });
  } catch (error) {
    console.error("Error en GET /api/pagos/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el pago" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un pago por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { id_cliente, monto, metodo_pago, observaciones, fecha } = body;

    if (!id_cliente || !monto || !metodo_pago || !fecha) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const pagoActualizado = await prisma.pagos.update({
      where: { id: parseInt(id) },
      data: {
        id_cliente,
        monto,
        metodo_pago,
        observaciones,
        fecha,
      },
    });

    return NextResponse.json({ result: true, pago: pagoActualizado });
  } catch (error: any) {
    console.error("Error en PUT /api/pagos/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Pago no encontrado"
            : "Error al actualizar el pago",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un pago por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const pagoExistente = await prisma.pagos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pagoExistente) {
      return NextResponse.json(
        { result: false, error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    await prisma.pagos.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ result: true, message: "Pago eliminado" });
  } catch (error) {
    console.error("Error en DELETE /api/pagos/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el pago" },
      { status: 500 }
    );
  }
}
