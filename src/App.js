import React from 'react';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import './App.css';
import CreateScreen from './container/CreateAccount/CreateScreen'

const App = withRouter((props)=> {
    return (
        <div className="App">
            <Switch>
                <Route path='/' exact component={CreateScreen}/>
            </Switch>
        </div>
    );
})

export default App;
