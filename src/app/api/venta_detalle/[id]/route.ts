import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un detalle de venta por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const ventaDetalle = await prisma.venta_detalle.findUnique({
      where: { id: parseInt(id) },
    });

    if (!ventaDetalle) {
      return NextResponse.json(
        { result: false, error: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, ventaDetalle });
  } catch (error) {
    console.error("Error en GET /api/venta_detalle/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el detalle de venta" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un detalle de venta por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      id_venta,
      id_cliente,
      id_producto,
      cantidad,
      precio,
      id_estado_factura,
      id_estado_deuda,
      id_estado_envio,
    } = body;

    if (
      !id_venta ||
      !id_cliente ||
      !id_producto ||
      !cantidad ||
      !precio ||
      !id_estado_factura ||
      !id_estado_deuda ||
      !id_estado_envio
    ) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const ventaDetalleActualizado = await prisma.venta_detalle.update({
      where: { id: parseInt(id) },
      data: {
        id_venta,
        id_cliente,
        id_producto,
        cantidad,
        precio,
        id_estado_factura,
        id_estado_deuda,
        id_estado_envio,
      },
    });

    return NextResponse.json({
      result: true,
      ventaDetalle: ventaDetalleActualizado,
    });
  } catch (error: any) {
    console.error("Error en PUT /api/venta_detalle/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Detalle de venta no encontrado"
            : "Error al actualizar el detalle de venta",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un detalle de venta por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const ventaDetalleExistente = await prisma.venta_detalle.findUnique({
      where: { id: parseInt(id) },
    });

    if (!ventaDetalleExistente) {
      return NextResponse.json(
        { result: false, error: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    await prisma.venta_detalle.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      result: true,
      message: "Detalle de venta eliminado",
    });
  } catch (error) {
    console.error("Error en DELETE /api/venta_detalle/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el detalle de venta" },
      { status: 500 }
    );
  }
}
