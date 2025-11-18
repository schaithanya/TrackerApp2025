import { SavingsData } from './SavingsService';

// Simple free AI service with basic prompt
const HUGGINGFACE_API_ENDPOINT = 'https://api-inference.huggingface.co/models/google/flan-t5-small';

export interface ChatGPTResponse {
    advice: string;
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
    milestones: {
        date: string;
        targetAmount: number;
        description: string;
    }[];
}

// Simple prompt for testing AI response
const createSimplePrompt = (savingsData: SavingsData): string => {
    return `Goal: ${savingsData.savingName}, Current: $${savingsData.amount}, Target: $${savingsData.maturityAmount}. Give simple advice.`;
};

// Simple AI call
const callSimpleAI = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch(HUGGINGFACE_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 100,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data[0]?.generated_text || 'Simple advice: Save regularly' : data.generated_text || 'Save regularly';
    } catch (error) {
        console.error('AI call failed:', error);
        return 'Save regularly to reach your goal';
    }
};

// Simple goal advice
export const getGoalAdvice = async (savingsData: SavingsData): Promise<ChatGPTResponse> => {
    const prompt = createSimplePrompt(savingsData);
    
    try {
        const aiResponse = await callSimpleAI(prompt);
        
        return {
            advice: aiResponse,
            recommendations: ['Save monthly', 'Track progress', 'Review budget'],
            riskLevel: 'medium',
            milestones: [
                {
                    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    targetAmount: savingsData.amount + (savingsData.maturityAmount - savingsData.amount) * 0.25,
                    description: 'Month 1 target'
                }
            ]
        };
    } catch (error) {
        // Fallback
        return {
            advice: 'Save regularly to reach your goal',
            recommendations: ['Save monthly', 'Track progress', 'Review budget'],
            riskLevel: 'medium',
            milestones: [
                {
                    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    targetAmount: savingsData.amount + (savingsData.maturityAmount - savingsData.amount) * 0.25,
                    description: 'Month 1 target'
                }
            ]
        };
    }
};

// Test function
// export const testSimpleAI = async (): Promise<void> => {
//     const testData = {
//         savingName: 'Emergency Fund',
//         amount: 1000,
//         maturityAmount: 5000,
//         startDate: new Date(),
//         endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//         savingType: 'Emergency'
//     } as SavingsData;

//     const result = await getGoalAdvice(testData);
//     console.log('AI Response:', result);
// };
