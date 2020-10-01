import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from '../Home'
import SignInScreen from '../Sign In'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ArticleView from '../ArticleView'
import Profile from '../Profile'
import Admin from '../Admin'


export default function App() {

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/signin" exact component={SignInScreen} />
                    <Route path="/articleview/:id" exact component={ArticleView} />
                    <Route path="/profile" exact component={Profile} />
                    <Route path="/admin" exact component={Admin} />
                </Switch>
            </div>
        </Router>
    )

}