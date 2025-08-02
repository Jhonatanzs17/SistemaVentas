import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un contrato por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const contrato = await prisma.contratos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!contrato) {
      return NextResponse.json(
        { result: false, error: "Contrato no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, contrato });
  } catch (error) {
    console.error("Error en GET /api/contratos/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el contrato" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un contrato por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { id_empresa, fecha_inicio, fecha_fin, estado } = body;

    if (!id_empresa && !fecha_inicio && !fecha_fin && estado === undefined) {
      return NextResponse.json(
        { result: false, error: "No hay datos para actualizar" },
        { status: 400 }
      );
    }

    const contratoActualizado = await prisma.contratos.update({
      where: { id: parseInt(id) },
      data: {
        id_empresa,
        fecha_inicio,
        fecha_fin,
        estado,
      },
    });

    return NextResponse.json({ result: true, contrato: contratoActualizado });
  } catch (error: any) {
    console.error("Error en PUT /api/contratos/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Contrato no encontrado"
            : "Error al actualizar el contrato",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un contrato por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const contratoExistente = await prisma.contratos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!contratoExistente) {
      return NextResponse.json(
        { result: false, error: "Contrato no encontrado" },
        { status: 404 }
      );
    }

    await prisma.contratos.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ result: true, message: "Contrato eliminado" });
  } catch (error) {
    console.error("Error en DELETE /api/contratos/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el contrato" },
      { status: 500 }
    );
  }
}
