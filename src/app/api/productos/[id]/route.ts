import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener un producto por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const producto = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!producto) {
      return NextResponse.json(
        { result: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, producto });
  } catch (error) {
    console.error("Error en GET /api/productos/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un producto por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { nombre, color, talla, tipo, precio_compra, precio_venta, stock } =
      body;

    if (!nombre && !precio_compra && !precio_venta && stock === undefined) {
      return NextResponse.json(
        { result: false, error: "No hay datos para actualizar" },
        { status: 400 }
      );
    }

    const productoActualizado = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        color,
        talla,
        tipo,
        precio_compra,
        precio_venta,
        stock,
      },
    });

    return NextResponse.json({ result: true, producto: productoActualizado });
  } catch (error: any) {
    console.error("Error en PUT /api/productos/[id]:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2025"
            ? "Producto no encontrado"
            : "Error al actualizar el producto",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un producto por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const productoExistente = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productoExistente) {
      return NextResponse.json(
        { result: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    await prisma.productos.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ result: true, message: "Producto eliminado" });
  } catch (error) {
    console.error("Error en DELETE /api/productos/[id]:", error);
    return NextResponse.json(
      { result: false, error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
