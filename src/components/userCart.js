import React from 'react'
import Axios from 'axios'
import PageNotFound from './pageNotFound'
import {urlApi} from './../support/urlApi'
import { connect } from 'react-redux'
import {qtyCount} from '../1.actions'
import cookie from 'universal-cookie'
import { Button , Icon} from 'semantic-ui-react'
import swal from 'sweetalert'


const objCookie = new cookie()
class Cart extends React.Component{
    state = {cart : [], userInfo : '', undo : false, deletedProduct : {}, checkout : false}

    componentDidMount = () =>{
        this.getDataApi()
    }

    getDataApi =() => {
        var getCookie = objCookie.get('userData')
        Axios.get(urlApi + '/cart?belongs=' + getCookie)
        .then((res) => {
            this.setState({cart : res.data, userInfo : getCookie})
            this.totalQty()
        } )
        .catch((err) => console.log(err))
    }

    onBtnDelete = (idx) => {
        var delProductId = this.state.cart[idx].id
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this product!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                Axios.delete(urlApi + '/cart/' + delProductId)
                .then((res) => this.getDataApi())
                .catch((err) => console.log(err))
                swal("Poof! Your product has been deleted!", {
                    icon: "error",
                });
            } else {
              swal("Your product is safe!");
            }
          });
        
    }

    totalQty = () => {
        var totalQty = 0
        for(var i = 0; i < this.state.cart.length; i++){
            totalQty += this.state.cart[i].qty
        }
        this.props.qtyCount(totalQty)
    }

    renderCart = () => {

        var cart = this.state.cart.map((val, idx) => {
            return(
                <tr>
                    <td>
                    <Button animated color='red' onClick={()=> this.onBtnDelete(idx)}>
                        <Button.Content visible>Delete</Button.Content>
                        <Button.Content hidden>
                            <Icon name='delete'/>
                        </Button.Content>
                    </Button>
                    <Button animated color='blue'>
                        <Button.Content visible>Add to Wishlist</Button.Content>
                        <Button.Content hidden>
                            <Icon name='heart'/>
                        </Button.Content>
                    </Button>
                    </td>
                    <td>
                        <img style={{width:'80px'}} alt={val.nama} src={val.img}/>
                    </td>
                    <td>
                        {val.nama}
                    </td>
                    <td>
                        <Button.Group>
                            <Button onClick={()=>{this.onBtnAddMin(idx, 'min')}}>-</Button>
                            <Button.Or text={val.qty} />
                            <Button positive onClick={()=>{this.onBtnAddMin(idx, 'add')}}>+</Button>
                        </Button.Group>
                    </td>
                    <td>
                        {(val.harga - (val.harga * val.discount / 100)) * val.qty}
                    </td>
                </tr>
            )
        })
        return cart
    }

    renderCheckout = () => {
        return (
            <form>
                <div className='form-row'>
                    <div className='col-md-6 col-12'>
                        <input type='text' placeholder='First Name'/>
                    </div>
                    <div className='col-md-6 col-12'>
                        <input type='text' placeholder='Last Name'/>
                    </div>
                </div>
            </form>
        )
    }

    onBtnAddMin = (idx, action) => {
        if(action === 'min'){
            var newQty = [...this.state.cart]
            console.log(newQty)
            newQty[idx].qty = newQty[idx].qty - 1
            this.setState({cart : newQty})
            Axios.put(urlApi + '/cart/' + newQty[idx].id, newQty[idx])
            .then((res) => this.totalQty())
            .catch((err) => console.log(err))
        }else if(action === 'add'){
            var newQty = [...this.state.cart]
            console.log(newQty)
            newQty[idx].qty = newQty[idx].qty + 1
            this.setState({cart : newQty})
            Axios.put(urlApi + '/cart/' + newQty[idx].id, newQty[idx])
            .then((res) => this.totalQty())
            .catch((err) => console.log(err))
        }
        
    }

    renderTotalPrice = () => {
        var totalPrice = 0
        this.state.cart.map((val) => {
            totalPrice += (val.harga - (val.harga * val.discount / 100)) * val.qty
        })
        return totalPrice
    }

    onBtnCheckout = () => {
        this.setState({checkout : true})
    }

    onBtnPay = () => {
        var totalPrice = this.renderTotalPrice()
        var inputPay = this.refs.pay.value
        if(inputPay < totalPrice){
            swal("Payment", "Payment failed, not enough money", 'error')
        }else if(inputPay > totalPrice){
            swal('Payment', "Payment successful, your total change is: Rp." + (inputPay - totalPrice), 'success')
            this.onPayMoveToHistory()
        }else{
            swal('Payment', "Payment successful", 'success')
            this.onPayMoveToHistory()
        }
    }

    onPayMoveToHistory = () => {
        var date = new Date()
        var today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
        var getCookie = objCookie.get('userData')
        var totalPrice = this.renderTotalPrice()
        var historyItem = {
            idUser : this.props.userID,
            tanggal : today,
            item : this.state.cart,
            totalPrice : totalPrice
        }
        Axios.post(urlApi + "/history", historyItem)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        for(var i = 0; i < this.state.cart.length; i++){  
            Axios.delete(urlApi + "/cart/" + this.state.cart[i].id)
            .then((res) =>{
                this.setState({cart : [], userInfo : getCookie, checkout: false})
                this.getDataApi()
                console.log(res)
            } )
            .catch((err) => console.log(err))
        }
    }

    render(){
        if(this.props.username !== ''){
            return(
                <div className="container">
                    <div className="row">
                        <table className="table col-md-8 col-12">
                            <thead>
                                <tr>
                                    <th scope="col">Shopping Cart</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderCart()}
                            </tbody>
                            <tfoot>
                                {this.state.cart.length > 0 ?  
                                <tr>
                                    <th scope="col">Total Price = Rp. {this.renderTotalPrice()}</th>
                                    <td>
                                        <Button onClick={this.onBtnCheckout} animated color='green'>
                                            <Button.Content visible>Checkout</Button.Content>
                                            <Button.Content hidden>
                                                <Icon name='cart'/>
                                            </Button.Content>
                                        </Button>
                                    </td>
                                </tr>
                                :
                                <tr>
                                    <th scope='col'><div className='alert alert-danger'>Shopping Cart is Empty</div></th>
                                </tr>
                                }
                                {/* <tr>
                                    <th scope="col">Total Price = Rp. {this.renderTotalPrice()}</th>
                                </tr> */}
                            </tfoot>
                        </table>
                    </div>
                    {
                    this.state.checkout == true ?
                    <div className="row">
                        <form>
                            <h3>Customer Information</h3>
                            <div className="form-row">
                                <div className="col-md-6 col-12">
                                    <input ref='first-name' type="text" className="form-control" placeholder="First name" />
                                </div>
                                <div className="col-md-6 col-12">
                                    <input ref='last-name' type="text" className="form-control" placeholder="Last name" />
                                </div>
                            </div>
                            <br/>
                            <div classname="form-row">
                                <div classname='form-group col'>
                                    <input ref="address" type='text' className="form-control" placeholder="Address"/>
                                </div>
                            </div>
                            <br/>
                            <div classname="form-row">
                                <div classname='form-group col'>
                                    <input ref='city' type='text' className="form-control" placeholder="City"/>
                                </div>
                            </div>
                            <br/>
                            <div>
                                <input type='button' onClick={this.onBtnPay} className='btn btn-block btn-success' value='Pay' />
                                <input type='number' ref='pay' className='form-control col mt-2'/>
                            </div>
                        </form>
                    </div> : null
                    }
                </div>
            )
        }
        return <PageNotFound/>
    }
}

const mapStateToProps = (state) => {
    return {
        username : state.user.username,
        userID : state.user.id
    }
}


export default connect(mapStateToProps, {qtyCount})(Cart)