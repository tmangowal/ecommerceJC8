import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { urlApi } from './../support/urlApi'
import {qtyCount} from './../1.actions'
import {connect} from 'react-redux'
import Axios from 'axios'
import swal from 'sweetalert'
import './../support/css/product.css'

class ProductList extends React.Component{
    state = {listProduct : [], product : {}, userInfo : {}, cart : []}

    componentDidMount(){
        this.getDataProduct()
    }
    getDataProduct = () => {
        axios.get(urlApi + '/products')
        .then((res) => this.setState({listProduct : res.data}))
        .catch((err) => console.log(err))
    }
    renderProdukJsx = () => {
        var jsx = this.state.listProduct.map((val) => {
            // if(val.nama.toLowerCase().includes(this.props.search.toLowerCase())){
                return (
                    <div className="card col-md-3 mr-5 mt-3" style={{width: '18rem'}}>
                        <Link to={'/product-detail/' + val.id}><img className="card-img-top img" height='200px' src={val.img} alt="Card" /></Link>
                        {/* Pake if ternary (karena melakukan pengkondisian di dalam return) */}
                        {
                            val.discount > 0 ? 
                            <div className='discount'>{val.discount}%</div>
                            : null
                        }
                        <div className="card-body">
                        <h4 className="card-text">{val.nama}</h4>
                        {
                            val.discount > 0 ?
                            <p className="card-text" style={{textDecoration:'line-through',color:'red',display:'inline'}}>Rp. {val.harga}</p>
                            : null
                        }
                        <p style={{display:'inline' , marginLeft:'10px',fontWeight:'500'}}>Rp. {val.harga - (val.harga*(val.discount/100))}</p>
                        <input onClick={()=>{this.addToCart(val)}} type='button' className='d-block btn btn-primary' value='Add To Cart' />
                        </div>
                    </div>
                )
            // }
        })

        return jsx
    }
    addToCart = (val) => {
        if(this.props.username !== ''){
            var newItem = val
            newItem.qty = 1
            newItem.belongs = this.props.username
    
                // var newCart = [...this.state.cart, newItem]
                // Get Data User supaya re-render hehe
                Axios.get(urlApi + '/users/' + this.props.userID)
                .then((res) => {
                    this.setState({userInfo : res.data})
                })
                .catch((err) => console.log(err))
    
                Axios.get(urlApi + '/cart/?belongs=' + this.props.username + '&nama=' + val.nama)
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
                        Axios.post(urlApi + '/cart', newItem)
                        .then((res) => {
                            this.getDataApi()
                            swal('Add to cart', 'Item Added!', 'success')
                        })
                        .catch((err) => console.log(err))
                    }
                })
                .catch((err) => console.log(err))

    
        }else {
            swal('Add to cart', 'Please Login First', 'error')
        }
    }

    getDataApi = () => {
        Axios.get(urlApi + '/cart?belongs=' + this.props.username)
        .then((res) => {
            this.setState({cart : res.data})
            this.totalQty()
            this.getDataProduct()
        } )
        .catch((err) => console.log(err))
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
        return(
            <div className='container'>
                <div className='row justify-content-center'>
                {this.renderProdukJsx()}
                </div>
            </div>
        )
    }
}

const mapStateToProps =(state) => {
    return {
        username : state.user.username,
        userID : state.user.id
    }
}

export default connect(mapStateToProps, {qtyCount})(ProductList)