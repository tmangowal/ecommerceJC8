import React from 'react'
import Axios from 'axios'
import {connect} from 'react-redux'
import { urlApi } from '../support/urlApi';
import PageNotFound from './pageNotFound';

class HistoryDetail extends React.Component{
    state = {history : {}, items : []}

    componentDidMount = () => {
        this.getDataApi()
    }

    getDataApi = () => {
        var idUrl = this.props.match.params.id
        Axios.get(urlApi + '/history/' + idUrl)
        .then((res) => {
            console.log(res.data.item)
            this.setState({history : res.data, items : res.data.item})
        })
        .catch((err) => console.log(err))
    }

    renderItems = () => {
        var history = this.state.items.map((val) => {
            return (
                <tr>
                    <td>
                        <img style={{width:'80px'}} alt={val.nama} src={val.img}/>
                    </td>
                    <td>
                        {val.nama}
                    </td>
                    <td>
                        {val.harga}
                    </td>
                    <td>
                        {
                            val.discount > 0 ? val.discount + "%" : "n/a"
                        }
                    </td>
                    <td>
                        {val.qty}
                    </td>
                    <td>
                        {(val.harga - (val.harga * val.discount / 100)) * val.qty}
                    </td>
                </tr>
            )
        })
        return history
    }

    render(){
        if(this.props.username !== ''){
            return(
                <div className='container'>
                    <table className="table col-md-8 col-12">
                                <thead>
                                    <tr>
                                        <th scope="col">Transaction History Details ({this.state.history.tanggal})</th>
                                    </tr>
                                    <tr>
                                        <td>Image</td>
                                        <td>Item Name</td>
                                        <td>Price /pcs</td>
                                        <td>Discount</td>
                                        <td>Quantity</td>
                                        <td>Price</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderItems()}
                                </tbody>
                                <tfoot>
                                    <th>Total Price = Rp. {this.state.history.totalPrice}</th>
                                </tfoot>
                    </table>
                </div>
            )
        }
        return <PageNotFound/>
    }
}

const mapStateToProps =(state) => {
    return {
        username : state.user.username
    }
}

export default connect(mapStateToProps)(HistoryDetail)