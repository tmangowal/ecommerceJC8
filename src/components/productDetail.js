import React from 'react'
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import {connect} from 'react-redux'
import swal from 'sweetalert'
import {qtyCount} from './../1.actions'
import cookie from 'universal-cookie'

const objCookie = new cookie()
class ProductDetail extends React.Component{
    state = {product : {}, cart : [], userInfo : {}}

    componentDidMount(){
        this.getDataApi()
    }
    getDataApi = () => {
        var idUrl = this.props.match.params.id
        Axios.get(urlApi + '/products/' + idUrl)
        .then((res) => {
            this.setState({product: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
        var getCookie = objCookie.get('userData')
        Axios.get(urlApi + '/cart?belongs=' + getCookie)
        .then((res) => {
            this.setState({cart : res.data, userInfo : getCookie})
            this.totalQty()
        } )
        .catch((err) => console.log(err))
    }
    qtyInputProt = () => {
        var input = this.refs.qty
        if(input.value < 1){
            input.value = 1
        }
        if(input.value === 0){
            input.value = 1   
        }
    }
    addToCart = () => {
        var newItem = this.state.product
        newItem.qty = parseInt(this.refs.qty.value)
        newItem.belongs = this.props.username

        if(this.refs.qty.value !== ''){
            // Get Data User
            Axios.get(urlApi + '/users/' + this.props.userID)
            .then((res) => {
                this.setState({userInfo : res.data})
            })
            .catch((err) => console.log(err))

            // var newCart = [...this.state.cart, newItem]

            Axios.get(urlApi + '/cart/?belongs=' + this.props.username + '&nama=' + this.state.product.nama)
            .then((res) => {
                if(res.data.length > 0){
                    newItem.qty = res.data[0].qty + newItem.qty
                    newItem.id = res.data[0].id
                    
                    Axios.put(urlApi + '/cart/' + newItem.id, newItem)
                    .then((res) => {
                        this.getDataApi()
                        swal('Add to cart', 'Item Added!', 'success')
                    })
                    .catch((err) => console.log(err))
                }else{
                    newItem.id = this.idGenerator()
                    newItem.deleted = false
                    alert(newItem.qty)
                    Axios.post(urlApi + '/cart', newItem)
                    .then((res) => {
                        this.getDataApi()
                        swal('Add to cart', 'Item Added!', 'success')
                    })
                    .catch((err) => console.log(err))
                }
            })
            .catch((err) => console.log(err))
        }else{
            swal('Add to cart', 'Please specify the quantity', 'error')
        }
    }
    
    totalQty = () => {
        // var totalQty = 0
        // for(var i = 0; i < this.state.cart.length; i++){
        //     totalQty += this.state.cart[i].qty
        // }
        this.props.qtyCount(this.state.cart.length)
    }

    idGenerator = () => {
        var d = new Date()
        return d.getTime()
    }

    render(){
        var {nama, harga, discount, deskripsi, img} = this.state.product
        return(
            <div className='container'>
                <div className="row">
                    <div className='col-md-4'>
                        <div className="card" style={{width: '100%'}}>
                            <img className="card-img-top" src={img} alt="Card cap" />
                            <div className="card-body">
                            </div>
                        </div>
                    </div>

                    <div className='col-md-8'>
                        <h1 style={{color:'#4c4c4c'}}>{nama}</h1>
                        <div style={{backgroundColor:'#D50000', 
                                    width:"50px",
                                    height:'22px',
                                    color:'white',
                                    textAlign:'center',
                                    display: 'inline-block'}}>
                            {discount}%
                        </div>
                        <span style={{fontSize:'12px', 
                                    fontWeight:'600',
                                    color:"#606060", 
                                    marginLeft:'10px',
                                    textDecoration: 'line-through'}}>Rp. {harga} </span>

                        <div style={{fontSize:'24px',
                                    fontWeight:'700',
                                    color:'#FF5722',
                                    marginTop:'20px'}}>Rp. {harga - (harga * (discount/100))}</div>

                        <div className='row'>
                            <div className='col-md-2'>
                                <div style={{marginTop:'15px', fontSize:'16px', fontWeight:'700', color:'#606060'}}>Jumlah</div>
                                <input ref="qty" onChange={this.qtyInputProt} type="number" min={0} className="form-control" style={{width:'60px', marginTop:'10px'}}/>
                            </div>
                            <div className='col-md-6'>
                                <div style={{marginTop:'15px', fontSize:'16px', fontWeight:'700', color:'#606060'}}>Catatan Untuk Penjual (Opsional)</div>
                                <input type='text' style={{marginTop:'12px'}} placeholder="Contoh: Warna Putih, Ukuran XL" className='form-control'/>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-md-8'>
                                <p style={{color:'#606060', fontStyle:"italic"}}>{deskripsi}
                                </p>
                            </div>
                        </div>
                        
                        {this.props.username === '' ?
                        <div className='row mt-4'>
                            <input disabled type="button"   className='btn border-secondary col-md-2' value="Add To Wishlist"/>
                            <input disabled type="button"  className='btn btn-primary col-md-3' value="Beli Sekarang"/>
                            <input disabled type="button"   className='btn btn-success col-md-3' value="Tambah ke Keranjang"/>
                        </div>
                            :
                        <div className='row mt-4'>
                            <input type="button"  className='btn border-secondary col-md-2' value="Add To Wishlist"/>
                            <input  type="button" className='btn btn-primary col-md-3' value="Beli Sekarang"/>
                            <input  type="button" onClick={this.addToCart} className='btn btn-success col-md-3' value="Tambah ke Keranjang"/>
                        </div>
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        username : state.user.username,
        userID : state.user.id
    }
}

export default connect(mapStateToProps, {qtyCount})(ProductDetail)