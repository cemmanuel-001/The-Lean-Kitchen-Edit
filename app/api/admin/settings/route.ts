import { NextRequest, NextResponse } from "next/server";
import { getFile, putFile } from "@/lib/github";
export const dynamic = "force-dynamic"; 

const SITE_PATH = "content/site.json";

export async function GET() {
  try {
    const file = await getFile(SITE_PATH);
    return NextResponse.json(file ? JSON.parse(file.content) : {});
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await putFile(SITE_PATH, JSON.stringify(body, null, 2), "Update homepage text");
    return NextResponse.json(body);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
