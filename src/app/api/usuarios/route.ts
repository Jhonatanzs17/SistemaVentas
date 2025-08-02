import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los usuarios
export async function GET(req: Request) {
  try {
    const usuarios = await prisma.usuarios.findMany();

    if (!usuarios || usuarios.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron usuarios" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, usuarios });
  } catch (error) {
    console.error("Error en GET /api/usuarios:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los usuarios" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo usuario
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuario, contrasena, correo, rol, empresa, telefono, foto_perfil } =
      body;

    if (
      !usuario ||
      !contrasena ||
      !correo ||
      rol === undefined ||
      empresa === undefined
    ) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevoUsuario = await prisma.usuarios.create({
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

    return NextResponse.json({ result: true, usuario: nuevoUsuario });
  } catch (error: any) {
    console.error("Error en POST /api/usuarios:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "El usuario ya existe"
            : "Error al crear el usuario",
      },
      { status: 500 }
    );
  }
}
