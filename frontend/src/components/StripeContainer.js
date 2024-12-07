import React from 'react'
const PUBLIC_KEY="kbekqjekqjnk"
const StripeTestPromise=loadStripe(PUBLIC_KEY)
import PaymentForm from './Stripe'
export default function App(){
    return(
        <Elements stripe={StripeTestPromise}>
            <PaymentForm/>
        </Elements>
    )
}