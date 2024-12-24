import React from 'react';
import Header from '../components/Header';
import { IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Expense: React.FC<{ toggleNav: () => void }> = ({ toggleNav }) => {
    const history = useHistory();

    return (
        <IonContent>
            <Header toggleNav={toggleNav} />
            <div>Expense Page</div>
        </IonContent>
    );
};

export default Expense;
