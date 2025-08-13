import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import LeftNavigation from './components/LeftNavigation'; // Import the LeftNavigation component
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import SavingsDashboard from './pages/SavingsDashboard';
import SavingsCreate from './pages/SavingsCreate';
import Documents from './pages/Documents';
import Passphrase from './pages/Passphrase';
import Expense from './pages/Expense';
import MyStory from './pages/MyStory';
import Scheduler from './pages/Scheduler';
import BudgetPlanner from './pages/BudgetPlanner';
import GoalTracker from './pages/GoalTracker';

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
                <IonRouterOutlet>
                    <Route exact path="/savings">
                        <SavingsDashboard 
                            toggleNav={toggleNav} 
                            onCreateNew={() => {
                                window.location.pathname = '/savings/create';
                            }}
                        />
                    </Route>
                    <Route exact path="/savings/create">
                        <SavingsCreate onCancel={() => window.history.back()} />
                    </Route>
                    <Route exact path="/documents">
                        <Documents toggleNav={toggleNav} />
                    </Route>
                    <Route exact path="/passphrase">
                        <Passphrase toggleNav={toggleNav} />
                    </Route>
                    <Route exact path="/expense">
                        <Expense toggleNav={toggleNav} />
                    </Route>
                    <Route exact path="/mystory">
                        <MyStory toggleNav={toggleNav} />
                    </Route>
                    <Route exact path="/scheduler">
                        <Scheduler toggleNav={toggleNav} />
                    </Route>
                    <Route exact path="/budget-planner">
                        <BudgetPlanner toggleNav={toggleNav} />
                    </Route>
                    <Route exact path="/goals">
                        <GoalTracker toggleNav={toggleNav} />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/savings" />
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;