import React from 'react';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './LeftNavigation.css';

const LeftNavigation: React.FC<{ isOpen: boolean; toggleNav: () => void }> = ({ isOpen, toggleNav }) => {
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
            <div 
                className={`nav-overlay ${isOpen ? 'visible' : ''}`} 
                onClick={toggleNav}
            />
            <div className={`nav-container ${isOpen ? 'open' : ''}`}>
                <h2 className="nav-title">Menu</h2>
                <IonContent>
                    <IonList>
                        {pages.map((page) => (
                            <IonItem 
                                button 
                                key={page.name} 
                                onClick={() => handleNavClick(page.path)}
                                className="nav-item"
                            >
                                <IonLabel>{page.name}</IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </div>
        </>
    );
};

export default LeftNavigation;
