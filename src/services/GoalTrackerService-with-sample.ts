import { SavingsData } from './SavingsService';
import { FireGoalData } from './GoalService';

// Free AI Service Configuration
const HUGGINGFACE_API_ENDPOINT = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';
const HUGGINGFACE_FALLBACK_ENDPOINT = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
const HUGGINGFACE_T5_ENDPOINT = 'https://api-inference.huggingface.co/models/google/flan-t5-large';

export interface ChatGPTResponse {
    advice: string;
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
    milestones: {
        date: string;
        targetAmount: number;
        description: string;
    }[];
    investmentStrategy?: {
        assetAllocation: {
            stocks: number;
            bonds: number;
            cash: number;
            other: number;
        };
        suggestions: string[];
    };
    fireSpecific?: {
        feasibilityScore: number; // 0-100
        safeWithdrawalAnalysis: string;
        coastFirePossible: boolean;
        leanFireTarget: number;
        traditionalFireTarget: number;
        fatFireTarget: number;
    };
}

// Sample prompts for testing free AI API responses
const SAMPLE_PROMPTS = {
    regularGoal: `Analyze this savings goal:
- Goal: Emergency Fund
- Current: $2,500
- Target: $10,000
- Timeline: 12 months
- Type: Emergency savings

Provide specific advice, monthly savings target, risk level, and 3 quarterly milestones. Format as structured advice with bullet points for recommendations.`,
    
    fireGoal: `Analyze this FIRE goal:
- Current net worth: $50,000
- FIRE target: $750,000
- Monthly income: $5,000
- Monthly expenses: $3,000
- Current age: 30
- Target retirement: 45

Provide feasibility score (0-100), risk assessment, monthly savings needed, and quarterly milestones. Include investment allocation suggestions.`,
    
    shortGoal: `Quick analysis for vacation savings:
- Current: $1,200
- Target: $3,500
- Timeline: 6 months

Give concise advice and monthly target.`
};

// Free AI service configuration
const AI_SERVICE_CONFIG = {
    primary: {
        endpoint: HUGGINGFACE_API_ENDPOINT,
        name: 'Hugging Face DialoGPT',
        requiresAuth: false
    },
    fallback: {
        endpoint: HUGGINGFACE_FALLBACK_ENDPOINT,
        name: 'Hugging Face BlenderBot',
        requiresAuth: false
    },
    t5: {
        endpoint: HUGGINGFACE_T5_ENDPOINT,
        name: 'Hugging Face FLAN-T5',
        requiresAuth: false
    }
};

