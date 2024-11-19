import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-nativescript";
import axios from "axios";

export function ProductList({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post('http://localhost:3000/api/cart', {
        productId,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${global.token}` }
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl font-bold">Products</label>
      <scrollView>
        {products.map(product => (
          <flexboxLayout key={product._id} style={styles.productCard}>
            <image src={product.imageUrl} style={styles.productImage} />
            <label style={styles.productName}>{product.name}</label>
            <label style={styles.productPrice}>${product.price}</label>
            <button onTap={() => addToCart(product._id)}>
              Add to Cart
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
  productCard: {
    margin: 8,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8
  },
  productImage: {
    width: 100,
    height: 100
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold"
  },
  productPrice: {
    fontSize: 16,
    color: "#666"
  }
});