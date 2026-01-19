import { CalculatorInput, CalculatorResult } from '../types';

// State-wise average electricity rates (₹/kWh)
const stateElectricityRates: Record<string, number> = {
    'Jammu and Kashmir': 5.5,
    'Delhi': 7.5,
    'Maharashtra': 8.0,
    'Karnataka': 7.0,
    'Tamil Nadu': 6.5,
    'Gujarat': 6.0,
    'Rajasthan': 6.8,
    'Punjab': 6.2,
    'Haryana': 7.0,
    'Uttar Pradesh': 6.5,
    'Madhya Pradesh': 6.3,
    'Kerala': 6.8,
    'West Bengal': 7.2,
    'Bihar': 6.0,
    // Add more states as needed
    'default': 7.0, // Default rate
};

export const calculateSavings = (input: CalculatorInput): CalculatorResult => {
    const { monthlyBill, state, roofSize } = input;

    // Get electricity rate for the state
    const electricityRate = stateElectricityRates[state] || stateElectricityRates['default'];

    // Calculate current monthly units consumed
    const monthlyUnits = monthlyBill / electricityRate;

    // Calculate system size (assuming 80% of current consumption)
    // Average solar panel produces 4-5 units per kW per day
    const dailyUnits = monthlyUnits / 30;
    const systemSize = Math.round((dailyUnits * 0.8) / 4.5 * 10) / 10; // in kW

    // Ensure system size fits on the roof (1 kW needs ~100 sq ft)
    const maxSystemSize = roofSize / 100;
    const finalSystemSize = Math.min(systemSize, maxSystemSize);

    // Calculate monthly generation
    const monthlyGeneration = finalSystemSize * 4.5 * 30; // units

    // Calculate savings (assuming 80% self-consumption)
    const monthlySavings = Math.round(monthlyGeneration * 0.8 * electricityRate);
    const annualSavings = monthlySavings * 12;

    // Calculate system cost (₹50,000 - ₹60,000 per kW approximately)
    const estimatedCost = Math.round(finalSystemSize * 55000);

    // Calculate payback period (in years)
    const paybackPeriod = parseFloat((estimatedCost / annualSavings).toFixed(1));

    // Calculate CO₂ reduction (0.85 kg CO₂ per kWh)
    const co2Reduction = Math.round(monthlyGeneration * 12 * 0.85); // kg per year

    return {
        monthlySavings,
        annualSavings,
        paybackPeriod,
        co2Reduction,
        systemSize: finalSystemSize,
        estimatedCost,
    };
};
