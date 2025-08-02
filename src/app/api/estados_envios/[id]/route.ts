import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un estado de envío por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const estadoEnvio = await prisma.estados_envios.findUnique({
      where: { id: parseInt(id) },
    });

    if (!estadoEnvio) {
      return NextResponse.json(
        { result: false, error: "Estado de envío no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, estadoEnvio });
  } catch (error) {
    console.error("Error en GET /api/estados_envios/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el estado de envío" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un estado de envío por ID
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
        { result: false, error: "Nombre del estado de envío requerido" },
        { status: 400 }
      );
    }

    const estadoEnvioActualizado = await prisma.estados_envios.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
      },
    });

    return NextResponse.json({
      result: true,
      estadoEnvio: estadoEnvioActualizado,
    });
  } catch (error: any) {
    console.error("Error en PUT /api/estados_envios/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Estado de envío no encontrado"
            : "Error al actualizar el estado de envío",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un estado de envío por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const estadoEnvioExistente = await prisma.estados_envios.findUnique({
      where: { id: parseInt(id) },
    });

    if (!estadoEnvioExistente) {
      return NextResponse.json(
        { result: false, error: "Estado de envío no encontrado" },
        { status: 404 }
      );
    }

    await prisma.estados_envios.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      result: true,
      message: "Estado de envío eliminado",
    });
  } catch (error) {
    console.error("Error en DELETE /api/estados_envios/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el estado de envío" },
      { status: 500 }
    );
  }
}
