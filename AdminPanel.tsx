import * as React from "react";
import { useState } from "react";
import { StyleSheet } from "react-nativescript";
import axios from "axios";

export function AdminPanel() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const addProduct = async () => {
    try {
      await axios.post('http://localhost:3000/api/products', {
        name,
        price: Number(price),
        description,
        imageUrl
      }, {
        headers: { Authorization: `Bearer ${global.token}` }
      });
      alert('Product added successfully!');
      setName("");
      setPrice("");
      setDescription("");
      setImageUrl("");
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl font-bold">Admin Panel</label>
      <textField
        hint="Product Name"
        value={name}
        onTextChange={(e) => setName(e.value)}
      />
      <textField
        hint="Price"
        keyboardType="number"
        value={price}
        onTextChange={(e) => setPrice(e.value)}
      />
      <textField
        hint="Description"
        value={description}
        onTextChange={(e) => setDescription(e.value)}
      />
      <textField
        hint="Image URL"
        value={imageUrl}
        onTextChange={(e) => setImageUrl(e.value)}
      />
      <button onTap={addProduct}>Add Product</button>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16
  }
});