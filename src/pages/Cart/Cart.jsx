import React, { useContext, useEffect, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/storeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { assetsUser } from '../../assets/assetsUser';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url, token, shopId, deleteFromCart, logout } = useContext(StoreContext);
  const navigate = useNavigate();
  const [shopDetails, setShopDetails] = useState(null);

  // Fetch shop details when the component mounts
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        if (shopId) {
          const response = await axios.get(`${url}/api/shops/${shopId}`);  // Adjust URL as needed
          if (response.data.success) {
            setShopDetails(response.data.data.shop);  // Store shop details
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          if (error.response.data.message === 'Token expired') {
            logout();
          }
        }
        console.log("fetchshopDetails function in cart.jsx: ", error);
      }
    };

    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId]);

  const isEligibleForCheckout = getTotalCartAmount() >= 60;

  const handlePromoCode = () => {
    toast.error("Invalid Code");
  };

  const handleCheckout = () => {
    if (!token) {
      toast.error("Please log in to proceed to checkout.");
      return;
    }

    if (!isEligibleForCheckout) {
      toast.error("Minimum purchase of ₹60 is required to checkout.");
      return;
    }

    navigate('/order');
  };

  const getDisplayQuantity = (quantity, baseUnit) => {
    if (baseUnit === "grams") {
      const kg = Math.floor(quantity / 1000);
      const g = quantity % 1000;
      return kg > 0 ? `${kg} kg ${g > 0 ? g + " g" : ""}` : `${g} g`;
    } else if (baseUnit === "Kg") {
      return `${quantity} kg`;
    } else if (baseUnit === "ml") {
      const liters = Math.floor(quantity / 1000);
      const ml = quantity % 1000;
      return liters > 0 ? `${liters} l ${ml > 0 ? ml + " ml" : ""}` : `${ml} ml`;
    } else if (baseUnit === "Liter") {
      return `${quantity} l`;
    } else {
      return `${quantity} ${baseUnit}`;
    }
  };

  

  // Check if there are any items in the cart for this shop
  const hasItemsInCart = Object.keys(cartItems[shopId] || {}).some(itemId => cartItems[shopId][itemId] > 0);

  return (
    <div className="cart-container">
      <div className="cart">
        {shopDetails && hasItemsInCart && (
          <div className="cart-shop-name">
            <h2>{shopDetails.name}</h2>
          </div>
        )}

        {!hasItemsInCart ? (
          <div className="empty-cart-container">
            <img
              src={assetsUser.empty_cart}
              alt="Empty Cart"
              className="empty-cart-image"
            />
            <p className="empty-cart-message">Your cart is empty. Please add some delicious items!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <div className="cart-items-title">
                <p>Item</p>
                <p>Name</p>
                <p>Price</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quantity</p>
                <p>Total</p>
                <p></p>
              </div>
              {food_list.map((item, index) => {
                const itemQuantity = cartItems[shopId]?.[item._id] || 0;

                if (itemQuantity > 0) {
                  return (
                    <div key={index} className="cart-item">
                      <img src={url + "/images/" + item.image} alt={item.name} />
                      <p>{item.name}</p>
                      <p>&#8377;{item.price}</p>
                      <p>
                        <button onClick={() => removeFromCart(item._id, shopId)} className="quantity-btn">-</button>
                        {getDisplayQuantity(itemQuantity * item.quantity, item.unit)} {/* Adjusted to show dynamic unit */}
                        <button onClick={() => addToCart(item._id, shopId)} className="quantity-btn">+</button>
                      </p>
                      <p>&#8377;{item.price * itemQuantity}</p>
                      <span onClick={() => deleteFromCart(item._id, shopId)} className="remove-cross">×</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <p className="total-amount">Total: &#8377;{getTotalCartAmount()}</p>
              </div>

              <div className="promo-code">
                <input type="text" placeholder="Promo code" className="promo-input" />
                <button onClick={handlePromoCode} className="promo-btn">Apply</button>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={!isEligibleForCheckout}
              className={`checkout-btn ${isEligibleForCheckout ? 'active' : 'disabled'}`}
            >
              Proceed to Checkout
            </button>

            {!isEligibleForCheckout && (
              <p className="min-purchase-msg">
                Minimum purchase of ₹60 required to checkout.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
