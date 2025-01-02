import React, { useState } from 'react';
import { IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime, IonTextarea, IonButton } from '@ionic/react';
import { SAVING_TYPES } from '../constants/savingTypes';
import { saveSavingsData, SavingsData } from '../services/SavingsService';

const SavingsCreate: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
    const [formData, setFormData] = useState<SavingsData>({
        savingName: '',
        savingType: 'FD',
        amount: 0,
        maturityAmount: 0,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        comments: '',
        file: null
    });

    const handleInputChange = (field: keyof SavingsData, value: string | number | File | string[] | null) => {
        let finalValue: string | number | File | string[] | null = value;
        
        // Handle IonDatetime array values for date fields
        if (Array.isArray(value) && (field === 'startDate' || field === 'endDate')) {
            finalValue = value;
        }
        // Handle IonDatetime array values for other fields
        else if (Array.isArray(value)) {
            finalValue = value[0] || '';
        }
        
        // Handle null values
        if (value === null) {
            finalValue = null;
        }
        
        setFormData(prev => ({ ...prev, [field]: finalValue }));
    };

    const handleSave = async () => {
        try {
            await saveSavingsData({
                ...formData,
                amount: Number(formData.amount),
                maturityAmount: Number(formData.maturityAmount)
            });
            onCancel();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <IonContent>
            <IonItem>
                <IonLabel position="stacked">Saving Name</IonLabel>
                <IonInput
                    value={formData.savingName}
                    onIonChange={e => handleInputChange('savingName', e.detail.value!)}
                />
            </IonItem>

            <IonItem>
                <IonLabel position="stacked">Saving Type</IonLabel>
                <IonSelect
                    value={formData.savingType}
                    onIonChange={e => handleInputChange('savingType', e.detail.value)}
                >
                    {SAVING_TYPES.map(type => (
                        <IonSelectOption key={type} value={type}>{type}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>

            <IonItem>
                <IonLabel position="stacked">Amount</IonLabel>
                <IonInput
                    type="number"
                    value={formData.amount}
                    onIonChange={e => handleInputChange('amount', e.detail.value!)}
                />
            </IonItem>

            <IonItem>
                <IonLabel position="stacked">Maturity Amount</IonLabel>
                <IonInput
                    type="number"
                    value={formData.maturityAmount}
                    onIonChange={e => handleInputChange('maturityAmount', e.detail.value!)}
                />
            </IonItem>

            <IonItem>
                <IonLabel position="stacked">Start Date</IonLabel>
                <IonDatetime
                    value={formData.startDate}
                    onIonChange={e => handleInputChange('startDate', e.detail.value!)}
                />
            </IonItem>

            <IonItem>
                <IonLabel position="stacked">End Date</IonLabel>
                <IonDatetime
                    value={formData.endDate}
                    onIonChange={e => handleInputChange('endDate', e.detail.value!)}
                />
            </IonItem>

            <IonItem>
                <IonLabel position="stacked">Comments</IonLabel>
                <IonTextarea
                    value={formData.comments}
                    onIonChange={e => handleInputChange('comments', e.detail.value!)}
                />
            </IonItem>

            <IonItem>
                <IonLabel position="stacked">File Attachment</IonLabel>
                <input
                    type="file"
                    onChange={e => handleInputChange('file', e.target.files?.[0] || null)}
                />
            </IonItem>

            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <IonButton color="danger" onClick={onCancel}>Cancel</IonButton>
                <IonButton color="success" onClick={handleSave}>Save</IonButton>
            </div>
        </IonContent>
    );
};

export default SavingsCreate;
