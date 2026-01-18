import { NextRequest, NextResponse } from 'next/server';
import { globalRepositories } from '@/lib/core/repositories';
import { hashPassword } from '@/lib/core/utils/bcrypt';
import {
  createTokens, type TokenPayload
} from '@/lib/core/utils/jwt';
import { validate } from '@/lib/core/utils/type-validator';
import { registerSchema } from '@/lib/core/types/auth.type';
import {
  ClientUserSchema,
  CreateUser,
  CreateUserSchema,
} from '@/lib/core/types/user.type';
import { now } from '@/lib/core/utils/utils';
import { createAuthResponse } from '@/lib/core/utils/cookie';

export async function POST(request: NextRequest) {
  const json = await request.json();

  const parsed = validate(registerSchema, json);
  if (!parsed.ok) {
    return NextResponse.json(
      { details: parsed.errors, error: 'Dados de registro inválidos.' },
      { status: 400 },
    );
  }

  const { email, name, password, role, house } = parsed.data;
  const { users, usersInternal } = globalRepositories;

  try {
    const alreadyExists = await users.existsWhere({ email });
    if (alreadyExists) {
      return NextResponse.json(
        { error: 'Este e-mail já está em uso.' },
        { status: 409 },
      );
    }
    // 1. Criamos um mapeamento das imagens por casa
const houseAvatars: Record<string, string> = {
  'fogo': 'https://i.pinimg.com/736x/a2/14/f9/a214f952b99d024d0dbacea0aab8594b.jpg',
  'planta': 'https://i.pinimg.com/1200x/a3/3e/44/a33e44a34d47a38ae60dcffa33476768.jpg',
  'agua': 'https://i.pinimg.com/originals/5b/99/80/5b99802553149f641bc4fc745cf26ee1.jpg',
};

// 2. Definimos a imagem padrão caso a casa não seja encontrada ou não informada
const defaultAvatar = 'https://win.gg/wp-content/uploads/2022/08/image-22.png.webp';

// 3. Selecionamos o avatar com base na variável 'house' que veio do parsed.data
    const selectedAvatar = houseAvatars[house.toLowerCase()] || defaultAvatar;

    const userDataToCreate: CreateUser = {
      auth: {
        password: await hashPassword(password),
      },
      email,
      house,
      profile: {
        avatar: selectedAvatar,
        name,
      },
      role,
      activity: {
        isActive: false,
        createdAt: now(),
        lastSeen: now(),
      },
      enrollments: [],
      preferences: {
        language: 'pt-BR',
        notifications: true,
        theme: 'dark',
      },
    };
      

    const fullUserData = CreateUserSchema.parse(userDataToCreate);
    const user = await usersInternal.create(fullUserData);

    const payload: TokenPayload = {
      email: user.email,
      role: user.role,
      subjectId: user.id,
    };

    const { accessToken, refreshToken } = await createTokens(payload);

    const clientUser = ClientUserSchema.parse(user);

    return createAuthResponse(
      { user: clientUser },
      { accessToken, refreshToken },
    );
  } catch (error) {
    console.error('Erro na API de Registro:', error);

    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
