import React from 'react';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const LeftNavigation: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const history = useHistory();

    const pages = [
        { name: 'Savings', path: '/savings' },
        { name: 'Documents', path: '/documents' },
        { name: 'Passphrase', path: '/passphrase' },
        { name: 'Expense', path: '/expense' },
        { name: 'MyStory', path: '/mystory' },
        { name: 'Scheduler', path: '/scheduler' },
        { name: 'Budget Planner', path: '/budget-planner' },
    ];

    const handleNavClick = (path: string) => {
        history.push(path);
    };

    return (
        <>
            <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Menu</h2>
            {isOpen && (
                <IonContent>
                    <IonList>
                        {pages.map((page) => (
                            <IonItem button key={page.name} onClick={() => handleNavClick(page.path)}>
                                <IonLabel>{page.name}</IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            )}
        </>
    );
};

export default LeftNavigation;
