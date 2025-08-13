import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonList
} from '@ionic/react';
import { menu, pencil } from 'ionicons/icons';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {
    FireGoalData,
    IncomeSource,
    MonthlyExpense,
    EXPENSE_CATEGORIES,
    getFireGoalData,
    saveFireGoalData,
    calculateRetirementProjections
} from '../services/GoalService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface GoalTrackerProps {
    toggleNav: () => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ toggleNav }) => {
    const [fireData, setFireData] = useState<FireGoalData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await getFireGoalData();
                setFireData(data);
                setError(null);
            } catch (err) {
                console.error('Error loading FIRE goal data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={toggleNav}>
                                <IonIcon icon={menu} />
                            </IonButton>
                        </IonButtons>
                        <IonTitle>FIRE Goal Tracker</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>
                </IonContent>
            </IonPage>
        );
    }

    if (error) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={toggleNav}>
                                <IonIcon icon={menu} />
                            </IonButton>
                        </IonButtons>
                        <IonTitle>FIRE Goal Tracker</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--ion-color-danger)' }}>
                        {error}
                        <IonButton onClick={() => window.location.reload()}>Retry</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (!fireData) return null;

    const { monthlyData, yearsToRetirement, projectedAmount } = calculateRetirementProjections(fireData);

    const chartData = {
        labels: Array.from({ length: yearsToRetirement + 1 }, (_, i) => fireData.currentAge + i),
        datasets: [
            {
                label: 'Projected Net Worth',
                data: monthlyData.filter((_, i) => i % 12 === 0),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Target',
                data: Array(yearsToRetirement + 1).fill(fireData.targetRetirementAmount),
                borderColor: 'rgb(255, 99, 132)',
                borderDash: [5, 5]
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: true,
                text: 'FIRE Journey Projection'
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(tickValue: string | number) {
                        if (typeof tickValue === 'number') {
                            return '$' + tickValue.toLocaleString();
                        }
                        return '$' + tickValue;
                    }
                }
            }
        }
    };

    const progressPercentage = (fireData.currentNetWorth / fireData.targetRetirementAmount) * 100;
    const monthlyIncome = fireData.incomeSources.reduce((sum, source) => 
        sum + (source.frequency === 'Monthly' ? source.amount : source.amount / 12), 0);
    const monthlyExpenses = fireData.monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const essentialExpenses = fireData.monthlyExpenses
        .filter(e => e.isEssential)
        .reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={toggleNav}>
                            <IonIcon icon={menu} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>FIRE Goal Tracker</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setIsEditing(true)}>
                            <IonIcon icon={pencil} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div className="ion-padding">
                    {/* Summary Cards */}
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>FIRE Progress</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ 
                                    height: '20px',
                                    background: '#f0f0f0',
                                    borderRadius: '10px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${progressPercentage}%`,
                                        height: '100%',
                                        background: 'rgb(75, 192, 192)',
                                        transition: 'width 0.5s ease-in-out'
                                    }} />
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                    {progressPercentage.toFixed(1)}% of target
                                </div>
                            </div>
                            <div className="ion-padding">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <strong>Current Net Worth:</strong>
                                        <p>${fireData.currentNetWorth.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <strong>Target Amount:</strong>
                                        <p>${fireData.targetRetirementAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <strong>Years to FIRE:</strong>
                                        <p>{yearsToRetirement} years</p>
                                    </div>
                                    <div>
                                        <strong>Monthly Savings Rate:</strong>
                                        <p>{((fireData.currentMonthlySavings / monthlyIncome) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>

                    {/* Projection Chart */}
                    <IonCard>
                        <IonCardContent>
                            <Line data={chartData} options={chartOptions} />
                        </IonCardContent>
                    </IonCard>

                    {/* Monthly Overview */}
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Monthly Overview</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <strong>Total Income:</strong>
                                    <p>${monthlyIncome.toLocaleString()}</p>
                                </div>
                                <div>
                                    <strong>Total Expenses:</strong>
                                    <p>${monthlyExpenses.toLocaleString()}</p>
                                </div>
                                <div>
                                    <strong>Essential Expenses:</strong>
                                    <p>${essentialExpenses.toLocaleString()}</p>
                                </div>
                                <div>
                                    <strong>Savings:</strong>
                                    <p>${(monthlyIncome - monthlyExpenses).toLocaleString()}</p>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>

            <IonModal isOpen={isEditing} onDidDismiss={() => setIsEditing(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Edit FIRE Goals</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsEditing(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as 'income' | 'expenses')}>
                        <IonSegmentButton value="income">
                            <IonLabel>Income & Goals</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="expenses">
                            <IonLabel>Monthly Expenses</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {activeTab === 'income' ? (
                        <div className="ion-padding">
                            <IonList>
                                <IonItem>
                                    <IonLabel position="stacked">Current Age</IonLabel>
                                    <IonInput
                                        type="number"
                                        value={fireData.currentAge}
                                        onIonChange={e => setFireData({
                                            ...fireData,
                                            currentAge: parseInt(e.detail.value!, 10)
                                        })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Target Retirement Age</IonLabel>
                                    <IonInput
                                        type="number"
                                        value={fireData.targetRetirementAge}
                                        onIonChange={e => setFireData({
                                            ...fireData,
                                            targetRetirementAge: parseInt(e.detail.value!, 10)
                                        })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Current Net Worth</IonLabel>
                                    <IonInput
                                        type="number"
                                        value={fireData.currentNetWorth}
                                        onIonChange={e => setFireData({
                                            ...fireData,
                                            currentNetWorth: parseInt(e.detail.value!, 10)
                                        })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Target Retirement Amount</IonLabel>
                                    <IonInput
                                        type="number"
                                        value={fireData.targetRetirementAmount}
                                        onIonChange={e => setFireData({
                                            ...fireData,
                                            targetRetirementAmount: parseInt(e.detail.value!, 10)
                                        })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Expected Return Rate (%)</IonLabel>
                                    <IonInput
                                        type="number"
                                        value={fireData.expectedReturnRate}
                                        onIonChange={e => setFireData({
                                            ...fireData,
                                            expectedReturnRate: parseFloat(e.detail.value!)
                                        })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Safe Withdrawal Rate (%)</IonLabel>
                                    <IonInput
                                        type="number"
                                        value={fireData.safeWithdrawalRate}
                                        onIonChange={e => setFireData({
                                            ...fireData,
                                            safeWithdrawalRate: parseFloat(e.detail.value!)
                                        })}
                                    />
                                </IonItem>
                            </IonList>

                            <IonList>
                                <IonItem>
                                    <IonLabel>Income Sources</IonLabel>
                                    <IonButton
                                        slot="end"
                                        onClick={() => {
                                            setFireData({
                                                ...fireData,
                                                incomeSources: [...fireData.incomeSources, {
                                                    source: '',
                                                    amount: 0,
                                                    frequency: 'Monthly',
                                                    isPassive: false
                                                }]
                                            });
                                        }}
                                    >
                                        Add
                                    </IonButton>
                                </IonItem>

                                {fireData.incomeSources.map((source, index) => (
                                    <IonItem key={index}>
                                        <IonInput
                                            placeholder="Source"
                                            value={source.source}
                                            onIonChange={e => {
                                                const newSources = [...fireData.incomeSources];
                                                newSources[index] = { ...source, source: e.detail.value! };
                                                setFireData({ ...fireData, incomeSources: newSources });
                                            }}
                                        />
                                        <IonInput
                                            type="number"
                                            placeholder="Amount"
                                            value={source.amount}
                                            onIonChange={e => {
                                                const newSources = [...fireData.incomeSources];
                                                newSources[index] = { ...source, amount: parseInt(e.detail.value!, 10) };
                                                setFireData({ ...fireData, incomeSources: newSources });
                                            }}
                                        />
                                        <IonSelect
                                            value={source.frequency}
                                            onIonChange={e => {
                                                const newSources = [...fireData.incomeSources];
                                                newSources[index] = { ...source, frequency: e.detail.value };
                                                setFireData({ ...fireData, incomeSources: newSources });
                                            }}
                                        >
                                            <IonSelectOption value="Monthly">Monthly</IonSelectOption>
                                            <IonSelectOption value="Annually">Annually</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    ) : (
                        <div className="ion-padding">
                            <IonList>
                                <IonItem>
                                    <IonLabel>Monthly Expenses</IonLabel>
                                    <IonButton
                                        slot="end"
                                        onClick={() => {
                                            setFireData({
                                                ...fireData,
                                                monthlyExpenses: [...fireData.monthlyExpenses, {
                                                    category: EXPENSE_CATEGORIES[0],
                                                    amount: 0,
                                                    isEssential: true
                                                }]
                                            });
                                        }}
                                    >
                                        Add
                                    </IonButton>
                                </IonItem>

                                {fireData.monthlyExpenses.map((expense, index) => (
                                    <IonItem key={index}>
                                        <IonSelect
                                            value={expense.category}
                                            onIonChange={e => {
                                                const newExpenses = [...fireData.monthlyExpenses];
                                                newExpenses[index] = { ...expense, category: e.detail.value };
                                                setFireData({ ...fireData, monthlyExpenses: newExpenses });
                                            }}
                                        >
                                            {EXPENSE_CATEGORIES.map(category => (
                                                <IonSelectOption key={category} value={category}>
                                                    {category}
                                                </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                        <IonInput
                                            type="number"
                                            placeholder="Amount"
                                            value={expense.amount}
                                            onIonChange={e => {
                                                const newExpenses = [...fireData.monthlyExpenses];
                                                newExpenses[index] = { ...expense, amount: parseInt(e.detail.value!, 10) };
                                                setFireData({ ...fireData, monthlyExpenses: newExpenses });
                                            }}
                                        />
                                        <IonButton
                                            fill={expense.isEssential ? 'solid' : 'outline'}
                                            onClick={() => {
                                                const newExpenses = [...fireData.monthlyExpenses];
                                                newExpenses[index] = { ...expense, isEssential: !expense.isEssential };
                                                setFireData({ ...fireData, monthlyExpenses: newExpenses });
                                            }}
                                        >
                                            {expense.isEssential ? 'Essential' : 'Optional'}
                                        </IonButton>
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    )}

                    <IonButton
                        expand="block"
                        className="ion-margin"
                        onClick={async () => {
                            if (fireData) {
                                await saveFireGoalData(fireData);
                                setIsEditing(false);
                            }
                        }}
                    >
                        Save Changes
                    </IonButton>
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default GoalTracker;
