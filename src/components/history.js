import React from 'react'
import {connect} from 'react-redux'
import {urlApi} from './../support/urlApi'
import cookie from 'universal-cookie'
import swal from 'sweetalert'
import Axios from 'axios'
import {Link} from 'react-router-dom'

const objCookie = new cookie()
class History extends React.Component{
    state = {history : [], userInfo : {}}

    componentDidMount = () => {
        this.getDataUser()
    }

    getDataUser =() => {
        var getCookie = objCookie.get('userData')
        Axios.get(urlApi + '/users?username=' + getCookie)
        .then((res) => {
            this.setState({userInfo : res.data[0]})
            console.log(this.state.userInfo.id)
            this.getDataHistory()
        } )
        .catch((err) => console.log(err))
    }

    getDataHistory = () => {
        Axios.get(urlApi + '/history?idUser=' + this.state.userInfo.id)
        .then((res) => {
            console.log(res)
            this.setState({history : res.data})
        })
        .catch((err) => console.log(err))
    }

    renderHistory = () => {
        var history = this.state.history.map((val) => {
            return (
                        <tr>
                            <td>
                                {val.tanggal}
                            </td>
                            <td>
                                {this.state.history.length}
                            </td>
                            <td>
                                {val.totalPrice}
                            </td>
                            <td>
                                <Link to={'/history-detail/' + val.id}>Click here to see details</Link>
                            </td>
                        </tr>
            )
        })
        return history
    }

    render(){
        return(
            <div className='container'>
                <table className="table col-md-8 col-12">
                    <thead>
                        <tr>
                            <th scope="col">Transaction History</th>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>Items</td>
                            <td>Total Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderHistory()}
                    </tbody>
                    <tfoot>
                    {
                        this.state.history.length < 1 ? 
                        <th><div className='alert alert-danger'><h3>Transaction History is empty</h3></div></th>
                        : null
                    }
                    </tfoot>
                </table>
            </div>
        )
    }
}

export default History