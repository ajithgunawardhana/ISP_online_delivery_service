import React, {useState} from 'react'
import axios from 'axios'
import './addpaymentdetails.css'

const initialState = {
    userid: '',
    address: '',
    phonenumber: '',
    cardnumber: ''
}

export default function AddPaymentDetails() {
    const [user, setUser] = useState(initialState);

    const onChangeInput = e => {
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const detailsSubmit = async e => {
        e.preventDefault()
        try {
            await axios.post('/api/payment', {...user});
            alert("Payment details added.!")
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className='fullPagePayment'>
            <form onSubmit={detailsSubmit}>
                <input
                    type="text"
                    name='userid'
                    required
                    value={user.userid}
                    onChange={onChangeInput}
                    className='inputText'
                    placeholder='UserId'
                /><br />

                <input
                    type="text"
                    name='address'
                    required
                    value={user.address}
                    onChange={onChangeInput}
                    className='inputText'
                    placeholder='Address'
                /> <br />
                <input
                    type="text"
                    name='phonenumber'
                    required
                    value={user.phonenumber}
                    onChange={onChangeInput}
                    className='inputText'
                    placeholder='phonenumber'
                /> <br />
                <input
                    type="text"
                    name='cardnumber'
                    required
                    value={user.cardnumber}
                    onChange={onChangeInput}
                    className='inputText'
                    placeholder='Credit Card Number'
                /> <br />
               
                <button type='submit' className='loginFormButton'>Add Payment Details</button>
            </form>
        </div>
    )
}