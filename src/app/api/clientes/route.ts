import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id_usuario = searchParams.get("id_usuario");

    if (!id_usuario) {
      return NextResponse.json(
        { result: false, error: "Parametros faltantes" },
        { status: 400 }
      );
    }

    const clientes = await prisma.clientes.findMany({
      where: { id_usuario: parseInt(id_usuario) },
    });

    if (!clientes || clientes.length === 0) {
      return NextResponse.json(
        { result: false, error: "Clientes no encontrados" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, clientes });
  } catch (error) {
    console.error("Error en GET /api/clientes:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los clientes" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo cliente
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nombre, tiktok, telefono, correo, estado, id_usuario } = body;

    if (!nombre || !tiktok || estado === undefined || !id_usuario) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevoCliente = await prisma.clientes.create({
      data: {
        nombre,
        tiktok,
        telefono,
        correo,
        estado,
        id_usuario,
      },
    });

    return NextResponse.json({ result: true, cliente: nuevoCliente });
  } catch (error: any) {
    console.error("Error en POST /api/clientes:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "La cuenta ya existe"
            : "Error al crear el cliente",
      },
      { status: 500 }
    );
  }
}

// PUT: Actualizar cliente existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nombre, tiktok, telefono, correo, estado } = body;

    if (!id) {
      return NextResponse.json(
        { result: false, error: "ID requerido para actualizar" },
        { status: 400 }
      );
    }

    const clienteActualizado = await prisma.clientes.update({
      where: { id },
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
    console.error("Error en PUT /api/clientes:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Cliente no encontrado"
            : "Error al actualizar cliente",
      },
      { status: 500 }
    );
  }
}
