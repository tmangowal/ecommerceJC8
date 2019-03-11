import React from 'react'
import axios from 'axios'
import { urlApi } from './../support/urlApi'
import './../support/css/product.css'

class ProductList extends React.Component{
    state = {listProduct : []}

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
            return (
                <div className="card col-md-3 mr-5 mt-3" style={{width: '18rem'}}>
                    <img className="card-img-top img" height='200px' src={val.img} alt="Card" />
                    <div className='discount'>{val.discount}%</div>
                    <div className="card-body">
                    <h4 className="card-text">{val.nama}</h4>
                    <p className="card-text" style={{textDecoration:'line-through',color:'red',display:'inline'}}>Rp. {val.harga}</p>
                    <p style={{display:'inline' , marginLeft:'10px',fontWeight:'500'}}>Rp. {val.harga - (val.harga*(val.discount/100))}</p>
                    <input type='button' className='btn btn-primary' value='Add To Cart' />
                    </div>
                </div>
            )
        })

        return jsx
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

export default ProductList