import React, { useState, useEffect } from "react";
import "./HomePage.css";

const categories = [
  "Clothing",
  "Electronic",
  "Home Decor",
  "Books",
  "Toys",
  "Furniture",
  "Others",
];

function HomePage() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [showSellForm, setShowSellForm] = useState(false);
  const [showWishlistView, setShowWishlistView] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !category || !price || !image) {
      alert("Please fill all fields and upload an image");
      return;
    }

    const newProduct = {
      id: Date.now(),
      title,
      description,
      category,
      price,
      image,
    };

    setProducts([newProduct, ...products]);
    setTitle("");
    setDescription("");
    setCategory(categories[0]);
    setPrice("");
    setImage(null);
    setShowSellForm(false);
  };

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((itemId) => itemId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const displayedProducts = showWishlistView
    ? products.filter((product) => wishlist.includes(product.id))
    : products;

  return (
    <div className="home-container">
      <header className="header">
        <h2 className="logo">EcoSwap</h2>
        <div className="header-buttons">
          <button
            className="wishlist-btn"
            onClick={() => setShowWishlistView(!showWishlistView)}
          >
            💖 {showWishlistView ? "Back to Home" : "Wishlist"}
          </button>
          <button className="cart-btn">🛒 Cart</button>
          <button
            className="sell-btn"
            onClick={() => setShowSellForm(!showSellForm)}
          >
            {showSellForm ? "Cancel" : "Sell"}
          </button>
        </div>
      </header>

      {showSellForm && (
        <form className="sell-form" onSubmit={handleSubmit}>
          <h3>New Product Listing</h3>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Brief Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price (₹ Indian Rupees)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" />
            </div>
          )}
          <button type="submit">Add Product</button>
        </form>
      )}

      <div className="product-grid">
        {displayedProducts.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {showWishlistView
              ? "No items in your wishlist."
              : "No products listed yet. Click 'Sell' to add a product."}
          </p>
        ) : (
          displayedProducts.map(
            ({ id, title, description, category, price, image }) => (
              <div className="product-card" key={id}>
                <div
                  className="product-fav"
                  onClick={() => toggleWishlist(id)}
                  title="Toggle Wishlist"
                >
                  {wishlist.includes(id) ? "❤️" : "🤍"}
                </div>
                <img src={image} alt={title} className="product-image" />
                <h4>{title}</h4>
                <p>{description}</p>
                <p>
                  <strong>Category:</strong> {category}
                </p>
                <p>
                  <strong>Price:</strong> ₹ {price}
                </p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default HomePage;
