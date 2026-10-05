import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/products";

function App() {

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    price: "",
    category: "",
    count: ""
  });

  const [message, setMessage] = useState("");

  // Get all products
  const getAllProducts = async () => {

    try {

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("No products found");
      }

      const data = await response.json();

      setProducts(data);

    } catch (error) {

      setProducts([]);
      setMessage(error.message);

    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Handle input
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // Add Product
  const addProduct = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          count: Number(formData.count)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      setMessage("Product added successfully!");

      clearForm();

      getAllProducts();

    } catch (error) {

      setMessage(error.message);

    }
  };

  // Update Product
  const updateProduct = async (e) => {

    e.preventDefault();

    if (!formData.productId) {
      setMessage("Enter Product ID to update");
      return;
    }

    try {

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: Number(formData.productId),
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          count: Number(formData.count)
        })
      });

      if (!response.ok) {
        throw new Error("Product not found");
      }

      setMessage("Product updated successfully!");

      clearForm();

      getAllProducts();

    } catch (error) {

      setMessage(error.message);

    }
  };

  // Delete Product
  const deleteProduct = async (productId) => {

    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/${productId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Product not found");
      }

      setMessage("Product deleted successfully!");

      getAllProducts();

    } catch (error) {

      setMessage(error.message);

    }
  };

  // Edit button
  const editProduct = (product) => {

    setFormData({
      productId: product.productId,
      name: product.name,
      price: product.price,
      category: product.category,
      count: product.count
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Clear form
  const clearForm = () => {

    setFormData({
      productId: "",
      name: "",
      price: "",
      category: "",
      count: ""
    });

  };

  return (
    <div className="container">

      <h1>Product Management System</h1>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* Product Form */}

      <div className="card">

        <h2>
          {formData.productId
            ? "Update Product"
            : "Add Product"}
        </h2>

        <form onSubmit={
          formData.productId
            ? updateProduct
            : addProduct
        }>

          {formData.productId && (
            <div className="form-group">

              <label>Product ID</label>

              <input
                type="number"
                name="productId"
                value={formData.productId}
                readOnly
              />

            </div>
          )}

          <div className="form-group">

            <label>Product Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Price</label>

            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Category</label>

            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Count</label>

            <input
              type="number"
              name="count"
              placeholder="Enter quantity"
              value={formData.count}
              onChange={handleChange}
              required
            />

          </div>

          <button type="submit">

            {formData.productId
              ? "Update Product"
              : "Add Product"}

          </button>

          {formData.productId && (
            <button
              type="button"
              className="cancel"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}

        </form>

      </div>

      {/* Product Table */}

      <div className="card">

        <div className="table-header">

          <h2>All Products</h2>

          <button onClick={getAllProducts}>
            Refresh
          </button>

        </div>

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Count</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>
                <td colSpan="6">
                  No products available
                </td>
              </tr>

            ) : (

              products.map((product) => (

                <tr key={product.productId}>

                  <td>{product.productId}</td>

                  <td>{product.name}</td>

                  <td>₹{product.price}</td>

                  <td>{product.category}</td>

                  <td>{product.count}</td>

                  <td>

                    <button
                      className="edit"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() =>
                        deleteProduct(product.productId)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;