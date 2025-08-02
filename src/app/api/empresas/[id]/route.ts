import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener una empresa por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const empresa = await prisma.empresas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!empresa) {
      return NextResponse.json(
        { result: false, error: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, empresa });
  } catch (error) {
    console.error("Error en GET /api/empresas/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener la empresa" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una empresa por ID
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
        { result: false, error: "Datos incompletos para actualizar" },
        { status: 400 }
      );
    }

    const empresaActualizada = await prisma.empresas.update({
      where: { id: parseInt(id) },
      data: { nombre },
    });

    return NextResponse.json({ result: true, empresa: empresaActualizada });
  } catch (error: any) {
    console.error("Error en PUT /api/empresas/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Empresa no encontrada"
            : "Error al actualizar la empresa",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una empresa por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const empresaExistente = await prisma.empresas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!empresaExistente) {
      return NextResponse.json(
        { result: false, error: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    await prisma.empresas.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ result: true, message: "Empresa eliminada" });
  } catch (error) {
    console.error("Error en DELETE /api/empresas/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar la empresa" },
      { status: 500 }
    );
  }
}
