import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { menu } from 'ionicons/icons';

const Header: React.FC<{ toggleNav: () => void }> = ({ toggleNav }) => {
    return (
        <IonHeader>
            <IonToolbar style={{ backgroundColor: 'blue' }}>
                <IonButtons slot="start">
                    <IonButton onClick={toggleNav}>
                        <IonIcon icon={menu} />
                    </IonButton>
                </IonButtons>
                <IonTitle style={{ color: 'white', textAlign: 'center' }}>Menu</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
