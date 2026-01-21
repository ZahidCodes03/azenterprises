import { Request, Response } from "express";
import * as billService from "../services/bill.service";

export const createBill = async (req: Request, res: Response) => {
    try {
        const bill = await billService.createBill(req.body);
        res.status(201).json(bill);
    } catch (error) {
        console.error("Error creating bill:", error);
        res.status(500).json({ error: "Failed to create bill" });
    }
};

export const getBills = async (req: Request, res: Response) => {
    try {
        const bills = await billService.getBills();
        res.status(200).json(bills);
    } catch (error) {
        console.error("Error fetching bills:", error);
        res.status(500).json({ error: "Failed to fetch bills" });
    }
};

export const getBillById = async (req: Request, res: Response) => {
    try {
        const bill = await billService.getBillById(req.params.id);
        if (!bill) {
            return res.status(404).json({ error: "Bill not found" });
        }
        res.status(200).json(bill);
    } catch (error) {
        console.error("Error fetching bill:", error);
        res.status(500).json({ error: "Failed to fetch bill" });
    }
};

export const deleteBill = async (req: Request, res: Response) => {
    try {
        await billService.deleteBill(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting bill:", error);
        res.status(500).json({ error: "Failed to delete bill" });
    }
};
