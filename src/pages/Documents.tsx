import React from 'react';
import Header from '../components/Header';
import { IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Documents: React.FC<{ toggleNav: () => void }> = ({ toggleNav }) => {
    const history = useHistory();

    console.log('Documents component is rendering');
    return (
        <IonContent style={{ position: 'relative', zIndex: 1 }}>
            <Header toggleNav={toggleNav} />
            <div style={{ padding: '20px' }}>Documents Page</div>
        </IonContent>
    );
};

export default Documents;
