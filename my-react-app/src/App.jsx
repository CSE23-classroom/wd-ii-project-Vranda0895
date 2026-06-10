import { useState, useEffect } from "react";

// ─── Static Data ──────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Electronics", "Books", "Clothing", "Home & Kitchen", "Sports"];

const PRODUCTS = [
  { id: 1, name: "Wireless Bluetooth Headphones", price: 2499, originalPrice: 4999, rating: 4.3, reviews: 1284, category: "Electronics", image: "🎧", badge: "Best Seller", description: "Premium noise cancellation, 30hr battery life, foldable design." },
  { id: 2, name: "Data Structures & Algorithms (Book)", price: 499, originalPrice: 799, rating: 4.7, reviews: 893, category: "Books", image: "📘", badge: "Top Rated", description: "Comprehensive guide for competitive programming and placements." },
  { id: 3, name: "Mechanical Keyboard RGB", price: 3299, originalPrice: 5499, rating: 4.5, reviews: 742, category: "Electronics", image: "⌨️", badge: "Deal", description: "Blue switches, anti-ghosting, USB-C connectivity." },
  { id: 4, name: "Cotton Oversized T-Shirt", price: 349, originalPrice: 699, rating: 4.1, reviews: 2106, category: "Clothing", image: "👕", badge: null, description: "100% cotton, unisex, available in 12 colours." },
  { id: 5, name: "Operating Systems (Galvin)", price: 699, originalPrice: 1099, rating: 4.6, reviews: 1540, category: "Books", image: "📗", badge: "Best Seller", description: "Standard OS textbook for B.Tech CSE 3rd year." },
  { id: 6, name: "Laptop Stand Adjustable", price: 1199, originalPrice: 1999, rating: 4.4, reviews: 312, category: "Home & Kitchen", image: "💻", badge: null, description: "Aluminium, 6-height settings, foldable & portable." },
  { id: 7, name: "Smart Water Bottle 1L", price: 799, originalPrice: 1299, rating: 4.2, reviews: 678, category: "Sports", image: "🍶", badge: "New", description: "Temperature display, BPA-free, leak-proof lid." },
  { id: 8, name: "USB-C Hub 7-in-1", price: 1499, originalPrice: 2499, rating: 4.5, reviews: 491, category: "Electronics", image: "🔌", badge: "Deal", description: "HDMI 4K, 3×USB-A, SD card, 100W PD charging." },
  { id: 9, name: "Cracking the Coding Interview", price: 599, originalPrice: 899, rating: 4.8, reviews: 3120, category: "Books", image: "📙", badge: "Top Rated", description: "189 programming questions & solutions for FAANG prep." },
  { id: 10, name: "Resistance Bands Set", price: 449, originalPrice: 799, rating: 4.0, reviews: 521, category: "Sports", image: "🏋️", badge: null, description: "5 resistance levels, door anchor, carry bag included." },
  { id: 11, name: "Desk Lamp LED Dimmable", price: 899, originalPrice: 1499, rating: 4.3, reviews: 267, category: "Home & Kitchen", image: "💡", badge: null, description: "Eye-care mode, USB charging port, touch controls." },
  { id: 12, name: "Joggers Track Pants", price: 599, originalPrice: 999, rating: 4.2, reviews: 834, category: "Clothing", image: "👖", badge: "Deal", description: "Slim fit, 4-way stretch, zippered pockets." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const discount = (orig, price) => Math.round(((orig - price) / orig) * 100);
const stars = (r) => "★".repeat(Math.floor(r)) + (r % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(r));

// ─── Sub-components ───────────────────────────────────────────────────────────
function Navbar({ cartCount, wishlistCount, searchQuery, setSearchQuery, setPage, cartItems }) {
  const [showCartDrop, setShowCartDrop] = useState(false);

  return (
    <nav style={s.nav}>
      <div style={s.navInner}>
        {/* Logo */}
        <div style={s.logo} onClick={() => setPage("home")}>
          <span style={s.logoText}>amazon</span>
          <span style={s.logoDot}>.in</span>
        </div>

        {/* Search */}
        <div style={s.searchBar}>
          <input
            style={s.searchInput}
            placeholder="Search products, books, electronics…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button style={s.searchBtn}>🔍</button>
        </div>

        {/* Icons */}
        <div style={s.navIcons}>
          <button style={s.navBtn} onClick={() => setPage("wishlist")}>
            ♡ <span style={s.badge}>{wishlistCount}</span>
          </button>
          <div style={{ position: "relative" }}>
            <button style={s.navBtn} onClick={() => { setShowCartDrop(p => !p); setPage("cart"); }}>
              🛒 Cart <span style={s.badge}>{cartCount}</span>
            </button>
          </div>
          <button style={s.navBtn} onClick={() => setPage("orders")}>Orders</button>
        </div>
      </div>
    </nav>
  );
}

function HeroBanner({ setCategory }) {
  const slides = [
    { bg: "#232f3e", text: "Up to 70% off Electronics", sub: "Limited time deal", emoji: "⚡", cat: "Electronics" },
    { bg: "#b12704", text: "CSE Books at Flat ₹499", sub: "Perfect for placement prep", emoji: "📚", cat: "Books" },
    { bg: "#007185", text: "New Arrivals in Sports", sub: "Stay fit this semester", emoji: "🏃", cat: "Sports" },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);
  const slide = slides[idx];
  return (
    <div style={{ ...s.hero, background: slide.bg }} onClick={() => setCategory(slide.cat)}>
      <div style={s.heroContent}>
        <span style={s.heroEmoji}>{slide.emoji}</span>
        <div>
          <div style={s.heroTitle}>{slide.text}</div>
          <div style={s.heroSub}>{slide.sub} — Shop {slide.cat}</div>
        </div>
      </div>
      <div style={s.heroDots}>
        {slides.map((_, i) => (
          <span key={i} style={{ ...s.dot, opacity: i === idx ? 1 : 0.4 }} onClick={(e) => { e.stopPropagation(); setIdx(i); }} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, addToCart, toggleWishlist, wishlist, setPage, setSelected }) {
  const inWish = wishlist.includes(product.id);
  return (
    <div style={s.card} onClick={() => { setSelected(product); setPage("detail"); }}>
      {product.badge && <span style={s.cardBadge}>{product.badge}</span>}
      <button style={{ ...s.wishBtn, color: inWish ? "#e31" : "#aaa" }}
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}>
        {inWish ? "♥" : "♡"}
      </button>
      <div style={s.cardImg}>{product.image}</div>
      <div style={s.cardBody}>
        <div style={s.cardName}>{product.name}</div>
        <div style={s.cardStars}>{stars(product.rating)} <span style={s.cardReviews}>({product.reviews.toLocaleString()})</span></div>
        <div style={s.cardPriceRow}>
          <span style={s.cardPrice}>₹{product.price.toLocaleString()}</span>
          <span style={s.cardOrig}>₹{product.originalPrice.toLocaleString()}</span>
          <span style={s.cardDisc}>{discount(product.originalPrice, product.price)}% off</span>
        </div>
        <button style={s.addBtn} onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function ProductDetail({ product, addToCart, toggleWishlist, wishlist, setPage }) {
  const [qty, setQty] = useState(1);
  const inWish = wishlist.includes(product.id);
  if (!product) return null;
  return (
    <div style={s.detailWrap}>
      <button style={s.back} onClick={() => setPage("home")}>← Back</button>
      <div style={s.detailGrid}>
        <div style={s.detailImgBox}><span style={{ fontSize: 120 }}>{product.image}</span></div>
        <div style={s.detailInfo}>
          <h2 style={s.detailTitle}>{product.name}</h2>
          <div style={s.cardStars}>{stars(product.rating)} <span style={s.cardReviews}>{product.reviews.toLocaleString()} ratings</span></div>
          <hr style={s.divider} />
          <div style={s.detailPriceRow}>
            <span style={s.detailPrice}>₹{product.price.toLocaleString()}</span>
            <span style={s.cardOrig}>M.R.P: ₹{product.originalPrice.toLocaleString()}</span>
            <span style={s.cardDisc}>{discount(product.originalPrice, product.price)}% off</span>
          </div>
          <p style={s.detailDesc}>{product.description}</p>
          <div style={s.qtyRow}>
            <span>Qty:</span>
            <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span style={s.qtyNum}>{qty}</span>
            <button style={s.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
          </div>
          <button style={s.buyBtn} onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); setPage("cart"); }}>
            Buy Now
          </button>
          <button style={s.addBtnLg} onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}>
            Add to Cart
          </button>
          <button style={{ ...s.wishBtnLg, color: inWish ? "#e31" : "#555" }} onClick={() => toggleWishlist(product.id)}>
            {inWish ? "♥ Wishlisted" : "♡ Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cartItems, removeFromCart, updateQty, setPage }) {
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const savings = cartItems.reduce((s, i) => s + (i.originalPrice - i.price) * i.qty, 0);
  if (cartItems.length === 0)
    return (
      <div style={s.emptyPage}>
        <div style={{ fontSize: 80 }}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add items to get started!</p>
        <button style={s.buyBtn} onClick={() => setPage("home")}>Shop Now</button>
      </div>
    );
  return (
    <div style={s.cartWrap}>
      <h2 style={s.pageTitle}>Shopping Cart</h2>
      <div style={s.cartGrid}>
        <div style={s.cartItems}>
          {cartItems.map(item => (
            <div key={item.id} style={s.cartItem}>
              <span style={{ fontSize: 50 }}>{item.image}</span>
              <div style={{ flex: 1 }}>
                <div style={s.cartItemName}>{item.name}</div>
                <div style={s.cardPriceRow}>
                  <span style={s.cardPrice}>₹{item.price.toLocaleString()}</span>
                  <span style={s.cardOrig}>₹{item.originalPrice.toLocaleString()}</span>
                </div>
                <div style={s.qtyRow}>
                  <button style={s.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span style={s.qtyNum}>{item.qty}</span>
                  <button style={s.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  <button style={s.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={s.cartSummary}>
          <h3>Order Summary</h3>
          <div style={s.summaryRow}><span>Items ({cartItems.reduce((s, i) => s + i.qty, 0)})</span><span>₹{total.toLocaleString()}</span></div>
          <div style={{ ...s.summaryRow, color: "#007600" }}><span>You save</span><span>-₹{savings.toLocaleString()}</span></div>
          <div style={s.summaryRow}><span>Delivery</span><span style={{ color: "#007600" }}>FREE</span></div>
          <hr style={s.divider} />
          <div style={{ ...s.summaryRow, fontWeight: 700, fontSize: 18 }}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <button style={s.buyBtn} onClick={() => setPage("checkout")}>Proceed to Buy</button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ cartItems, placeOrder, setPage }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", pin: "", phone: "", payment: "upi" });
  const [errors, setErrors] = useState({});
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Invalid email";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.pin.match(/^\d{6}$/)) e.pin = "6-digit PIN";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit number";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    placeOrder(form);
    setPage("orders");
  };

  const field = (label, key, type = "text") => (
    <div style={s.formGroup}>
      <label style={s.label}>{label}</label>
      <input style={{ ...s.input, borderColor: errors[key] ? "#e31" : "#ccc" }}
        type={type} value={form[key]}
        onChange={(e) => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: "" })); }}
      />
      {errors[key] && <span style={s.err}>{errors[key]}</span>}
    </div>
  );

  return (
    <div style={s.checkoutWrap}>
      <button style={s.back} onClick={() => setPage("cart")}>← Cart</button>
      <h2 style={s.pageTitle}>Checkout</h2>
      <div style={s.checkoutGrid}>
        <div style={s.checkoutForm}>
          <h3>Delivery Address</h3>
          {field("Full Name", "name")}
          {field("Email", "email", "email")}
          {field("Address", "address")}
          {field("City", "city")}
          {field("PIN Code", "pin")}
          {field("Phone", "phone")}
          <h3 style={{ marginTop: 20 }}>Payment Method</h3>
          {["upi", "card", "cod"].map(p => (
            <label key={p} style={s.radioLabel}>
              <input type="radio" name="pay" value={p} checked={form.payment === p}
                onChange={() => setForm(prev => ({ ...prev, payment: p }))} />
              {p === "upi" ? "UPI / Net Banking" : p === "card" ? "Credit / Debit Card" : "Cash on Delivery"}
            </label>
          ))}
        </div>
        <div style={s.cartSummary}>
          <h3>Order Summary</h3>
          {cartItems.map(i => (
            <div key={i.id} style={s.summaryRow}>
              <span>{i.name.slice(0, 22)}… ×{i.qty}</span>
              <span>₹{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <hr style={s.divider} />
          <div style={{ ...s.summaryRow, fontWeight: 700, fontSize: 18 }}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <button style={s.buyBtn} onClick={handleSubmit}>Place Order</button>
        </div>
      </div>
    </div>
  );
}

function OrdersPage({ orders, setPage }) {
  if (orders.length === 0)
    return (
      <div style={s.emptyPage}>
        <div style={{ fontSize: 80 }}>📦</div>
        <h2>No orders yet</h2>
        <button style={s.buyBtn} onClick={() => setPage("home")}>Start Shopping</button>
      </div>
    );
  return (
    <div style={s.ordersWrap}>
      <h2 style={s.pageTitle}>Your Orders</h2>
      {[...orders].reverse().map((order, oi) => (
        <div key={oi} style={s.orderCard}>
          <div style={s.orderHeader}>
            <span>Order #{order.id}</span>
            <span style={s.orderStatus}>✅ Confirmed</span>
            <span style={{ color: "#555", fontSize: 13 }}>{order.date}</span>
          </div>
          <div style={s.orderItems}>
            {order.items.map(i => (
              <div key={i.id} style={s.orderItem}>
                <span style={{ fontSize: 28 }}>{i.image}</span>
                <span style={{ flex: 1 }}>{i.name}</span>
                <span>×{i.qty}</span>
                <span style={s.cardPrice}>₹{(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={s.orderFooter}>
            <span>Total: <strong>₹{order.total.toLocaleString()}</strong></span>
            <span>Delivery to: {order.address.city} - {order.address.pin}</span>
            <span>Payment: {order.address.payment.toUpperCase()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WishlistPage({ wishlist, products, addToCart, toggleWishlist, setPage, setSelected }) {
  const items = products.filter(p => wishlist.includes(p.id));
  if (items.length === 0)
    return (
      <div style={s.emptyPage}>
        <div style={{ fontSize: 80 }}>♡</div>
        <h2>Wishlist is empty</h2>
        <button style={s.buyBtn} onClick={() => setPage("home")}>Browse Products</button>
      </div>
    );
  return (
    <div style={s.ordersWrap}>
      <h2 style={s.pageTitle}>My Wishlist ({items.length})</h2>
      <div style={s.grid}>
        {items.map(p => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} toggleWishlist={toggleWishlist}
            wishlist={wishlist} setPage={setPage} setSelected={setSelected} />
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // Cart operations
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`"${product.name.slice(0, 28)}…" added to cart`);
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    showToast(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist ♥");
  };

  const placeOrder = (formData) => {
    const order = {
      id: Date.now(),
      items: cartItems,
      total: cartItems.reduce((s, i) => s + i.price * i.qty, 0),
      address: formData,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setOrders(prev => [...prev, order]);
    setCartItems([]);
    showToast("Order placed successfully! 🎉");
  };

  // Filtered & sorted products
  const filteredProducts = PRODUCTS
    .filter(p => selectedCategory === "All" || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div style={s.app}>
      <Navbar cartCount={cartItems.reduce((s, i) => s + i.qty, 0)} wishlistCount={wishlist.length}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPage={setPage} cartItems={cartItems} />

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}

      {/* Pages */}
      {page === "home" && (
        <div>
          <HeroBanner setCategory={(c) => { setSelectedCategory(c); setSearchQuery(""); }} />
          {/* Category Pills */}
          <div style={s.catRow}>
            {CATEGORIES.map(c => (
              <button key={c} style={{ ...s.catPill, background: selectedCategory === c ? "#ff9900" : "#f3f3f3", color: selectedCategory === c ? "#fff" : "#333" }}
                onClick={() => setSelectedCategory(c)}>{c}</button>
            ))}
          </div>
          {/* Sort bar */}
          <div style={s.sortBar}>
            <span style={{ color: "#555", fontSize: 14 }}>{filteredProducts.length} results</span>
            <select style={s.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
            </select>
          </div>
          {filteredProducts.length === 0
            ? <div style={s.emptyPage}><div style={{ fontSize: 60 }}>🔍</div><p>No products found for "{searchQuery}"</p></div>
            : <div style={s.grid}>
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} addToCart={addToCart}
                  toggleWishlist={toggleWishlist} wishlist={wishlist}
                  setPage={setPage} setSelected={setSelectedProduct} />
              ))}
            </div>}
        </div>
      )}
      {page === "detail" && selectedProduct && (
        <ProductDetail product={selectedProduct} addToCart={addToCart}
          toggleWishlist={toggleWishlist} wishlist={wishlist} setPage={setPage} />
      )}
      {page === "cart" && (
        <CartPage cartItems={cartItems} removeFromCart={removeFromCart}
          updateQty={updateQty} setPage={setPage} />
      )}
      {page === "checkout" && (
        <CheckoutPage cartItems={cartItems} placeOrder={placeOrder} setPage={setPage} />
      )}
      {page === "orders" && <OrdersPage orders={orders} setPage={setPage} />}
      {page === "wishlist" && (
        <WishlistPage wishlist={wishlist} products={PRODUCTS} addToCart={addToCart}
          toggleWishlist={toggleWishlist} setPage={setPage} setSelected={setSelectedProduct} />
      )}

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div><strong style={{ color: "#ff9900" }}>amazon</strong><span style={{ color: "#fff" }}>.in</span><br /><span style={{ color: "#aaa", fontSize: 12 }}>BTech CSE Clone Project</span></div>
          <div style={{ color: "#aaa", fontSize: 12, textAlign: "center" }}>Built with React • useState • useEffect<br />No API keys required</div>
          <div style={{ color: "#aaa", fontSize: 12, textAlign: "right" }}>© 2024 Amazon Clone<br />Educational Purpose Only</div>
        </div>
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  app: { fontFamily: "'Segoe UI', Arial, sans-serif", background: "#eaeded", minHeight: "100vh" },
  nav: { background: "#131921", padding: "10px 0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.4)" },
  navInner: { maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "0 16px", flexWrap: "wrap" },
  logo: { cursor: "pointer", userSelect: "none" },
  logoText: { fontSize: 26, fontWeight: 900, color: "#fff", fontStyle: "italic" },
  logoDot: { fontSize: 14, color: "#ff9900", fontWeight: 700 },
  searchBar: { flex: 1, display: "flex", minWidth: 200, borderRadius: 4, overflow: "hidden", border: "2px solid #ff9900" },
  searchInput: { flex: 1, padding: "8px 12px", fontSize: 14, border: "none", outline: "none" },
  searchBtn: { background: "#ff9900", border: "none", padding: "0 16px", fontSize: 16, cursor: "pointer" },
  navIcons: { display: "flex", gap: 8 },
  navBtn: { background: "transparent", border: "1px solid transparent", color: "#fff", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 13, position: "relative", whiteSpace: "nowrap", transition: "border-color .2s" },
  badge: { background: "#ff9900", color: "#111", borderRadius: "50%", padding: "1px 5px", fontSize: 11, fontWeight: 700, marginLeft: 3 },
  hero: { padding: "40px 32px", cursor: "pointer", transition: "background .6s" },
  heroContent: { maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 },
  heroEmoji: { fontSize: 72 },
  heroTitle: { fontSize: 32, fontWeight: 800, color: "#fff" },
  heroSub: { color: "#ccc", fontSize: 16, marginTop: 6 },
  heroDots: { display: "flex", justifyContent: "center", gap: 8, marginTop: 16 },
  dot: { width: 10, height: 10, borderRadius: "50%", background: "#fff", cursor: "pointer", transition: "opacity .3s" },
  catRow: { maxWidth: 1280, margin: "16px auto 0", padding: "0 16px", display: "flex", gap: 8, flexWrap: "wrap" },
  catPill: { border: "none", borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background .2s" },
  sortBar: { maxWidth: 1280, margin: "12px auto 0", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  sortSelect: { padding: "6px 12px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13, background: "#fff" },
  grid: { maxWidth: 1280, margin: "16px auto", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 },
  card: { background: "#fff", borderRadius: 8, padding: 16, cursor: "pointer", position: "relative", boxShadow: "0 1px 4px rgba(0,0,0,.1)", transition: "box-shadow .2s, transform .2s" },
  cardBadge: { position: "absolute", top: 10, left: 10, background: "#cc0c39", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 3 },
  wishBtn: { position: "absolute", top: 10, right: 10, background: "transparent", border: "none", fontSize: 20, cursor: "pointer" },
  cardImg: { fontSize: 72, textAlign: "center", margin: "8px 0 12px" },
  cardBody: {},
  cardName: { fontSize: 13, fontWeight: 600, color: "#0f1111", lineHeight: 1.4, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardStars: { color: "#e47911", fontSize: 13, marginBottom: 4 },
  cardReviews: { color: "#007185", fontSize: 12, fontWeight: 400 },
  cardPriceRow: { display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", marginBottom: 8 },
  cardPrice: { fontSize: 18, fontWeight: 700, color: "#0f1111" },
  cardOrig: { fontSize: 12, color: "#555", textDecoration: "line-through" },
  cardDisc: { fontSize: 12, color: "#cc0c39", fontWeight: 600 },
  addBtn: { width: "100%", background: "#ffd814", border: "1px solid #f0c14b", borderRadius: 20, padding: "7px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4 },
  toast: { position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#232f3e", color: "#fff", padding: "12px 24px", borderRadius: 8, zIndex: 999, fontSize: 14, boxShadow: "0 4px 16px rgba(0,0,0,.3)" },
  // Detail
  detailWrap: { maxWidth: 1100, margin: "24px auto", padding: "0 16px" },
  back: { background: "none", border: "none", color: "#007185", cursor: "pointer", fontSize: 15, marginBottom: 16, padding: 0 },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 40, background: "#fff", borderRadius: 10, padding: 32, boxShadow: "0 2px 8px rgba(0,0,0,.1)" },
  detailImgBox: { display: "flex", justifyContent: "center", alignItems: "center", background: "#f7f8fa", borderRadius: 8, minHeight: 260 },
  detailInfo: {},
  detailTitle: { fontSize: 22, fontWeight: 700, color: "#0f1111", marginBottom: 8 },
  divider: { border: "none", borderTop: "1px solid #e7e7e7", margin: "16px 0" },
  detailPriceRow: { display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 12 },
  detailPrice: { fontSize: 28, fontWeight: 700, color: "#0f1111" },
  detailDesc: { color: "#444", fontSize: 14, lineHeight: 1.7, margin: "12px 0" },
  qtyRow: { display: "flex", alignItems: "center", gap: 10, margin: "14px 0" },
  qtyBtn: { width: 32, height: 32, borderRadius: "50%", border: "1px solid #ccc", background: "#f3f3f3", fontSize: 18, cursor: "pointer", fontWeight: 700 },
  qtyNum: { fontSize: 18, fontWeight: 700, minWidth: 24, textAlign: "center" },
  buyBtn: { display: "block", width: "100%", background: "#ff9900", border: "none", borderRadius: 20, padding: "10px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 8 },
  addBtnLg: { display: "block", width: "100%", background: "#ffd814", border: "1px solid #f0c14b", borderRadius: 20, padding: "10px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 8 },
  wishBtnLg: { display: "block", width: "100%", background: "transparent", border: "1px solid #ccc", borderRadius: 20, padding: "10px 0", fontSize: 15, cursor: "pointer" },
  // Cart
  cartWrap: { maxWidth: 1100, margin: "24px auto", padding: "0 16px" },
  cartGrid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 },
  cartItems: { background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.08)" },
  cartItem: { display: "flex", gap: 16, alignItems: "flex-start", borderBottom: "1px solid #eee", paddingBottom: 16, marginBottom: 16 },
  cartItemName: { fontWeight: 600, fontSize: 15, marginBottom: 6 },
  removeBtn: { background: "none", border: "none", color: "#cc0c39", cursor: "pointer", fontSize: 13, textDecoration: "underline" },
  cartSummary: { background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.08)", alignSelf: "start", position: "sticky", top: 80 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 14, margin: "8px 0" },
  pageTitle: { fontSize: 24, fontWeight: 700, marginBottom: 20, color: "#0f1111" },
  // Checkout
  checkoutWrap: { maxWidth: 1100, margin: "24px auto", padding: "0 16px" },
  checkoutGrid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 },
  checkoutForm: { background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,.08)" },
  formGroup: { marginBottom: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#333" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #ccc", borderRadius: 4, fontSize: 14, boxSizing: "border-box", outline: "none" },
  err: { color: "#cc0c39", fontSize: 12, marginTop: 3, display: "block" },
  radioLabel: { display: "flex", alignItems: "center", gap: 8, margin: "8px 0", fontSize: 14, cursor: "pointer" },
  // Orders
  ordersWrap: { maxWidth: 1100, margin: "24px auto", padding: "0 16px" },
  orderCard: { background: "#fff", borderRadius: 8, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)", overflow: "hidden" },
  orderHeader: { background: "#f7f8fa", padding: "10px 20px", display: "flex", gap: 20, alignItems: "center", fontSize: 14, borderBottom: "1px solid #eee" },
  orderStatus: { color: "#007600", fontWeight: 700 },
  orderItems: { padding: "12px 20px" },
  orderItem: { display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f3f3f3", fontSize: 14 },
  orderFooter: { background: "#fafafa", padding: "10px 20px", display: "flex", gap: 24, fontSize: 13, color: "#555", borderTop: "1px solid #eee", flexWrap: "wrap" },
  // Empty
  emptyPage: { textAlign: "center", padding: "60px 16px", color: "#555" },
  // Footer
  footer: { background: "#232f3e", marginTop: 40 },
  footerInner: { maxWidth: 1280, margin: "0 auto", padding: "24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 },
};