// Enhanced fallback advice for when API is unavailable or rate limited
const getFallbackAdvice = (savingsData: SavingsData): ChatGPTResponse => {
    const additionalContext = savingsData.comments ? JSON.parse(savingsData.comments) : {};
    const isFIREGoal = additionalContext.monthlyIncome !== undefined;
    
    const monthsToGoal = Math.ceil(
        (new Date(Array.isArray(savingsData.endDate) ? savingsData.endDate[0] : savingsData.endDate).getTime() - 
         new Date(Array.isArray(savingsData.startDate) ? savingsData.startDate[0] : savingsData.startDate).getTime()) / 
        (1000 * 60 * 60 * 24 * 30)
    );
    
    const monthlyRequired = (savingsData.maturityAmount - savingsData.amount) / monthsToGoal;
    
    let advice = '';
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    let recommendations: string[] = [];
    
    if (isFIREGoal) {
        const fireRatio = savingsData.maturityAmount / (additionalContext.monthlyExpenses * 12);
        advice = `Based on your FIRE goal analysis, you're targeting ${fireRatio.toFixed(1)}x your annual expenses. `;
        
        if (fireRatio >= 25) {
            advice += "This follows the traditional 4% withdrawal rule and appears achievable with disciplined saving.";
            riskLevel = 'low';
        } else if (fireRatio >= 20) {
            advice += "This is a lean FIRE approach requiring careful expense management.";
            riskLevel = 'medium';
        } else {
            advice += "This target may be aggressive and require significant lifestyle changes.";
            riskLevel = 'high';
        }
        
        recommendations = [
            "Maximize tax-advantaged accounts (401k, IRA, HSA)",
            "Consider geographic arbitrage to reduce living costs",
            "Build multiple income streams for financial security",
            "Maintain 6-month emergency fund separate from FIRE savings",
            "Review and optimize monthly expenses regularly"
        ];
    } else {
        if (monthlyRequired <= 0) {
            advice = "Congratulations! You've already reached your savings goal.";
            riskLevel = 'low';
        } else if (monthlyRequired < 500) {
            advice = `You need to save approximately $${monthlyRequired.toFixed(0)} per month. This appears very achievable with basic budgeting.`;
            riskLevel = 'low';
        } else if (monthlyRequired < 1500) {
            advice = `You need to save approximately $${monthlyRequired.toFixed(0)} per month. This requires disciplined saving but is manageable.`;
            riskLevel = 'medium';
        } else {
            advice = `You need to save approximately $${monthlyRequired.toFixed(0)} per month. This is ambitious and may require significant lifestyle changes.`;
            riskLevel = 'high';
        }
        
        recommendations = [
            "Create a detailed monthly budget to track expenses",
            "Automate savings to ensure consistent contributions",
            "Consider high-yield savings accounts or CDs for safety",
            "Look for additional income opportunities",
            "Review and reduce unnecessary expenses"
        ];
    }
    
    // Generate quarterly milestones
    const milestones = [];
    const quarterlyTarget = (savingsData.maturityAmount - savingsData.amount) / (monthsToGoal / 3);
    for (let i = 1; i <= Math.min(4, Math.ceil(monthsToGoal / 3)); i++) {
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + (i * 3));
        milestones.push({
            date: targetDate.toLocaleDateString(),
            targetAmount: savingsData.amount + (quarterlyTarget * i),
            description: `Quarter ${i} milestone`
        });
    }
    
    return {
        advice,
        recommendations,
        riskLevel,
        milestones,
        investmentStrategy: {
            assetAllocation: {
                stocks: riskLevel === 'low' ? 60 : riskLevel === 'medium' ? 70 : 80,
                bonds: riskLevel === 'low' ? 30 : riskLevel === 'medium' ? 20 : 10,
                cash: riskLevel === 'low' ? 10 : riskLevel === 'medium' ? 10 : 10,
                other: 0
            },
            suggestions: [
                "Consider low-cost index funds for diversification",
                "Rebalance portfolio quarterly",
                "Keep emergency fund in high-yield savings"
            ]
        },
        fireSpecific: isFIREGoal ? {
            feasibilityScore: riskLevel === 'low' ? 85 : riskLevel === 'medium' ? 65 : 45,
            safeWithdrawalAnalysis: "4% rule recommended for traditional FIRE, 3.5% for early retirement",
            coastFirePossible: savingsData.amount > (savingsData.maturityAmount * 0.3),
            leanFireTarget: additionalContext.monthlyExpenses * 12 * 20,
            traditionalFireTarget: additionalContext.monthlyExpenses * 12 * 25,
            fatFireTarget: additionalContext.monthlyExpenses * 12 * 35
        } : undefined
    };
};

// Free AI API call with retry logic
const callFreeAI = async (prompt: string, endpoint: string): Promise<string> => {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VITE_HUGGINGFACE_API_KEY || ''}`
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 1000,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data[0]?.generated_text || data[0]?.text || '' : data.generated_text || data.text || '';
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw error;
    }
};

// Test function to check AI API response with sample prompts
export const testFreeAIResponse = async (): Promise<void> => {
    console.log('Testing free AI API responses...');
    
    for (const [promptName, prompt] of Object.entries(SAMPLE_PROMPTS)) {
        console.log(`\n--- Testing ${promptName} ---`);
        console.log('Prompt:', prompt);
        
        try {
            const response = await callFreeAI(prompt, AI_SERVICE_CONFIG.primary.endpoint);
            console.log('Response:', response);
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

// Multi-service fallback system
const getGoalAdviceFromFreeAI = async (savingsData: SavingsData): Promise<ChatGPTResponse> => {
    const createPrompt = (savingsData: SavingsData) => {
        const additionalContext = savingsData.comments ? JSON.parse(savingsData.comments) : {};
        const isFIREGoal = additionalContext.monthlyIncome !== undefined;

        if (isFIREGoal) {
            return `Analyze this FIRE goal:
