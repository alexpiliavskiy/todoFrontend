import type { AuthToken, LoginCredentials, RegisterCredentials, User } from '@/types';

const MOCK_USERS: (User & { password: string })[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function generateToken(user: User): string {
  return btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 86400000 }));
}

export async function loginService(credentials: LoginCredentials): Promise<AuthToken> {
  await delay(700);
  const user = MOCK_USERS.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  if (!user) throw new Error('Invalid email or password');
  const { password: _, ...safeUser } = user;
  return { token: generateToken(safeUser), user: safeUser };
}

export async function registerService(credentials: RegisterCredentials): Promise<AuthToken> {
  await delay(900);
  const exists = MOCK_USERS.find(u => u.email === credentials.email);
  if (exists) throw new Error('An account with this email already exists');
  const newUser: User & { password: string } = {
    id: `user-${Date.now()}`,
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  };
  MOCK_USERS.push(newUser);
  const { password: _, ...safeUser } = newUser;
  return { token: generateToken(safeUser), user: safeUser };
}

export async function getMeService(token: string): Promise<User> {
  await delay(300);
  try {
    const payload = JSON.parse(atob(token)) as { userId: string; email: string; exp: number };
    if (payload.exp < Date.now()) throw new Error('Token expired');
    const user = MOCK_USERS.find(u => u.id === payload.userId);
    if (!user) throw new Error('User not found');
    const { password: _, ...safeUser } = user;
    return safeUser;
  } catch {
    throw new Error('Invalid token');
  }
}
