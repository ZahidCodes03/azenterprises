import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET: Secret = (() => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return process.env.JWT_SECRET;
})();

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];

export const generateToken = (payload: JWTPayload): string => {
    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN,
    };

    return jwt.sign(payload as object, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        throw new Error('Invalid or expired token');
    }
};
