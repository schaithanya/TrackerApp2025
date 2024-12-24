import React from 'react';
import Header from '../components/Header';
import { IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Savings: React.FC<{ toggleNav: () => void }> = ({ toggleNav }) => {
    const history = useHistory();

    return (
        <IonContent>
            <Header toggleNav={toggleNav} />
            <div>Savings Page</div>
        </IonContent>
    );
};

export default Savings;
