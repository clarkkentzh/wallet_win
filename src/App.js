import React from 'react';
import {
  Route,
  Switch,
  withRouter,
  HashRouter
} from 'react-router-dom';
import './App.css';
import CreateScreen from './container/CreateAccount/CreateScreen'

const App = withRouter((props)=> {
    return (
        <div className="App">
            <HashRouter>
                <Switch>
                    <Route path='/' exact component={CreateScreen}/>
                </Switch>
            </HashRouter>
        </div>
    );
})

export default App;
