import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

type SaveContentRequest = {
  content?: string | Record<string, unknown>;
  filename?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveContentRequest;
    const { content, filename = 'content.json' } = body;

    if (!content) {
      return NextResponse.json({ error: 'Missing content field' }, { status: 400 });
    }

    const jsonStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    const dirPath = join(process.cwd(), 'public');
    const filePath = join(dirPath, filename);

    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, jsonStr, 'utf-8');

    return NextResponse.json({
      success: true,
      message: `已保存到 public/${filename}`,
      size: new TextEncoder().encode(jsonStr).length,
    });
  } catch (error) {
    console.error('[save-content API Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
