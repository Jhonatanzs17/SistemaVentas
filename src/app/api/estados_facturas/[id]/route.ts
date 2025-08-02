import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un estado de factura por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const estadoFactura = await prisma.estados_facturas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!estadoFactura) {
      return NextResponse.json(
        { result: false, error: "Estado de factura no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, estadoFactura });
  } catch (error) {
    console.error("Error en GET /api/estados_facturas/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el estado de factura" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un estado de factura por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { nombre } = body;

    if (!nombre) {
      return NextResponse.json(
        { result: false, error: "Nombre del estado de factura requerido" },
        { status: 400 }
      );
    }

    const estadoFacturaActualizado = await prisma.estados_facturas.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
      },
    });

    return NextResponse.json({
      result: true,
      estadoFactura: estadoFacturaActualizado,
    });
  } catch (error: any) {
    console.error("Error en PUT /api/estados_facturas/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Estado de factura no encontrado"
            : "Error al actualizar el estado de factura",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un estado de factura por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const estadoFacturaExistente = await prisma.estados_facturas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!estadoFacturaExistente) {
      return NextResponse.json(
        { result: false, error: "Estado de factura no encontrado" },
        { status: 404 }
      );
    }

    await prisma.estados_facturas.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      result: true,
      message: "Estado de factura eliminado",
    });
  } catch (error) {
    console.error("Error en DELETE /api/estados_facturas/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el estado de factura" },
      { status: 500 }
    );
  }
}
