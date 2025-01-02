import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonModal, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime } from '@ionic/react';
import Header from '../components/Header';
import { add, menu, chevronBack, chevronForward } from 'ionicons/icons';
import MaterialTable, { Action, Column } from 'material-table';
import { forwardRef } from 'react';
import { getSavingsData, updateSavingsData, deleteSavingsData } from '../services/SavingsService';
import { SavingsData } from '../services/SavingsService';
import { SAVING_TYPES } from '../constants/savingTypes';

interface SavingsDashboardProps {
    onCreateNew: () => void;
    toggleNav: () => void;
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ onCreateNew, toggleNav }) => {
    const [savings, setSavings] = useState<SavingsData[]>([]);
    const [selectedSavings, setSelectedSavings] = useState<SavingsData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
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
        { title: 'Type', field: 'savingType', type: 'string' },
        { title: 'Amount', field: 'amount', type: 'numeric' },
        { 
            title: 'Interest', 
            field: 'interest',
            type: 'numeric',
            render: rowData => (rowData.maturityAmount - rowData.amount).toLocaleString()
        },
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
                        style={{ marginRight: '10px' }}>
                        <IonIcon icon={add} size="small" />
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
                        <IonIcon icon={chevronBack} size="small" />
                    </IonButton>
                    
                    {Object.entries(savingsByType).map(([type, totals], index) => (
                        <div key={type} style={{ display: index === currentTypeIndex ? 'block' : 'none', width: '100%' }}>
                             <IonCard style={{ maxWidth: '600px', width: '100%', margin: '0 auto', border: '1px solid #ccc' }}>
                                <IonCardHeader style={{ borderBottom: '1px solid #ccc' }}>
                                    <IonCardTitle style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>{type}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent style={{ padding: '8px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.9rem' }}>
                                        <div><strong style={{ fontSize: '1.1rem' }}>Amount</strong></div>
                                        <div style={{ fontSize: '1.1rem' }}>₹{totals.amount.toLocaleString()}</div>
                                        <div><strong style={{ fontSize: '1.1rem' }}>Mat Amt</strong></div>
                                        <div style={{ fontSize: '1.1rem' }}>₹{totals.maturity.toLocaleString()}</div>
                                        <div><strong style={{ fontSize: '1.1rem' }}>Interest</strong></div>
                                        <div style={{ fontSize: '1.1rem' }}>₹{(totals.maturity - totals.amount).toLocaleString()}</div>
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
                        <IonIcon icon={chevronForward} size="small" />
                    </IonButton>
                </div>

                <div style={{ padding: '16px' }}>                   
                    <MaterialTable
                        title="Savings Details"
                        columns={columns}
                        data={savings}
                        options={{
                            search: false,
                            paging: true,                            
                            exportButton: true,
                            defaultExpanded: false,
                            actionsColumnIndex: -1
                        }}
                        icons={{
                            Export: forwardRef<SVGSVGElement>((props, ref) => (
                                <svg {...props} ref={ref} viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                            ))
                        }}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}                      
                        actions={[
                            {
                                icon: 'Edit',
                                tooltip: 'Edit Savings',
                                onClick: async (event, rowData) => {
                                    if (Array.isArray(rowData)) return;
                                    setSelectedSavings(rowData);
                                    setIsEditing(true);
                                }
                            },
                            {
                                icon: 'Delete',
                                tooltip: 'Delete Savings',
                                onClick: async (event, rowData) => {
                                    if (Array.isArray(rowData)) return;
                                    const confirmDelete = window.confirm('Are you sure you want to delete this savings entry?');
                                    if (confirmDelete) {
                                        try {
                                            const index = savings.findIndex(s => s === rowData);
                                            await deleteSavingsData(index);
                                            // Create a new array to force state update
                                            const newSavings = [...savings];
                                            newSavings.splice(index, 1);
                                            setSavings(newSavings);
                                        } catch (error) {
                                            console.error('Error deleting savings:', error);
                                        }
                                    }
                                }
                            }
                        ]}
                    />
                </div>
            </IonContent>

            <IonModal isOpen={isEditing} onDidDismiss={() => setIsEditing(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Edit Savings</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsEditing(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {selectedSavings && (
                        <div style={{ padding: '16px' }}>
                            <IonItem>
                                <IonLabel position="stacked">Name</IonLabel>
                                <IonInput
                                    value={selectedSavings.savingName}
                                    onIonChange={e => setSelectedSavings({ ...selectedSavings, savingName: e.detail.value! })}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Type</IonLabel>
                                <IonSelect
                                    value={selectedSavings.savingType}
                                    onIonChange={e => setSelectedSavings({ ...selectedSavings, savingType: e.detail.value })}
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
                                    value={selectedSavings.amount}
                                    onIonChange={e => setSelectedSavings({ ...selectedSavings, amount: parseFloat(e.detail.value!) })}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Maturity Amount</IonLabel>
                                <IonInput
                                    type="number"
                                    value={selectedSavings.maturityAmount}
                                    onIonChange={e => setSelectedSavings({ ...selectedSavings, maturityAmount: parseFloat(e.detail.value!) })}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Start Date</IonLabel>
                                <IonDatetime
                                    presentation="date"
                                    locale="en-US"
                                    value={selectedSavings.startDate}
                                    onIonChange={e => setSelectedSavings({ ...selectedSavings, startDate: e.detail.value! })}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">End Date</IonLabel>
                                <IonDatetime
                                    presentation="date"
                                    locale="en-US"
                                    value={selectedSavings.endDate}
                                    onIonChange={e => setSelectedSavings({ ...selectedSavings, endDate: e.detail.value! })}
                                />
                            </IonItem>

                            <IonButton
                                expand="block"
                                style={{ marginTop: '16px' }}
                                onClick={async () => {
                                    try {
                                        const index = savings.findIndex(s => s === selectedSavings);
                                        await updateSavingsData(index, selectedSavings!);
                                        const updatedSavings = await getSavingsData();
                                        setSavings(updatedSavings);
                                        setIsEditing(false);
                                    } catch (error) {
                                        console.error('Error updating savings:', error);
                                    }
                                }}
                            >
                                Save Changes
                            </IonButton>
                        </div>
                    )}
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default SavingsDashboard;
