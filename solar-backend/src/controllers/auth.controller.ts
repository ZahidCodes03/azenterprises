import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginAdmin(email, password);

        // Set HTTP-only cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            success: true,
            user: result.user,
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            error: error.message || 'Login failed',
        });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
    try {
        res.json({
            success: true,
            user: req.user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