Current net worth: $${savingsData.amount}
FIRE target: $${savingsData.maturityAmount}
Monthly income: $${additionalContext.monthlyIncome || 0}
Monthly expenses: $${additionalContext.monthlyExpenses || 0}
Current age: ${additionalContext.currentAge || 30}
Target retirement age: ${additionalContext.targetRetirementAge || 45}
Expected return rate: ${additionalContext.expectedReturnRate || 7}%

Provide feasibility score (0-100), risk assessment, monthly savings needed, and quarterly milestones. Include investment allocation suggestions.`;
        } else {
            return `Analyze this savings goal:
Goal name: ${savingsData.savingName}
Current amount: $${savingsData.amount}
Target amount: $${savingsData.maturityAmount}
Timeline: ${new Date(Array.isArray(savingsData.endDate) ? savingsData.endDate[0] : savingsData.endDate).toLocaleDateString()}
Goal type: ${savingsData.savingType}

Provide specific advice, monthly savings target, risk level, and quarterly milestones. Format as structured advice with bullet points for recommendations.`;
        }
    };

    const prompt = createPrompt(savingsData);

    // Try multiple free AI services in order
    const services = [
        AI_SERVICE_CONFIG.primary.endpoint,
        AI_SERVICE_CONFIG.fallback.endpoint,
        AI_SERVICE_CONFIG.t5.endpoint
    ];

    for (const endpoint of services) {
        try {
            const aiResponse = await callFreeAI(prompt, endpoint);
            if (aiResponse && aiResponse.length > 50) {
                // Parse the response
                const lines = aiResponse.split('\n').filter(line => line.trim());
                const advice = lines[0] || 'Based on your financial data, here are personalized recommendations:';
                const recommendations = lines.filter(line => line.startsWith('-')).map(line => line.replace(/^-\s*/, ''));
                
                return {
                    advice,
                    recommendations: recommendations.length > 0 ? recommendations : [
                        "Create a detailed monthly budget",
                        "Automate savings contributions",
                        "Review and optimize expenses regularly"
                    ],
                    riskLevel: 'medium',
                    milestones: [
                        {
                            date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                            targetAmount: savingsData.amount + (savingsData.maturityAmount - savingsData.amount) * 0.25,
                            description: 'First quarter milestone'
                        },
                        {
                            date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                            targetAmount: savingsData.amount + (savingsData.maturityAmount - savingsData.amount) * 0.5,
                            description: 'Second quarter milestone'
                        },
                        {
                            date: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                            targetAmount: savingsData.amount + (savingsData.maturityAmount - savingsData.amount) * 0.75,
                            description: 'Third quarter milestone'
                        }
                    ]
                };
            }
        } catch (error) {
            console.warn(`Failed to get response from ${endpoint}:`, error);
            continue;
        }
    }

    // Fallback to offline advice if all free AI services fail
    console.log('All free AI services failed, using fallback advice...');
    return getFallbackAdvice(savingsData);
};

// Main export function - updated to use free AI
export const getGoalAdvice = async (savingsData: SavingsData): Promise<ChatGPTResponse> => {
    return await getGoalAdviceFromFreeAI(savingsData);
};

// Utility function to check free AI service availability
export const checkFreeAIServices = async (): Promise<{[key: string]: boolean}> => {
    const results: {[key: string]: boolean} = {};
    
    for (const [key, config] of Object.entries(AI_SERVICE_CONFIG)) {
        try {
            const response = await fetch(config.endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_HUGGINGFACE_API_KEY || ''}`
                }
            });
            results[config.name] = response.ok;
        } catch {
            results[config.name] = false;
        }
    }
    
    return results;
};
