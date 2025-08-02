import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un rol por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const rol = await prisma.roles.findUnique({
      where: { id: parseInt(id) },
    });

    if (!rol) {
      return NextResponse.json(
        { result: false, error: "Rol no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, rol });
  } catch (error) {
    console.error("Error en GET /api/roles/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el rol" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un rol por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { rol } = body;

    if (!rol) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos para actualizar" },
        { status: 400 }
      );
    }

    const rolActualizado = await prisma.roles.update({
      where: { id: parseInt(id) },
      data: { rol },
    });

    return NextResponse.json({ result: true, rol: rolActualizado });
  } catch (error: any) {
    console.error("Error en PUT /api/roles/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Rol no encontrado"
            : "Error al actualizar el rol",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un rol por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const rolExistente = await prisma.roles.findUnique({
      where: { id: parseInt(id) },
    });

    if (!rolExistente) {
      return NextResponse.json(
        { result: false, error: "Rol no encontrado" },
        { status: 404 }
      );
    }

    await prisma.roles.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ result: true, message: "Rol eliminado" });
  } catch (error) {
    console.error("Error en DELETE /api/roles/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el rol" },
      { status: 500 }
    );
  }
}
