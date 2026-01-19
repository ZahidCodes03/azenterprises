import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt.util';

export const loginAdmin = async (email: string, password: string) => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || user.role !== 'ADMIN') {
        throw new Error('Invalid credentials');
    }

    if (!user.password) {
        throw new Error('No password set for this user');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
