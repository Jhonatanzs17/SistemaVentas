import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET: Obtener todos los detalles de ventas
export async function GET(req: Request) {
  try {
    const ventaDetalles = await prisma.venta_detalle.findMany();

    if (!ventaDetalles || ventaDetalles.length === 0) {
      return NextResponse.json(
        { result: false, error: "No se encontraron detalles de ventas" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: true, ventaDetalles });
  } catch (error) {
    console.error("Error en GET /api/venta_detalle:", error);
    return NextResponse.json(
      { result: false, error: "Error al obtener los detalles de ventas" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo detalle de venta
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id_venta,
      id_cliente,
      id_producto,
      cantidad,
      precio,
      id_estado_factura,
      id_estado_deuda,
      id_estado_envio,
    } = body;

    if (
      !id_venta ||
      !id_cliente ||
      !id_producto ||
      !cantidad ||
      !precio ||
      !id_estado_factura ||
      !id_estado_deuda ||
      !id_estado_envio
    ) {
      return NextResponse.json(
        { result: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const nuevoVentaDetalle = await prisma.venta_detalle.create({
      data: {
        id_venta,
        id_cliente,
        id_producto,
        cantidad,
        precio,
        id_estado_factura,
        id_estado_deuda,
        id_estado_envio,
      },
    });

    return NextResponse.json({ result: true, ventaDetalle: nuevoVentaDetalle });
  } catch (error: any) {
    console.error("Error en POST /api/venta_detalle:", error);
    return NextResponse.json(
      {
        result: false,
        error:
          error.code === "P2002"
            ? "El detalle de venta ya existe"
            : "Error al crear el detalle de venta",
      },
      { status: 500 }
    );
  }
}
