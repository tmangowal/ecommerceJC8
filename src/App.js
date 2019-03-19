import React, { Component } from 'react';
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Product from './components/productList'
import ManageProduct from './components/admin/manageProduct'
import PageNotFound from './components/pageNotFound'
import ProductDetail from './components/productDetail'
import ScrollToTop from './components/scrollToTop'
import Cart from './components/userCart'
import ProductList from './components/search'
import History from './components/history'
import HistoryDetail from './components/historyDetail'
import { Route ,withRouter, Switch } from 'react-router-dom' 
import {connect} from 'react-redux'
import cookie from 'universal-cookie'
import { keepLogin, cookieCheck, qtyCount } from './1.actions'
import Axios from 'axios'
import {urlApi} from './support/urlApi'
import './App.css';
// 
// withRouter => Untuk tersambung ke Reducer dengan connect, 
// tapi di dalam komponen ada routing

const objCookie = new cookie()
class App extends Component {
  state = {cart : []}
  componentDidMount(){
    var terserah = objCookie.get('userData')
    console.log(terserah)
    if(terserah !== undefined && terserah !== '' && terserah !== 'undefined'){
      console.log(terserah)
      this.props.keepLogin(terserah)
      this.getDataApi()
    }else{
      console.log('masuk cookie check')
      this.props.cookieCheck()
    }
  }
  getDataApi =() => {
    var getCookie = objCookie.get('userData')
    if(getCookie !== undefined){
      Axios.get(urlApi + '/cart?belongs=' + getCookie)
      .then((res) => {
          this.setState({cart : res.data})
          this.totalQty()
      } )
      .catch((err) => console.log(err))
    }
  }
  totalQty = () => {
    var totalQty = 0
    for(var i = 0; i < this.state.cart.length; i++){
        totalQty += this.state.cart[i].qty
    }
    this.props.qtyCount(totalQty)
  }
  componentWillReceiveProps(newProps){
    console.log(newProps)
    if(newProps.username !== undefined || newProps.username !== '' || newProps.username !== 'undefined'){
      objCookie.set('userData',newProps.username,{path :'/'})
      this.getDataApi()
    }
  }
  render() {
    if(this.props.globalCookie){
      return (
        <div>
            <Navbar/>
            <ScrollToTop>
              <Switch>
                <Route path='/' component={Home} exact/>
                <Route path='/login' component={Login} exact/>
                <Route path='/register' component={Register} exact/>
                <Route path='/product' component={Product} exact/>
                <Route path='/manage' component={ManageProduct} exact/>
                <Route path='/cart' component={Cart} exact/>
                <Route path='/search' component={ProductList} exact/>
                <Route path='/product-detail/:id' component={ProductDetail} exact/>
                <Route path='/history-detail/:id' component={HistoryDetail} exact/>
                <Route path='/history' component={History} exact/>
                <Route path='*' component={PageNotFound}/>
              </Switch>
            </ScrollToTop>
        </div>
      );
    }
    return <div>Loading </div>
  }
}

const mapStateToProps = (state) => {
  return {
    username : state.user.username,
    globalCookie : state.user.cookie
  }
}

export default withRouter(connect(mapStateToProps , {keepLogin, cookieCheck, qtyCount})(App));
