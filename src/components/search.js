import React from 'react'
import axios from 'axios'
import Header from './Navbar'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import { urlApi } from './../support/urlApi'
import './../support/css/product.css'


class Search extends React.Component{
    state = {listProduct : [], product : {}}

    componentDidMount(){
        this.getDataProduct()
    }
    getDataProduct = () => {
        axios.get(urlApi + '/products?q=' + this.props.keyWord)
        .then((res) => this.setState({listProduct : res.data}))
        .catch((err) => console.log(err))
    }
    renderProdukJsx = () => {
        var jsx = this.state.listProduct.map((val) => {
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
                    <Link to={'/product-detail/' + val.id}><input type='button' className='d-block btn btn-primary' value='Add To Cart' /></Link>
                    </div>
                </div>
            )
        })

        return jsx
    }
    render(){
        return(
            <div className='container'>
                <Header/>
                {/* <div style={{marginBottom:"75px"}}>
                    <Navbar color="light" light expand="md" fixed="top">
                        <NavbarBrand className="ml-2" ><Link to='/'> <img src="http://www.logospng.com/images/43/letter-f-bootstrap-logos-43177.png" alt="brand" width="30px" /> </Link> </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                <div className="input-group border-right" style={{width:"350px"}}>
                                    <input type="text" onKeyPress={this.handleKeyPress} ref="searchBook" className="form-control" placeholder="Masukkan kata kunci ... " />
                                    <div className="input-group-append mr-2">
                                        <button className="btn border-secondary" type="button" id="button-addon2"><i className="fas fa-search" /></button>
                                    </div>
                                </div> 
                                </NavItem>
                                
                                <NavItem>
                                    <Link to="/register"><NavLink className="btn btn-default border-secondary mr-1" style={{fontSize:"14px"}}><i className="fas fa-user-plus" /> Daftar</NavLink></Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/login"><NavLink className="btn btn-default border-primary" style={{fontSize:"14px"}}><i className="fas fa-sign-in-alt" /> Masuk </NavLink></Link>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div> */}
                <div className='row justify-content-center'>
                {this.renderProdukJsx()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        keyWord : state.user.search
    }
}

export default connect(mapStateToProps)(Search)