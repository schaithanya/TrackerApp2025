import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { SavingsData } from '../services/SavingsService';

interface DashboardStatsProps {
    savings: SavingsData[];
    savingsByType: Record<string, { amount: number; maturity: number }>;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ savings, savingsByType }) => {
    // Calculate total stats
    const totalStats = savings.reduce(
        (acc, curr) => {
            acc.currentAmount += curr.amount || 0;
            acc.maturityAmount += curr.maturityAmount || 0;
            acc.totalInterest += (curr.maturityAmount - curr.amount) || 0;
            return acc;
        },
        { currentAmount: 0, maturityAmount: 0, totalInterest: 0 }
    );

    // Calculate progress percentage
    const overallProgress = totalStats.maturityAmount > 0 
        ? (totalStats.currentAmount / totalStats.maturityAmount) * 100 
        : 0;

    // Group savings by type for distribution chart
    const typeDistribution = Object.entries(savingsByType)
        .filter(([type]) => type !== 'ALL')
        .map(([type, data]) => ({
            type,
            percentage: (data.amount / totalStats.currentAmount) * 100
        }))
        .sort((a, b) => b.percentage - a.percentage);

    // Calculate time-based metrics
    const today = new Date();
    const upcomingMaturities = savings
        .filter(saving => {
            const endDate = Array.isArray(saving.endDate) ? saving.endDate[0] : saving.endDate;
            const maturityDate = new Date(endDate);
            const threeMothsFromNow = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
            return maturityDate <= threeMothsFromNow && maturityDate >= today;
        })
        .sort((a, b) => {
            const aDate = new Date(Array.isArray(a.endDate) ? a.endDate[0] : a.endDate);
            const bDate = new Date(Array.isArray(b.endDate) ? b.endDate[0] : b.endDate);
            return aDate.getTime() - bDate.getTime();
        });

    const returnOnInvestment = totalStats.totalInterest / totalStats.currentAmount * 100;

    return (
        <div className="dashboard-stats">
            {/* Overall Progress Card */}
            <IonCard className="stats-card overall-progress">
                <IonCardHeader>
                    <IonCardTitle>Overall Progress</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className="progress-container">
                        <CircularProgressbar
                            value={overallProgress}
                            text={`${Math.round(overallProgress)}%`}
                            styles={buildStyles({
                                pathColor: `rgba(107, 94, 205, ${overallProgress / 100})`,
                                textColor: '#6B5ECD',
                                trailColor: '#F3F4F6',
                                strokeLinecap: 'round'
                            })}
                        />
                        <div className="progress-details">
                            <div className="stat-item">
                                <span className="label">Current</span>
                                <span className="value">₹{totalStats.currentAmount.toLocaleString()}</span>
                            </div>
                            <div className="stat-item">
                                <span className="label">Target</span>
                                <span className="value">₹{totalStats.maturityAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </IonCardContent>
            </IonCard>

            {/* Portfolio Distribution Card */}
            <IonCard className="stats-card distribution">
                <IonCardHeader>
                    <IonCardTitle>Portfolio Distribution</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className="distribution-bars">
                        {typeDistribution.map(({ type, percentage }) => (
                            <div key={type} className="distribution-bar">
                                <div className="bar-header">
                                    <span className="type">{type}</span>
                                    <span className="percentage">{Math.round(percentage)}%</span>
                                </div>
                                <div className="bar-container">
                                    <div 
                                        className="bar-fill"
                                        style={{ 
                                            width: `${percentage}%`,
                                            backgroundColor: type === 'FD' ? '#6B5ECD' :
                                                          type === 'MF' ? '#FF6B6B' :
                                                          type === 'PPF' ? '#4CD964' :
                                                          '#5AC8FA'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </IonCardContent>
            </IonCard>

            {/* ROI and Upcoming Maturities */}
            <div className="stats-row">
                <IonCard className="stats-card roi">
                    <IonCardHeader>
                        <IonCardTitle>Return on Investment</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className="roi-stats">
                            <div className="stat-large">{Math.round(returnOnInvestment)}%</div>
                            <div className="stat-detail">
                                <span>Total Interest:</span>
                                <span>₹{totalStats.totalInterest.toLocaleString()}</span>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>

                <IonCard className="stats-card maturities">
                    <IonCardHeader>
                        <IonCardTitle>Upcoming Maturities</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className="maturity-list">
                            {upcomingMaturities.length > 0 ? (
                                upcomingMaturities.slice(0, 3).map((saving, index) => (
                                    <div key={index} className="maturity-item">
                                        <div className="maturity-info">
                                            <span className="name">{saving.savingType}</span>
                                            <span className="date">
                                                {new Date(Array.isArray(saving.endDate) ? saving.endDate[0] : saving.endDate)
                                                    .toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                            </span>
                                        </div>
                                        <span className="amount">₹{saving.maturityAmount.toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-maturities">No upcoming maturities in next 3 months</div>
                            )}
                        </div>
                    </IonCardContent>
                </IonCard>
            </div>
        </div>
    );
};

export default DashboardStats;
