import './App.css';
import {Switch, Route} from 'react-router-dom'
import AuthForm from './Components/Auth/AuthForm'
import Timer from './Components/timer/timer'
import Home from './Components/Home/Home'

import {withRouter} from 'react-router-dom'


function App(props) {
  
  return (
    <div className="main-container">
      
      <Switch>
      <Route path="/account/timer" component={Timer}></Route>
      <Route path="/account" component={AuthForm}></Route>
      <Route path="/" component={Home}></Route>
    </Switch>
    
    </div>
  );
}

export default withRouter(App);
