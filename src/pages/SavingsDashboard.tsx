import React, { useState, useEffect, forwardRef } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonModal, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime } from '@ionic/react';
import Header from '../components/Header';
import { add, menu, chevronBack, chevronForward, trash, pencil } from 'ionicons/icons';
import MaterialTable, { Action, Column } from 'material-table';
import { getSavingsData, updateSavingsData, deleteSavingsData } from '../services/SavingsService';
import { SavingsData } from '../services/SavingsService';
import { SAVING_TYPES } from '../constants/savingTypes';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AccountBalance, Security, ShowChart, Savings, MonetizationOn, TrendingUp, AttachMoney, PieChart } from '@mui/icons-material';

interface SavingsDashboardProps {
    onCreateNew: () => void;
    toggleNav: () => void;
}

const iconMapping: Record<string, JSX.Element> = {
    FD: <AccountBalance style={{ fontSize: 40, color: '#3e98c7' }} />,
    Insurance: <Security style={{ fontSize: 40, color: '#f44336' }} />,
    MF: <ShowChart style={{ fontSize: 40, color: '#4caf50' }} />,
    PPF: <Savings style={{ fontSize: 40, color: '#ff9800' }} />,
    CASH: <AttachMoney style={{ fontSize: 40, color: '#9c27b0' }} />,
    NPS: <TrendingUp style={{ fontSize: 40, color: '#2196f3' }} />,
    PF: <MonetizationOn style={{ fontSize: 40, color: '#009688' }} />,
    Others: <PieChart style={{ fontSize: 40, color: '#607d8b' }} />,
    ALL: <PieChart style={{ fontSize: 40, color: '#000000' }} />
};

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ onCreateNew, toggleNav }) => {
    const [savings, setSavings] = React.useState<SavingsData[]>([]);
    const [selectedSavings, setSelectedSavings] = React.useState<SavingsData | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [savingsByType, setSavingsByType] = React.useState<Record<string, { amount: number, maturity: number }>>({});
    const [currentTypeIndex, setCurrentTypeIndex] = React.useState(0);

    React.useEffect(() => {
        const fetchData = async () => {
            const data = await getSavingsData();
            setSavings(data);

            const initialTotals = SAVING_TYPES.reduce<Record<string, { amount: number, maturity: number }>>((acc, type) => {
                acc[type] = { amount: 0, maturity: 0 };
                return acc;
            }, {});

            const byType = data.reduce((acc, item) => {
                const type = item.savingType || 'Others';
                acc[type].amount += item.amount || 0;
                acc[type].maturity += item.maturityAmount || 0;
                return acc;
            }, initialTotals);

            const allTotals = Object.values(byType).reduce<{ amount: number, maturity: number }>((acc, totals) => {
                acc.amount += totals.amount;
                acc.maturity += totals.maturity;
                return acc;
            }, { amount: 0, maturity: 0 });

            const orderedTotals = { ALL: allTotals, ...byType };
            setSavingsByType(orderedTotals);
        };
        fetchData();
    }, []);

    const columns: Column<SavingsData>[] = [
        { title: 'Type', field: 'savingType', type: 'string', cellStyle: { textAlign: 'left', fontSize: '0.8rem' }, headerStyle: { textAlign: 'left', fontSize: '0.8rem' } },
        { title: 'Amount', field: 'amount', type: 'numeric', cellStyle: { textAlign: 'left', fontSize: '0.8rem' }, headerStyle: { textAlign: 'left', fontSize: '0.8rem' } },
        {
            title: 'Interest',
            field: 'interest',
            type: 'numeric',
            render: rowData => (rowData.maturityAmount - rowData.amount).toLocaleString(),
            cellStyle: { textAlign: 'left', fontSize: '0.8rem' },
            headerStyle: { fontSize: '0.8rem' }
        },
        {
            title: 'End Date',
            field: 'endDate',
            type: 'string',
            render: rowData => {
                const endDate = Array.isArray(rowData.endDate) ? rowData.endDate[0] : rowData.endDate;
                return new Date(endDate).toLocaleDateString();
            },
            cellStyle: { textAlign: 'left', fontSize: '0.8rem' },
            headerStyle: { fontSize: '0.8rem' }
        }
    ];

    const detailPanel = (rowData: SavingsData) => {
        const startDate = Array.isArray(rowData.startDate) ? rowData.startDate[0] : rowData.startDate;
        const endDate = Array.isArray(rowData.endDate) ? rowData.endDate[0] : rowData.endDate;

        return (
            <div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>{rowData.savingName}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><strong>Type:</strong> {rowData.savingType}</div>
                    <div><strong>Amount:</strong> ₹{rowData.amount.toLocaleString()}</div>
                    <div><strong>Maturity Amount:</strong> ₹{rowData.maturityAmount.toLocaleString()}</div>
                    <div><strong>Interest:</strong> ₹{(rowData.maturityAmount - rowData.amount).toLocaleString()}</div>
                    <div><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</div>
                    <div><strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}</div>
                </div>
            </div>
        );
    };

    const handlePageChange = (page: number) => {
        // Handle page change
    };

    const handleRowsPerPageChange = (rowsPerPage: number) => {
        // Handle rows per page change
    };

    // New component for live dashboard below the table
    const SavingsTypeDashboard: React.FC<{ data: Record<string, { amount: number, maturity: number }> }> = ({ data }) => {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                padding: '20px',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {Object.entries(data).map(([type, totals]) => {
                    const percentage = totals.maturity > 0 ? Math.min(100, (totals.amount / totals.maturity) * 100) : 0;
                    return (
                        <div key={type} style={{
                            border: '1px solid #ccc',
                            borderRadius: '12px',
                            padding: '12px',
                            textAlign: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            backgroundColor: '#fff'
                        }}>
                            <div style={{ marginBottom: '8px' }}>
                                {iconMapping[type] || iconMapping['Others']}
                            </div>
                            <div style={{ width: 80, height: 80, margin: '0 auto' }}>
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${Math.round(percentage)}%`}
                                    styles={buildStyles({
                                        textSize: '16px',
                                        pathColor: '#3e98c7',
                                        textColor: '#333',
                                        trailColor: '#d6d6d6',
                                    })}
                                />
                            </div>
                            <h4 style={{ margin: '8px 0 4px 0' }}>{type}</h4>
                            <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                ₹{totals.amount.toLocaleString()} / ₹{totals.maturity.toLocaleString()}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
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
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.8rem' }}>
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

                <div style={{ padding: '18px' }}>                   
                    <MaterialTable
                        title=""
                        columns={columns}
                        data={savings}
                        detailPanel={detailPanel}
                        style={{ maxWidth: '50rem' }}
                        options={{
                            search: false,
                            paging: false,                            
                            exportButton: false, 
                            defaultExpanded: false,
                            actionsColumnIndex: -1,
                            sorting: false
                        }}
                        icons={{
                            Export: forwardRef<SVGSVGElement>((props, ref) => (
                                <svg {...props} ref={ref} viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                            )),
                            DetailPanel: forwardRef<SVGSVGElement>((props, ref) => (
                                <svg {...props} ref={ref} style={{ display: 'none' }} />
                            ))
                        }}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        actions={[]}
                        onRowClick={(event, rowData, togglePanel) => {
                            if (togglePanel) {
                                togglePanel();
                            }
                        }}
                    />
                </div>

                {/* New live dashboard below the table */}
                <SavingsTypeDashboard data={savingsByType} />

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
