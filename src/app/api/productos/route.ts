import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los productos
export async function GET(req: Request) {
  try {
    const productos = await prisma.productos.findMany();

    if (!productos || productos.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron productos" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, productos });
  } catch (error) {
    console.error("Error en GET /api/productos:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo producto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nombre,
      color,
      talla,
      tipo,
      precio_compra,
      precio_venta,
      stock,
      id_usuario,
    } = body;

    if (
      !nombre ||
      !precio_compra ||
      !precio_venta ||
      stock === undefined ||
      !id_usuario
    ) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevoProducto = await prisma.productos.create({
      data: {
        nombre,
        color,
        talla,
        tipo,
        precio_compra,
        precio_venta,
        stock,
        id_usuario,
      },
    });

    return NextResponse.json({ result: true, producto: nuevoProducto });
  } catch (error: any) {
    console.error("Error en POST /api/productos:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "El producto ya existe"
            : "Error al crear el producto",
      },
      { status: 500 }
    );
  }
}
