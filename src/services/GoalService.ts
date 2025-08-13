import { FileService } from './FileService';

const fileService = new FileService();

export interface GoalData {
    goalName: string;
    goalType: string;
    targetAmount: number;
    currentAmount: number;
    startDate: string;
    targetDate: string;
    status: 'In Progress' | 'Completed' | 'On Hold';
    priority: 'High' | 'Medium' | 'Low';
}

export interface IncomeSource {
    source: string;
    amount: number;
    frequency: 'Monthly' | 'Annually';
    isPassive: boolean;
}

export interface MonthlyExpense {
    category: string;
    amount: number;
    isEssential: boolean;
}

export interface FireGoalData {
    targetRetirementAge: number;
    currentAge: number;
    targetRetirementAmount: number;
    currentNetWorth: number;
    monthlySavingsTarget: number;
    currentMonthlySavings: number;
    incomeSources: IncomeSource[];
    monthlyExpenses: MonthlyExpense[];
    expectedReturnRate: number;
    inflationRate: number;
    safeWithdrawalRate: number;
}

const GOALS_FILE = 'goals.json';
const FIRE_GOALS_FILE = 'fire_goals.json';

export const EXPENSE_CATEGORIES = [
    'Housing',
    'Transportation',
    'Food',
    'Healthcare',
    'Insurance',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Investments',
    'Others'
] as const;

export const saveGoalData = async (data: GoalData) => {
    try {
        // Read existing data
        let existingData: GoalData[] = [];
        try {
            const fileContent = await fileService.readFile(GOALS_FILE);
            existingData = JSON.parse(fileContent);
        } catch (error) {
            // File doesn't exist yet, that's okay
        }

        // Add new data
        existingData.push(data);

        // Save file
        await fileService.writeFile(GOALS_FILE, JSON.stringify(existingData));
    } catch (error) {
        console.error('Error saving goal data:', error);
        throw error;
    }
};

export const getGoalData = async (): Promise<GoalData[]> => {
    try {
        const fileContent = await fileService.readFile(GOALS_FILE);
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
};

export const updateGoalData = async (index: number, updatedData: GoalData) => {
    try {
        const existingData: GoalData[] = await getGoalData();
        existingData[index] = updatedData;
        await fileService.writeFile(GOALS_FILE, JSON.stringify(existingData));
    } catch (error) {
        console.error('Error updating goal data:', error);
        throw error;
    }
};

export const deleteGoalData = async (index: number) => {
    try {
        const existingData: GoalData[] = await getGoalData();
        existingData.splice(index, 1);
        await fileService.writeFile(GOALS_FILE, JSON.stringify(existingData));
    } catch (error) {
        console.error('Error deleting goal data:', error);
        throw error;
    }
};

export const saveFireGoalData = async (data: FireGoalData) => {
    try {
        await fileService.writeFile(FIRE_GOALS_FILE, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving FIRE goal data:', error);
        throw error;
    }
};

export const getFireGoalData = async (): Promise<FireGoalData> => {
    try {
        const fileContent = await fileService.readFile(FIRE_GOALS_FILE);
        return JSON.parse(fileContent);
    } catch (error) {
        // Return default values if no data exists
        return {
            targetRetirementAge: 50,
            currentAge: 30,
            targetRetirementAmount: 2000000,
            currentNetWorth: 500000,
            monthlySavingsTarget: 5000,
            currentMonthlySavings: 4000,
            incomeSources: [
                {
                    source: 'Salary',
                    amount: 10000,
                    frequency: 'Monthly',
                    isPassive: false
                }
            ],
            monthlyExpenses: [
                {
                    category: 'Housing',
                    amount: 2000,
                    isEssential: true
                },
                {
                    category: 'Food',
                    amount: 800,
                    isEssential: true
                }
            ],
            expectedReturnRate: 7,
            inflationRate: 3,
            safeWithdrawalRate: 4
        };
    }
};

export const calculateRetirementProjections = (data: FireGoalData) => {
    const yearsToRetirement = data.targetRetirementAge - data.currentAge;
    const monthlyReturn = (1 + data.expectedReturnRate / 100) ** (1/12) - 1;
    const monthlyData = [];
    let currentAmount = data.currentNetWorth;

    for (let i = 0; i <= yearsToRetirement * 12; i++) {
        currentAmount = currentAmount * (1 + monthlyReturn) + data.currentMonthlySavings;
        monthlyData.push(currentAmount);
    }

    return {
        monthlyData,
        yearsToRetirement,
        projectedAmount: monthlyData[monthlyData.length - 1]
    };
};
