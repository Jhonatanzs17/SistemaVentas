import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un usuario por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const usuario = await prisma.usuarios.findUnique({
      where: { id: parseInt(id) },
    });

    if (!usuario) {
      return NextResponse.json(
        { result: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, usuario });
  } catch (error) {
    console.error("Error en GET /api/usuarios/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un usuario por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { usuario, contrasena, correo, rol, empresa, telefono, foto_perfil } =
      body;

    if (
      !usuario &&
      !contrasena &&
      !correo &&
      rol === undefined &&
      empresa === undefined
    ) {
      return NextResponse.json(
        { result: false, error: "No hay datos para actualizar" },
        { status: 400 }
      );
    }

    const usuarioActualizado = await prisma.usuarios.update({
      where: { id: parseInt(id) },
      data: {
        usuario,
        contrasena,
        correo,
        rol,
        empresa,
        telefono,
        foto_perfil,
      },
    });

    return NextResponse.json({ result: true, usuario: usuarioActualizado });
  } catch (error: any) {
    console.error("Error en PUT /api/usuarios/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Usuario no encontrado"
            : "Error al actualizar el usuario",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un usuario por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { id: parseInt(id) },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { result: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    await prisma.usuarios.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ result: true, message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error en DELETE /api/usuarios/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }
}
