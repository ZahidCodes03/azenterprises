import { Request, Response } from 'express';
import { calculateSavings } from '../services/calculator.service';

export const calculateEstimate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { monthlyBill, state, roofSize } = req.body;

        const result = calculateSavings({
            monthlyBill,
            state,
            roofSize,
        });

        res.json({
            success: true,
            result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to calculate estimate',
        });
    }
};
