import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import LeftNavigation from './components/LeftNavigation'; // Import the LeftNavigation component
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Savings from './pages/Savings';
import Documents from './pages/Documents';
import Passphrase from './pages/Passphrase';
import Expense from './pages/Expense';
import MyStory from './pages/MyStory';
import Scheduler from './pages/Scheduler';
import BudgetPlanner from './pages/BudgetPlanner';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Header from './components/Header';

setupIonicReact();

const App: React.FC = () => {
    const [isNavOpen, setIsNavOpen] = useState(false); // State to manage navigation visibility

    const toggleNav = () => {
        console.log("Toggle function called. Current state:", isNavOpen); // Debugging line
        setIsNavOpen(!isNavOpen); // Update state once
        console.log("New state after toggle:", !isNavOpen); // Log new state
    };

    return (
        <IonApp>
            <IonReactRouter>
                <LeftNavigation isOpen={isNavOpen} toggleNav={toggleNav} />
                <Header toggleNav={toggleNav} /> {/* Pass the toggle function to the Header */}
                <IonRouterOutlet>
                    <Route exact path="/savings" component={Savings} />
                    <Route exact path="/documents" component={Documents} />
                    <Route exact path="/passphrase" component={Passphrase} />
                    <Route exact path="/expense" component={Expense} />
                    <Route exact path="/mystory" component={MyStory} />
                    <Route exact path="/scheduler" component={Scheduler} />
                    <Route exact path="/budget-planner" component={BudgetPlanner} />
                    <Route exact path="/">
                        <Redirect to="/savings" />
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
