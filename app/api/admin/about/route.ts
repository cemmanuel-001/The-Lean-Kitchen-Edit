import { NextRequest, NextResponse } from "next/server";
import { getFile, putFile } from "@/lib/github";


   export const dynamic = "force-dynamic";

   const ABOUT_PATH = "content/about.json";


export async function GET() {
  try {
    const file = await getFile(ABOUT_PATH);
    return NextResponse.json(file ? JSON.parse(file.content) : {});
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await putFile(ABOUT_PATH, JSON.stringify(body, null, 2), "Update About page");
    return NextResponse.json(body);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
