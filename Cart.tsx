import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-nativescript";
import axios from "axios";

export function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/cart', {
        headers: { Authorization: `Bearer ${global.token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${global.token}` }
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl font-bold">Shopping Cart</label>
      <scrollView>
        {cartItems.map(item => (
          <flexboxLayout key={item.product._id} style={styles.cartItem}>
            <label>{item.product.name}</label>
            <label>Quantity: {item.quantity}</label>
            <label>${item.product.price * item.quantity}</label>
            <button onTap={() => removeFromCart(item.product._id)}>
              Remove
            </button>
          </flexboxLayout>
        ))}
      </scrollView>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  cartItem: {
    margin: 8,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8
  }
});