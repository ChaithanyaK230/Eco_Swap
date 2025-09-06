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

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [showSellForm, setShowSellForm] = useState(false);
  const [showWishlistView, setShowWishlistView] = useState(false);
  const [showCartView, setShowCartView] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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
      price: parseFloat(price),
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

  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const handlePayNow = () => {
    alert("Payment Successful ✅");
    setCart([]);
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
            onClick={() => {
              setShowWishlistView(!showWishlistView);
              setShowCartView(false);
            }}
          >
            💖 {showWishlistView ? "Back to Home" : "Wishlist"}
          </button>

          <button
            className="cart-btn"
            onClick={() => {
              setShowCartView(!showCartView);
              setShowWishlistView(false);
            }}
          >
            🛒 Cart ({cart.reduce((total, item) => total + item.qty, 0)})
          </button>

          <button
            className="sell-btn"
            onClick={() => setShowSellForm(!showSellForm)}
          >
            {showSellForm ? "Cancel" : "Sell"}
          </button>
        </div>
      </header>

      {/* Sell Form */}
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
            placeholder="Price (₹)"
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

      {/* Cart View */}
      {showCartView && (
        <div className="cart-summary">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <h4>{item.title}</h4>
                    <p>Qty: {item.qty}</p>
                    <p>Price: ₹{item.price * item.qty}</p>
                  </div>
                </div>
              ))}
              <h4 style={{ marginTop: "15px" }}>
                Total: ₹
                {cart.reduce(
                  (total, item) => total + item.price * item.qty,
                  0
                )}
              </h4>
              <button onClick={handlePayNow} className="pay-btn">
                Pay Now
              </button>
            </>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!showCartView && (
        <div className="product-grid">
          {displayedProducts.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              {showWishlistView
                ? "No items in wishlist."
                : "No products available."}
            </p>
          ) : (
            displayedProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div
                  className="product-fav"
                  onClick={() => toggleWishlist(product.id)}
                  title="Toggle Wishlist"
                >
                  {wishlist.includes(product.id) ? "❤️" : "🤍"}
                </div>
                <img src={product.image} alt={product.title} className="product-image" />
                <h4>{product.title}</h4>
                <p>{product.description}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Price:</strong> ₹ {product.price}</p>
                <button
                  className="add-to-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
