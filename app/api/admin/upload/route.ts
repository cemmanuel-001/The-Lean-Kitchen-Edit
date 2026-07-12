import { NextRequest, NextResponse } from "next/server";
import { putBinaryFile } from "@/lib/github";
import { slugify } from "@/lib/slugify";

export async function POST(request: NextRequest) {
  try {
    const { filename, dataBase64 } = await request.json();

    if (!filename || !dataBase64) {
      return NextResponse.json({ error: "Missing filename or image data." }, { status: 400 });
    }

    const ext = (filename.split(".").pop() || "jpg").toLowerCase();
    const base = slugify(filename.replace(/\.[^/.]+$/, "")) || "photo";
    const safeName = `${base}-${Date.now().toString().slice(-6)}.${ext}`;
    const filePath = `public/images/${safeName}`;

    await putBinaryFile(filePath, dataBase64, `Upload image: ${safeName}`);

    return NextResponse.json({ path: `/images/${safeName}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
