import { NextResponse } from "next/server";
import { promises as dns } from "node:dns";

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ isValid: false, reason: "Correo requerido" }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ isValid: false, reason: "Formato de correo invalido" }, { status: 200 });
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return NextResponse.json({ isValid: false, reason: "Dominio invalido" }, { status: 200 });
    }

    try {
      const mxRecords = await dns.resolveMx(domain);
      const hasMx = mxRecords && mxRecords.length > 0;
      if (!hasMx) {
        return NextResponse.json({ isValid: false, reason: "Dominio sin MX" }, { status: 200 });
      }
      return NextResponse.json({ isValid: true }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ isValid: false, reason: "Dominio no valido" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ isValid: false, reason: "Error de validacion" }, { status: 500 });
  }
}
