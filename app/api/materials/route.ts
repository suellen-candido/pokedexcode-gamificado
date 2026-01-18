import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { writeFile } from 'fs/promises';

const MATERIALS_FILE = path.join(process.cwd(), 'data', 'content', 'materials.json');
const MATERIALS_DIR = path.join(process.cwd(), 'public', 'materials');

export async function GET() {
  try {
    const fileContents = await fs.readFile(MATERIALS_FILE, 'utf8');
    const materials = JSON.parse(fileContents);
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error reading materials:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const uploadedBy = formData.get('uploadedBy') as string;

    if (!file || !name) {
      return NextResponse.json({ success: false, error: 'File and name required' }, { status: 400 });
    }

    // Criar nome único para o arquivo
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${sanitizedName}_${timestamp}${extension}`;

    // Converter o arquivo para buffer e salvar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(MATERIALS_DIR, fileName);
    await writeFile(filePath, buffer);

    // Ler materiais existentes
    let materials = [];
    try {
      const fileContents = await fs.readFile(MATERIALS_FILE, 'utf8');
      materials = JSON.parse(fileContents);
    } catch (error) {
      materials = [];
    }

    // Adicionar novo material
    const newMaterial = {
      id: timestamp.toString(),
      name,
      url: `/materials/${fileName}`,
      type: extension.substring(1).toUpperCase(),
      originalName: originalName,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      size: file.size,
    };

    materials.push(newMaterial);

    // Salvar de volta no arquivo
    await fs.writeFile(MATERIALS_FILE, JSON.stringify(materials, null, 2));

    return NextResponse.json({ success: true, material: newMaterial });
  } catch (error) {
    console.error('Error saving material:', error);
    return NextResponse.json({ success: false, error: 'Failed to save material' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    // Ler materiais existentes
    const fileContents = await fs.readFile(MATERIALS_FILE, 'utf8');
    let materials = JSON.parse(fileContents);

    // Encontrar o material para deletar o arquivo
    const material = materials.find((m: any) => m.id === id);
    if (material && material.url) {
      try {
        const fileName = material.url.split('/').pop();
        const filePath = path.join(MATERIALS_DIR, fileName);
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    // Filtrar material removido
    materials = materials.filter((m: any) => m.id !== id);

    // Salvar de volta no arquivo
    await fs.writeFile(MATERIALS_FILE, JSON.stringify(materials, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete material' }, { status: 500 });
  }
}
