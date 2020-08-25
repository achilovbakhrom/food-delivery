import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { stripePayment } from "../../api/restaurants";
import { Button } from "@material-ui/core";

const StripeButton = ({ price, getOrder, afterOrder, label, isDisabled }) => {
  const publishableKey = "pk_test_51GvHjAEuBsy49TLwUXKCDWLnnRwfIsiIdXiUr0wZJGc8QO36bNVpivNvgqhNwMyQBow6Jq44rcDE3YLAbGVCk8Fh005KUDe0VA";
  const stripePrice = price * 100;

  console.log("isDisabled", isDisabled)

  const onToken = (token, smt) => {
    console.log("onToken", token, smt);
    const order = getOrder();

    console.log("order", JSON.stringify({
      amount: stripePrice,
      token,
      currency: "USD",
      description: order.description,
      stripeEmail: token.email,
      order
    }));

    stripePayment({
        amount: stripePrice,
        token,
        currency: "USD",
        description: order.description,
        stripeEmail: token.email,
        order
      })
      .then((response) => {
        console.log(response);
        afterOrder();
        alert("payment success");
      })
      .catch((error) => {
        console.log(error);
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
