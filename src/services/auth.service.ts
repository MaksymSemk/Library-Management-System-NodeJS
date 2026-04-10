import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { RegisterSchema } from '../schemas/schema';
import { z } from 'zod';
import { sendMail } from '../utils/sendMail';

const JWT_SECRET = process.env.JWT_SECRET!;
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || JWT_SECRET;

export class AuthService {
  static async register(data: z.infer<typeof RegisterSchema>) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: hashedPassword,
        role: 'USER' 
      },
      select: { id: true, email: true, name: true, role: true }
    });
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw { status: 401, message: 'Wrong email or password' };
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  static async refresh(token: string) {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || user.refreshToken !== token) {
      throw { status: 403, message: 'Invalid refresh token' };
    }

    const newAccessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    return { accessToken: newAccessToken };
  }

  static async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return;
    }

    const token = jwt.sign({ email: user.email }, RESET_PASSWORD_SECRET, { expiresIn: '10m' });
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${appBaseUrl}/reset-password?token=${token}`;

    await sendMail({
      to: user.email,
      subject: 'Password reset for Library Management System',
      text: `Use this token to reset your password: ${token}\n\nOr open this link: ${resetUrl}\n\nThis token expires in 10 minutes.`,
      html: `<p>Use this token to reset your password:</p><p><b>${token}</b></p><p>Or open this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This token expires in 10 minutes.</p>`
    });
  }

  static async resetPassword(token: string, password: string) {
    try {
      const payload = jwt.verify(token, RESET_PASSWORD_SECRET) as { email: string };
      const user = await prisma.user.findUnique({ where: { email: payload.email } });

      if (!user) {
        throw { status: 400, message: 'Invalid or expired reset token' };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, refreshToken: null }
      });
    } catch (error) {
      throw { status: 400, message: 'Invalid or expired reset token' };
    }
  }
}