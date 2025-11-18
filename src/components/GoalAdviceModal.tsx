import React from 'react';
import './GoalAdviceModal.css';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonNote
} from '@ionic/react';
import { closeOutline, warningOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { ChatGPTResponse } from '../services/GoalTrackerService';

interface GoalAdviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    advice: ChatGPTResponse | null;
    loading: boolean;
}

const GoalAdviceModal: React.FC<GoalAdviceModalProps> = ({ isOpen, onClose, advice, loading }) => {
    const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
        switch (risk) {
            case 'low':
                return checkmarkCircleOutline;
            case 'medium':
                return warningOutline;
            case 'high':
                return alertCircleOutline;
            default:
                return warningOutline;
        }
    };

    const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
        switch (risk) {
            case 'low':
                return 'success';
            case 'medium':
                return 'warning';
            case 'high':
                return 'danger';
            default:
                return 'warning';
        }
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="goal-advice-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Goal Analysis</IonTitle>
                    <IonButton slot="end" fill="clear" onClick={onClose}>
                        <IonIcon icon={closeOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {loading ? (
                    <div className="ion-text-center ion-padding">
                        <IonNote>Analyzing your savings goal...</IonNote>
                    </div>
                ) : advice ? (
                    <>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Risk Assessment</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="ion-margin-bottom">
                                    <IonBadge color={getRiskColor(advice.riskLevel)}>
                                        <IonIcon icon={getRiskIcon(advice.riskLevel)} />
                                        &nbsp;{advice.riskLevel.toUpperCase()} RISK
                                    </IonBadge>
                                </div>
                                <p>{advice.advice}</p>
                            </IonCardContent>
                        </IonCard>

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Recommendations</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonList>
                                    {advice.recommendations.map((rec, index) => (
                                        <IonItem key={index}>
                                            <IonLabel className="ion-text-wrap">{rec}</IonLabel>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </IonCardContent>
                        </IonCard>

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Milestones</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonList>
                                    {advice.milestones.map((milestone, index) => (
                                        <IonItem key={index}>
                                            <IonLabel>
                                                <h2>{milestone.date}</h2>
                                                <h3>${milestone.targetAmount.toLocaleString()}</h3>
                                                <p>{milestone.description}</p>
                                            </IonLabel>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </IonCardContent>
                        </IonCard>
                    </>
                ) : (
                    <div className="ion-text-center ion-padding">
                        <IonNote>No advice available</IonNote>
                    </div>
                )}
            </IonContent>
        </IonModal>
    );
};

export default GoalAdviceModal;
