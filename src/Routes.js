import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import firebase, { firestore } from './firebase'
import Dashboard from './Components/Dashboard'
import AddPost from './Components/Add Post'
import AddAdmin from './Components/Add Admin'
import Draft from './Components/Draft'
import editPost from './Components/Edit Post'
import AdminNavBar from './Components/AdminNavBar'
import Home from './Components/Home'
import SignInScreen from './Components/Sign In'
import ArticleView from './Components/ArticleView'
import Profile from './Components/Profile'
import Search from './Components/Search'
import AddCategory from './Components/AddCategory'
import Register from './Components/Register'
import AboutUs from './Components/AboutUs'
import Footer from './Components/Footer'
import Author from './Components/Author'
import Dashboard1 from './Components/Dashboard1'

class Routes extends Component {
    constructor(props) {
        super(props)

        this.state = {
            admin: false,
            super: false,
            Emailverified: false
        }
    }


    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            firestore.collection('LocalAdmins').doc(user.email).get().then(info => {
                if (info.exists){this.setState({
                    admin: info.data().ApprovalStatus ? info.data().ApprovalStatus : false,
                })}
            })
            firestore.collection('Super').doc(user.email).get().then(info => {
                if (info.exists){this.setState({
                    super: info.data().SuperAdmin ? info.data().SuperAdmin : false
                })}
            })
            this.setState({
                admin: this.state.super,
                Emailverified: user.emailVerified
            })
        })
    }
    render() {
        return (
            <div>
                {
                    this.state.admin || this.state.super ?
                        <div>
                            <Route path='/admin' component={AdminNavBar} />
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path="/signin" exact component={SignInScreen} />
                                <Route path="/articleview/:id" exact component={ArticleView} />
                                <Route path="/profile" exact component={Profile} />
                                <Route path="/about" exact component={AboutUs} />
                                <Route path="/author/:email" exact component={Author} />
                                <Route path="/search" exact component={Search} />
                                {this.state.super ? <Route path="/admin/dashboard/:aemail" exact component={Dashboard1} /> : <Route path="/admin" exact component={Dashboard} />}
                                <Route path='/admin/addpost' exact component={AddPost} />
                                <Route path='/admin/draft' exact component={Draft} />
                                <Route path='/admin/edit/:id' exact component={editPost} />
                                {this.state.super ? <Route path='/admin/addcategory' exact component={AddCategory} /> : <div />}
                                {this.state.super ? <Route path='/admin/addadmin' exact component={AddAdmin} /> : <div />}
                            </Switch>
                        </div>
                        :
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route path="/signin" exact component={SignInScreen} />
                            <Route path="/articleview/:id" exact component={ArticleView} />
                            <Route path="/profile" exact component={Profile} />
                            <Route path="/about" exact component={AboutUs} />
                            <Route path="/author/:email" exact component={Author} />
                            <Route path="/search" exact component={Search} />
                            <Route path="/register" exact component={Register} />
                            <Route path='*' component={Home}/>
                        </Switch>
                }
                <Route path='/' component={Footer} />
            </div>
        )
    }
}

export default Routes
