import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un cliente por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const cliente = await prisma.clientes.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cliente) {
      return NextResponse.json(
        { result: false, error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, cliente });
  } catch (error) {
    console.error("Error en GET /api/clientes/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el cliente" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un cliente por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { nombre, tiktok, telefono, correo, estado } = body;

    if (!nombre && !tiktok && !telefono && !correo && estado === undefined) {
      return NextResponse.json(
        { result: false, error: "No hay datos para actualizar" },
        { status: 400 }
      );
    }

    const clienteActualizado = await prisma.clientes.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        tiktok,
        telefono,
        correo,
        estado,
      },
    });

    return NextResponse.json({ result: true, cliente: clienteActualizado });
  } catch (error: any) {
    console.error("Error en PUT /api/clientes/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Cliente no encontrado"
            : "Error al actualizar el cliente",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un cliente por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar si el cliente existe antes de intentar eliminarlo
    const clienteExistente = await prisma.clientes.findUnique({
      where: { id: parseInt(id) },
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { result: false, error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el cliente
    await prisma.clientes.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ result: true, message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error en DELETE /api/clientes/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el cliente" },
      { status: 500 }
    );
  }
}
