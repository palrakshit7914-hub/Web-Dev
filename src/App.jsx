 import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Air Max Pulse", category: "Sneakers", price: 2499, originalPrice: 3199, rating: 4.8, reviews: 214, badge: "Bestseller", emoji: "👟", bg: "#FEF3C7" },
  { id: 2, name: "Leather Jacket", category: "Outerwear", price: 5999, originalPrice: 7499, rating: 4.6, reviews: 89, badge: "New", emoji: "🧥", bg: "#F3F4F6" },
  { id: 3, name: "Slim Fit Chinos", category: "Bottoms", price: 1299, originalPrice: 1799, rating: 4.5, reviews: 302, badge: null, emoji: "👖", bg: "#FEF9C3" },
  { id: 4, name: "Wool Hoodie", category: "Tops", price: 1899, originalPrice: 2399, rating: 4.7, reviews: 178, badge: "Sale", emoji: "🧤", bg: "#DBEAFE" },
  { id: 5, name: "Aviator Sunglasses", category: "Accessories", price: 899, originalPrice: 1199, rating: 4.4, reviews: 453, badge: null, emoji: "🕶️", bg: "#FEF08A" },
  { id: 6, name: "Canvas Backpack", category: "Bags", price: 2199, originalPrice: 2799, rating: 4.9, reviews: 127, badge: "Top Rated", emoji: "🎒", bg: "#DCFCE7" },
  { id: 7, name: "Merino Turtleneck", category: "Tops", price: 1599, originalPrice: 1999, rating: 4.6, reviews: 96, badge: null, emoji: "👕", bg: "#F3E8FF" },
  { id: 8, name: "Ankle Boots", category: "Footwear", price: 3499, originalPrice: 4299, rating: 4.5, reviews: 211, badge: "New", emoji: "👢", bg: "#FFE4E6" },
];

const categories = ["All", "Sneakers", "Tops", "Bottoms", "Outerwear", "Footwear", "Bags", "Accessories"];

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>★</span>
      ))}
    </div>
  );
}

function ProductCard({ product, onAdd, onWishlist, wishlist }) {
  const [added, setAdded] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const liked = wishlist.includes(product.id);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card">
      <div className="card-img" style={{ background: product.bg }}>
        <span className="card-emoji">{product.emoji}</span>
        {product.badge && (
          <span className={`badge badge-${product.badge.toLowerCase().replace(" ", "-")}`}>{product.badge}</span>
        )}
        <span className="discount-tag">{discount}% OFF</span>
        <button className={`wishlist-btn ${liked ? "liked" : ""}`} onClick={() => onWishlist(product.id)}>
          {liked ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="card-body">
        <p className="card-category">{product.category}</p>
        <h3 className="card-name">{product.name}</h3>
        <div className="card-rating">
          <Stars rating={product.rating} />
          <span className="review-count">({product.reviews})</span>
        </div>
        <div className="card-price">
          <span className="price-now">₹{product.price.toLocaleString()}</span>
          <span className="price-old">₹{product.originalPrice.toLocaleString()}</span>
        </div>
        <button className={`add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onRemove, onQty }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Your Cart ({count})</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span>🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-img" style={{ background: item.bg }}>{item.emoji}</div>
                <div className="cart-info">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-cat">{item.category}</p>
                  <div className="qty-controls">
                    <button onClick={() => onQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => onQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <div className="cart-right">
                  <p className="cart-price">₹{(item.price * item.qty).toLocaleString()}</p>
                  <button className="remove-btn" onClick={() => onRemove(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
            <div className="total-row"><span>Shipping</span><span className="free">FREE</span></div>
            <div className="total-row grand"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            <button className="checkout-btn">Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Toast({ message }) {
  return <div className="toast">✓ {message}</div>;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState("home");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, d) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));

  const toggleWishlist = (id) => {
    const product = products.find((p) => p.id === id);
    setWishlist((prev) => {
      if (prev.includes(id)) return prev.filter((w) => w !== id);
      showToast(`${product.name} wishlisted ❤️`);
      return [...prev, id];
    });
  };

  let filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <button className="logo" onClick={() => setPage("home")}>
          <div className="logo-box">ST</div>
          <span>StyleThread</span>
        </button>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setPage("wishlist")}>
            🤍 <span className="nav-label">Wishlist</span>
            {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
          </button>
          <button className="nav-btn cart-nav-btn" onClick={() => setCartOpen(true)}>
            🛒 <span className="nav-label">Cart</span>
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {page === "home" && (
        <>
          {/* HERO */}
          <section className="hero">
            <div className="hero-content">
              <p className="hero-tag">✨ New Season Collection</p>
              <h1>Dress for<br /><span className="hero-highlight">every moment</span></h1>
              <p className="hero-sub">Curated fashion that blends style, comfort, and affordability — all in one place.</p>
              <div className="hero-btns">
                <button className="btn-primary">Shop Now →</button>
                <button className="btn-secondary">View Lookbook</button>
              </div>
            </div>
            <div className="hero-emojis">
              {["👟", "🧥", "🎒", "🕶️"].map((e, i) => (
                <div key={i} className="hero-emoji-box">{e}</div>
              ))}
            </div>
          </section>

          {/* PROMO BAR */}
          <div className="promo-bar">
            <span>🚚 Free Delivery on orders ₹999+</span>
            <span>↩ 30-Day Easy Returns</span>
            <span>🔒 100% Secure Payments</span>
          </div>

          {/* FILTERS */}
          <section className="shop-section">
            <div className="filters">
              <div className="category-filters">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${category === cat ? "active" : ""}`}
                    onClick={() => setCategory(cat)}
                  >{cat}</button>
                ))}
              </div>
              <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>

            {/* PRODUCTS */}
            {filtered.length === 0 ? (
              <div className="no-results">
                <span>🔍</span>
                <p>No products found</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onWishlist={toggleWishlist}
                    wishlist={wishlist}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {page === "wishlist" && (
        <section className="shop-section">
          <h2 className="section-title">❤️ My Wishlist ({wishlist.length})</h2>
          {wishlist.length === 0 ? (
            <div className="no-results">
              <span>🤍</span>
              <p>Your wishlist is empty</p>
              <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => setPage("home")}>Browse Products</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.filter((p) => wishlist.includes(p.id)).map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} onWishlist={toggleWishlist} wishlist={wishlist} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="logo-box small">ST</div>
              <span>StyleThread</span>
            </div>
            <p>Fashion that fits your life and your budget.</p>
          </div>
          {[["Shop", ["Men", "Women", "Kids", "Accessories"]], ["Help", ["FAQs", "Track Order", "Returns", "Contact"]], ["Company", ["About Us", "Careers", "Press", "Blog"]]].map(([title, links]) => (
            <div key={title}>
              <h4>{title}</h4>
              <ul>{links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">© 2025 StyleThread · Built with React + Tailwind CSS · Capstone Project</div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onQty={updateQty} />}

      {/* TOAST */}
      {toast && <Toast message={toast} />}
    </div>
  );
}
