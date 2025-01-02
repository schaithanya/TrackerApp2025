import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons } from '@ionic/react';
import Header from '../components/Header';
import { add, analytics, wallet,menu } from 'ionicons/icons';
import MaterialTable, { Action, Column } from 'material-table';
import { getSavingsData } from '../services/SavingsService';
import { SavingsData } from '../services/SavingsService';

interface SavingsDashboardProps {
    onCreateNew: () => void;
    toggleNav: () => void;
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ onCreateNew, toggleNav }) => {
    const [savings, setSavings] = useState<SavingsData[]>([]);
    const [totalSavings, setTotalSavings] = useState(0);
    const [totalMaturity, setTotalMaturity] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSavingsData();
            setSavings(data);
            
            // Calculate totals
            const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
            const maturity = data.reduce((sum, item) => sum + (item.maturityAmount || 0), 0);
            setTotalSavings(total);
            setTotalMaturity(maturity);
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
                <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
                    <IonCard style={{ flex: 1 }}>
                        <IonCardHeader>
                            <IonCardTitle>
                                <IonIcon icon={wallet} style={{ marginRight: '8px' }} />
                                Total Savings
                            </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            ₹{totalSavings.toLocaleString()}
                        </IonCardContent>
                    </IonCard>

                    <IonCard style={{ flex: 1 }}>
                        <IonCardHeader>
                            <IonCardTitle>
                                <IonIcon icon={analytics} style={{ marginRight: '8px' }} />
                                Total Maturity
                            </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            ₹{totalMaturity.toLocaleString()}
                        </IonCardContent>
                    </IonCard>
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
