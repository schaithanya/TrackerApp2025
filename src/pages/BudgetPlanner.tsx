import React from 'react';
import Header from '../components/Header';
import { IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const BudgetPlanner: React.FC<{ toggleNav: () => void }> = ({ toggleNav }) => {
    const history = useHistory();

    return (
        <IonContent>
            <Header toggleNav={toggleNav} />
            <div>Budget Planner Page</div>
        </IonContent>
    );
};

export default BudgetPlanner;
