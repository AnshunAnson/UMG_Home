import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

function generateContentTs(data: any): string {
  const { heroContent, aboutContent, projectsContent, skillsContent, contactContent, footerContent } = data;

  return `import {
  HeroContent,
  AboutContent,
  ProjectsContent,
  SkillsContent,
  ContactContent,
  FooterContent,
} from '../types/content';

// Hero区域内容
export const heroContent: HeroContent = ${JSON.stringify(heroContent, null, 2)};

// About区域内容
export const aboutContent: AboutContent = ${JSON.stringify(aboutContent, null, 2)};

// Projects区域内容
export const projectsContent: ProjectsContent = ${JSON.stringify(projectsContent, null, 2)};

// Skills区域内容
export const skillsContent: SkillsContent = ${JSON.stringify(skillsContent, null, 2)};

// Contact区域内容
export const contactContent: ContactContent = ${JSON.stringify(contactContent, null, 2)};

// Footer区域内容
export const footerContent: FooterContent = ${JSON.stringify(footerContent, null, 2)};
`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Missing content field' }, { status: 400 });
    }

    const tsContent = generateContentTs(content);
    const filePath = join(process.cwd(), 'app', 'config', 'content.ts');

    await writeFile(filePath, tsContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: '已更新 app/config/content.ts',
      size: new TextEncoder().encode(tsContent).length,
    });
  } catch (error: any) {
    console.error('[save-ts API Error]:', error);
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    );
  }
}
