import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 제공되지 않았습니다" }, { status: 400 });
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다" }, { status: 400 });
    }

    // 파일 크기 제한 (4MB)
    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "파일 크기는 4MB 이하여야 합니다" }, { status: 400 });
    }

    // 파일명에 타임스탬프 추가하여 고유하게 만들기
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "파일 업로드에 실패했습니다" }, { status: 500 });
  }
}

