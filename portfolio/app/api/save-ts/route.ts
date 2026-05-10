import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

type SaveTsRequest = {
  content?: Record<string, unknown>;
};

const SECTION_ORDER = [
  'heroContent',
  'aboutContent',
  'projectsContent',
  'skillsContent',
  'contactContent',
  'footerContent',
] as const;

const TYPE_MAP: Record<string, string> = {
  heroContent: 'HeroContent',
  aboutContent: 'AboutContent',
  projectsContent: 'ProjectsContent',
  skillsContent: 'SkillsContent',
  contactContent: 'ContactContent',
  footerContent: 'FooterContent',
};

const EXPORT_MAP: Record<string, string> = {
  heroContent: 'heroContent',
  aboutContent: 'aboutContent',
  projectsContent: 'projectsContent',
  skillsContent: 'skillsContent',
  contactContent: 'contactContent',
  footerContent: 'footerContent',
};

function generateContentTs(content: Record<string, unknown>): string {
  const imports = [
    "import {",
    ...SECTION_ORDER.map(k => `  ${TYPE_MAP[k]},`),
    "} from '../types/content';",
    "",
  ].join('\n');

  const sections = SECTION_ORDER
    .filter(key => content[key] !== undefined)
    .map(key => {
      const varName = EXPORT_MAP[key];
      const typeName = TYPE_MAP[key];
      const value = JSON.stringify(content[key], null, 2);
      return `export const ${varName}: ${typeName} = ${value};`;
    })
    .join('\n\n');

  return `${imports}${sections}\n`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveTsRequest;
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Missing content field' }, { status: 400 });
    }

    const tsSource = generateContentTs(content);
    const dirPath = join(process.cwd(), 'app', 'config');
    const filePath = join(dirPath, 'content.ts');

    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, tsSource, 'utf-8');

    return NextResponse.json({
      success: true,
      message: '已保存到 app/config/content.ts',
      size: new TextEncoder().encode(tsSource).length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
