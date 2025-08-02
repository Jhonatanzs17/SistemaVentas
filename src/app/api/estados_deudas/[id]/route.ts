import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un estado de deuda por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const estadoDeuda = await prisma.estados_deudas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!estadoDeuda) {
      return NextResponse.json(
        { result: false, error: "Estado de deuda no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, estadoDeuda });
  } catch (error) {
    console.error("Error en GET /api/estados_deudas/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el estado de deuda" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un estado de deuda por ID
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
        { result: false, error: "Nombre del estado de deuda requerido" },
        { status: 400 }
      );
    }

    const estadoDeudaActualizado = await prisma.estados_deudas.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
      },
    });

    return NextResponse.json({
      result: true,
      estadoDeuda: estadoDeudaActualizado,
    });
  } catch (error: any) {
    console.error("Error en PUT /api/estados_deudas/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Estado de deuda no encontrado"
            : "Error al actualizar el estado de deuda",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un estado de deuda por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const estadoDeudaExistente = await prisma.estados_deudas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!estadoDeudaExistente) {
      return NextResponse.json(
        { result: false, error: "Estado de deuda no encontrado" },
        { status: 404 }
      );
    }

    await prisma.estados_deudas.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      result: true,
      message: "Estado de deuda eliminado",
    });
  } catch (error) {
    console.error("Error en DELETE /api/estados_deudas/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el estado de deuda" },
      { status: 500 }
    );
  }
}
