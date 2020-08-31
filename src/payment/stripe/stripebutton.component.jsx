import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { stripePayment } from "../../api/restaurants";
import { Button } from "@material-ui/core";

const StripeButton = ({ price, getOrder, afterOrder, label, isDisabled }) => {
  const publishableKey = "pk_live_1Pks961nEPNkTNdYFLCaKPlH00W3tEYVrm";
  const stripePrice = price * 100;

  const onToken = (token, smt) => {
    const order = getOrder();

    stripePayment({
        amount: stripePrice,
        token,
        currency: "USD",
        description: order.description,
        stripeEmail: token.email,
        order
      })
      .then((response) => {
        afterOrder();
        alert("payment success");
      })
      .catch((error) => {
        alert("Payment failed");
      });
  };

  if (isDisabled) {
    return (
      <Button variant="contained" fullWidth style={{borderRadius: 1000, color: 'white', height: 50}} disabled={true}>{label}</Button>
    );
  }

  return (
    <StripeCheckout
      amount={stripePrice}
      label={label}
      name="UzChef"
      image="https://svgshare.com/i/CUz.svg"
      description={`Your total is ${price}`}
      panelLabel="Pay Now"
      token={onToken}
      stripeKey={publishableKey}
      currency="USD"
    >
      <Button variant="contained" fullWidth style={{borderRadius: 1000, color: 'white', height: 50}}>{label}</Button>
    </StripeCheckout>
  );
};

export default StripeButton;
