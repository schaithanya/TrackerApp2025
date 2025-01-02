import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons } from '@ionic/react';
import Header from '../components/Header';
import { add, menu, chevronBack, chevronForward } from 'ionicons/icons';
import MaterialTable, { Action, Column } from 'material-table';
import { getSavingsData } from '../services/SavingsService';
import { SavingsData } from '../services/SavingsService';
import { SAVING_TYPES } from '../constants/savingTypes';

interface SavingsDashboardProps {
    onCreateNew: () => void;
    toggleNav: () => void;
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ onCreateNew, toggleNav }) => {
    const [savings, setSavings] = useState<SavingsData[]>([]);
    const [savingsByType, setSavingsByType] = useState<Record<string, { amount: number, maturity: number }>>({});
    const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSavingsData();
            setSavings(data);
            
            // Initialize with all types including ALL
            const initialTotals = SAVING_TYPES.reduce<Record<string, { amount: number, maturity: number }>>((acc, type) => {
                acc[type] = { amount: 0, maturity: 0 };
                return acc;
            }, {});
            
            // Calculate totals by type
            const byType = data.reduce((acc, item) => {
                const type = item.savingType || 'Others';
                acc[type].amount += item.amount || 0;
                acc[type].maturity += item.maturityAmount || 0;
                return acc;
            }, initialTotals);
            
            // Calculate ALL totals
            const allTotals = Object.values(byType).reduce<{ amount: number, maturity: number }>((acc, totals) => {
                acc.amount += totals.amount;
                acc.maturity += totals.maturity;
                return acc;
            }, { amount: 0, maturity: 0 });
            
            // Create ordered object with ALL first
            const orderedTotals = { ALL: allTotals, ...byType };
            setSavingsByType(orderedTotals);
        };
        fetchData();
    }, []);

    const columns: Column<SavingsData>[] = [
        { title: 'Name', field: 'savingName', type: 'string' },
        { title: 'Type', field: 'savingType', type: 'string' },
        { title: 'Amount', field: 'amount', type: 'numeric' },
        { title: 'Maturity Amount', field: 'maturityAmount', type: 'numeric' },
        { title: 'Start Date', field: 'startDate', type: 'string' },
        { title: 'End Date', field: 'endDate', type: 'string' }
    ];

    const handlePageChange = (page: number) => {
        // Handle page change
    };

    const handleRowsPerPageChange = (rowsPerPage: number) => {
        // Handle rows per page change
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar style={{ backgroundColor: 'blue' }}>
                    <IonButtons slot="start">
                                       <IonButton onClick={toggleNav}>
                                           <IonIcon icon={menu} />
                                       </IonButton>
                                   </IonButtons>       
                    <IonTitle>Savings Dashboard</IonTitle>
                    <IonButton 
                        slot="end" 
                        onClick={onCreateNew}
                        style={{ marginRight: '10px' }}
                    >
                        <IonIcon icon={add} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 8px', width: '100%' }}>
                    <IonButton 
                        onClick={() => setCurrentTypeIndex(prev => (prev - 1 + Object.keys(savingsByType).length) % Object.keys(savingsByType).length)}
                        disabled={Object.keys(savingsByType).length <= 1}
                        style={{ marginRight: '8px' }}
                    >
                        <IonIcon icon={chevronBack} />
                    </IonButton>
                    
                    {Object.entries(savingsByType).map(([type, totals], index) => (
                        <div key={type} style={{ display: index === currentTypeIndex ? 'block' : 'none', width: '100%' }}>
                            <IonCard style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
                                <IonCardHeader>
                                    <IonCardTitle style={{ fontSize: '1.2rem' }}>{type}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent style={{ padding: '8px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.9rem' }}>
                                        <div>Amount</div>
                                        <div>₹{totals.amount.toLocaleString()}</div>
                                        <div>Mat Amt</div>
                                        <div>₹{totals.maturity.toLocaleString()}</div>
                                        <div>Interest</div>
                                        <div>₹{(totals.maturity - totals.amount).toLocaleString()}</div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </div>
                    ))}
                    
                    <IonButton 
                        onClick={() => setCurrentTypeIndex(prev => (prev + 1) % Object.keys(savingsByType).length)}
                        disabled={Object.keys(savingsByType).length <= 1}
                        style={{ marginLeft: '16px' }}
                    >
                        <IonIcon icon={chevronForward} />
                    </IonButton>
                </div>

                <div style={{ padding: '16px' }}>
                    {/* eslint-disable react/prop-types */}
                    {/* eslint-disable react/no-deprecated */}
                    <MaterialTable
                        title="Savings Details"
                        columns={columns}
                        data={savings}
                        options={{
                            search: true,
                            paging: true,
                            filtering: true,
                            exportButton: true,
                            defaultExpanded: false
                        }}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: 'Edit Savings',
                                onClick: (event, rowData) => {
                                    // TODO: Implement edit functionality
                                }
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Savings',
                                onClick: (event, rowData) => {
                                    // TODO: Implement delete functionality
                                }
                            }
                        ]}
                    />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SavingsDashboard;
