import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener una venta por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const venta = await prisma.ventas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!venta) {
      return NextResponse.json(
        { result: false, error: "Venta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, venta });
  } catch (error) {
    console.error("Error en GET /api/ventas/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener la venta" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una venta por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { id_usuario, fecha } = body;

    if (!id_usuario && !fecha) {
      return NextResponse.json(
        { result: false, error: "No hay datos para actualizar" },
        { status: 400 }
      );
    }

    const ventaActualizada = await prisma.ventas.update({
      where: { id: parseInt(id) },
      data: {
        id_usuario,
        fecha,
      },
    });

    return NextResponse.json({ result: true, venta: ventaActualizada });
  } catch (error: any) {
    console.error("Error en PUT /api/ventas/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Venta no encontrada"
            : "Error al actualizar la venta",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una venta por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const ventaExistente = await prisma.ventas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!ventaExistente) {
      return NextResponse.json(
        { result: false, error: "Venta no encontrada" },
        { status: 404 }
      );
    }

    await prisma.ventas.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ result: true, message: "Venta eliminada" });
  } catch (error) {
    console.error("Error en DELETE /api/ventas/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar la venta" },
      { status: 500 }
    );
  }
}
