import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetPath = formData.get('targetPath') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/') && !file.name.endsWith('.gif')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^\w.\-\u4e00-\u9fff]/g, '_');
    const cleanTarget = targetPath || '/gifs/';
    const cleanPath = cleanTarget.startsWith('/') ? cleanTarget.slice(1) : cleanTarget;
    const dirPart = cleanPath.endsWith('/') ? cleanPath : cleanPath.substring(0, cleanPath.lastIndexOf('/') + 1);
    const dirPath = join(process.cwd(), 'public', dirPart);
    const filePath = join(dirPath, safeName);
    await mkdir(dirPath, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    const src = `/${dirPart}${safeName}`;

    return NextResponse.json({ success: true, src });
  } catch (error) {
    console.error('[upload API Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
