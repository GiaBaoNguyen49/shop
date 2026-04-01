const defaultCars = [
  {
    id: 'car-1',
    name: 'Toyota Supra',
    model: '2024 Turbo',
    price: '1.950.000.000 ₫',
    category: 'sport',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    description: 'Toyota Supra 2024 với thiết kế thể thao, động cơ mạnh mẽ và cảm giác lái phấn khích.',
    highlights: ['Động cơ 3.0L tăng áp', 'Nội thất da cao cấp', 'Hệ thống điều khiển thể thao', 'Cảm biến đỗ xe và camera 360°'],
    specs: ['350 mã lực', '0-100km/h trong 4.1 giây', 'Hộp số tự động 8 cấp', 'Màu sắc: Đỏ ruby']
  },
  {
    id: 'car-2',
    name: 'Ford Mustang GT',
    model: '2023 V8',
    price: '2.150.000.000 ₫',
    category: 'sport',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    description: 'Ford Mustang GT 2023 với tiếng pô uy lực, ngoại thất cá tính và công nghệ hiện đại.',
    highlights: ['Động cơ V8 5.0L', 'Hệ thống âm thanh cao cấp', 'Ghế thể thao bọc da', 'Công nghệ hỗ trợ lái an toàn'],
    specs: ['450 mã lực', '0-100km/h trong 4.4 giây', 'Hộp số tự động 10 cấp', 'Màu sắc: Xanh dương']
  },
  {
    id: 'car-3',
    name: 'Tesla Model 3',
    model: '2025 Long Range',
    price: '1.450.000.000 ₫',
    category: 'electric',
    image: 'https://images.unsplash.com/photo-1608571422079-3a4b6ab834a3?auto=format&fit=crop&w=1200&q=80',
    description: 'Tesla Model 3 hiện đại, chạy điện và kết nối thông minh với hệ thống lái tự động nâng cao.',
    highlights: ['Pin sạc nhanh', 'Ứng dụng điều khiển từ xa', 'Không khí nội thất sạch', 'Hệ thống lái tự động Autopilot'],
    specs: ['Lái khoảng 580 km', '0-100km/h trong 4.2 giây', 'Sạc 10-80% trong 30 phút', 'Màu sắc: Trắng ngọc']
  }
];

const adminCredentials = { username: 'admin', password: 'admin123' };

function getStoredCars() {
  const saved = localStorage.getItem('carMarketCars');
  if (!saved) {
    localStorage.setItem('carMarketCars', JSON.stringify(defaultCars));
    return defaultCars;
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    localStorage.setItem('carMarketCars', JSON.stringify(defaultCars));
    return defaultCars;
  }
}

function saveCars(cars) {
  localStorage.setItem('carMarketCars', JSON.stringify(cars));
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function renderCarCards(cars = getStoredCars()) {
  const container = document.getElementById('car-grid');
  if (!container) return;
  if (!cars.length) {
    container.innerHTML = '<div class="col-12"><div class="card p-5 text-center text-muted">Không tìm thấy xe phù hợp. Vui lòng thử lại.</div></div>';
    return;
  }
  container.innerHTML = cars.map(car => `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm border-0">
        <img src="${car.image}" class="card-img-top" alt="${car.name}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <span class="feature-badge">${car.category === 'electric' ? 'Xe điện' : car.category === 'sport' ? 'Thể thao' : 'Sedan'}</span>
            <span class="text-muted">Hot</span>
          </div>
          <h5 class="card-title">${car.name}</h5>
          <p class="text-muted mb-2">${car.model}</p>
          <p class="price-tag mb-3">${car.price}</p>
          <p class="text-secondary mb-4">${car.description}</p>
          <div class="mt-auto d-flex flex-column gap-2">
            <a href="car.html?id=${car.id}" class="btn btn-outline-primary">Xem chi tiết</a>
            <button type="button" class="btn btn-primary add-cart-button" data-car-id="${car.id}">Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function getSearchValue() {
  const input = document.getElementById('search-input');
  return input ? input.value.trim().toLowerCase() : '';
}

function getActiveCategory() {
  const button = document.querySelector('.category-filter button.active');
  return button ? button.dataset.category : 'all';
}

function filterCars() {
  const query = getSearchValue();
  const category = getActiveCategory();
  const cars = getStoredCars().filter(car => {
    const text = `${car.name} ${car.model} ${car.price} ${car.category}`.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesCategory = category === 'all' || car.category === category;
    return matchesQuery && matchesCategory;
  });
  renderCarCards(cars);
}

function setupSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.category-filter button[data-category]');

  if (searchInput) {
    searchInput.addEventListener('input', filterCars);
  }
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterCars();
    });
  });
}

function getStoredInquiries() {
  const saved = localStorage.getItem('carMarketInquiries');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (error) {
    localStorage.setItem('carMarketInquiries', JSON.stringify([]));
    return [];
  }
}

function getStoredCart() {
  const saved = localStorage.getItem('carMarketCart');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (error) {
    localStorage.setItem('carMarketCart', JSON.stringify([]));
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('carMarketCart', JSON.stringify(cart));
}

function getStoredOrders() {
  const saved = localStorage.getItem('carMarketOrders');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (error) {
    localStorage.setItem('carMarketOrders', JSON.stringify([]));
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem('carMarketOrders', JSON.stringify(orders));
}

function parsePrice(price) {
  return Number(price.replace(/[^\d]/g, '')) || 0;
}

function formatPrice(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
}

function updateCartCount() {
  const count = getStoredCart().reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = count;
}

function addToCart(carId) {
  const cars = getStoredCars();
  const car = cars.find(item => item.id === carId);
  if (!car) return;
  const cart = getStoredCart();
  const existing = cart.find(item => item.carId === carId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      cartId: `cart-${carId}`,
      carId,
      name: car.name,
      price: car.price,
      priceValue: parsePrice(car.price),
      image: car.image,
      quantity: 1
    });
  }
  saveCart(cart);
  renderCartItems();
  updateCartCount();
  showFormAlert('cart-alert', `Đã thêm "${car.name}" vào giỏ hàng.`);
}

function changeCartItemQuantity(carId, delta) {
  const cart = getStoredCart();
  const item = cart.find(i => i.carId === carId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) {
    const index = cart.findIndex(i => i.carId === carId);
    if (index !== -1) cart.splice(index, 1);
  }
  saveCart(cart);
  renderCartItems();
  updateCartCount();
}

function removeCartItem(carId) {
  const cart = getStoredCart().filter(item => item.carId !== carId);
  saveCart(cart);
  renderCartItems();
  updateCartCount();
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  const checkout = document.getElementById('checkout-button');
  if (!container) return;
  const cart = getStoredCart();
  if (!cart.length) {
    container.innerHTML = '<div class="card p-4 text-center text-muted">Giỏ hàng trống.</div>';
    if (checkout) checkout.setAttribute('disabled', 'disabled');
    if (summary) summary.innerHTML = '';
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  container.innerHTML = cart.map(item => `
    <div class="card p-3 mb-3">
      <div class="row gx-3 align-items-center">
        <div class="col-auto">
          <img src="${item.image}" alt="${item.name}" class="rounded-3" style="width:130px; height:85px; object-fit:cover;">
        </div>
        <div class="col">
          <h5 class="mb-1">${item.name}</h5>
          <p class="text-muted mb-1">${item.price}</p>
          <p class="mb-1">Số lượng: <strong>${item.quantity}</strong></p>
        </div>
        <div class="col-auto text-end">
          <button type="button" class="btn btn-sm btn-outline-secondary cart-action mb-2" data-action="increase" data-car-id="${item.carId}">+</button>
          <button type="button" class="btn btn-sm btn-outline-secondary cart-action mb-2" data-action="decrease" data-car-id="${item.carId}">-</button>
          <button type="button" class="btn btn-sm btn-outline-danger cart-action" data-action="remove" data-car-id="${item.carId}">Xóa</button>
        </div>
      </div>
    </div>
  `).join('');
  if (checkout) checkout.removeAttribute('disabled');
  if (summary) summary.innerHTML = `<h5 class="fw-semibold">Tổng: ${formatPrice(total)}</h5>`;
}

function setupCartUI() {
  const carGrid = document.getElementById('car-grid');
  if (carGrid) {
    carGrid.addEventListener('click', event => {
      const button = event.target.closest('button.add-cart-button');
      if (!button) return;
      const carId = button.dataset.carId;
      if (carId) addToCart(carId);
    });
  }

  const cartItems = document.getElementById('cart-items');
  if (cartItems) {
    cartItems.addEventListener('click', event => {
      const button = event.target.closest('button.cart-action');
      if (!button) return;
      const action = button.dataset.action;
      const carId = button.dataset.carId;
      if (!carId) return;
      if (action === 'increase') changeCartItemQuantity(carId, 1);
      if (action === 'decrease') changeCartItemQuantity(carId, -1);
      if (action === 'remove') removeCartItem(carId);
    });
  }

  const checkout = document.getElementById('checkout-button');
  if (checkout) {
    checkout.addEventListener('click', () => {
      const cart = getStoredCart();
      if (!cart.length) {
        showFormAlert('cart-alert', 'Giỏ hàng trống, vui lòng thêm xe trước khi thanh toán.', 'warning');
        return;
      }

      const nameInput = document.getElementById('checkout-name');
      const phoneInput = document.getElementById('checkout-phone');
      const emailInput = document.getElementById('checkout-email');
      const addressInput = document.getElementById('checkout-address');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const address = addressInput ? addressInput.value.trim() : '';

      if (!name || !phone || !email || !address) {
        showFormAlert('cart-alert', 'Vui lòng nhập đầy đủ thông tin khách hàng trước khi thanh toán.', 'danger');
        return;
      }

      const orders = getStoredOrders();
      orders.unshift({
        orderId: `order-${Date.now()}`,
        customer: { name, phone, email, address },
        items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
        total: cart.reduce((sum, item) => sum + item.priceValue * item.quantity, 0),
        submitted: new Date().toLocaleString()
      });
      saveOrders(orders);
      saveCart([]);
      renderCartItems();
      updateCartCount();
      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
      if (emailInput) emailInput.value = '';
      if (addressInput) addressInput.value = '';
      showFormAlert('cart-alert', 'Thanh toán thành công. Cảm ơn bạn đã mua hàng!', 'success');
    });
  }

  updateCartCount();
  renderCartItems();
}

function saveInquiries(inquiries) {
  localStorage.setItem('carMarketInquiries', JSON.stringify(inquiries));
}

function showFormAlert(containerId, message, type = 'success') {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function showContactAlert(message, type = 'success') {
  showFormAlert('contact-alert', message, type);
}

function showCarContactAlert(message, type = 'success') {
  showFormAlert('car-contact-alert', message, type);
}

function setupCustomerContactForm() {
  const form = document.getElementById('customer-contact-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const message = document.getElementById('customer-message').value.trim();

    if (!name || !phone || !email || !message) {
      showContactAlert('Vui lòng điền đầy đủ thông tin.', 'danger');
      return;
    }

    const inquiries = getStoredInquiries();
    inquiries.unshift({
      id: `inquiry-${Date.now()}`,
      name,
      phone,
      email,
      message,
      type: 'general',
      submitted: new Date().toLocaleString()
    });
    saveInquiries(inquiries);
    form.reset();
    showContactAlert('Yêu cầu đã được gửi. Chúng tôi sẽ liên hệ lại sớm.', 'success');
  });
}

function setupCarDetailForm(car) {
  const form = document.getElementById('car-detail-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('car-detail-name').value.trim();
    const phone = document.getElementById('car-detail-phone').value.trim();
    const email = document.getElementById('car-detail-email').value.trim();
    const message = document.getElementById('car-detail-message').value.trim();

    if (!name || !phone || !email || !message) {
      showCarContactAlert('Vui lòng điền đầy đủ thông tin.', 'danger');
      return;
    }

    const inquiries = getStoredInquiries();
    inquiries.unshift({
      id: `inquiry-${Date.now()}`,
      carId: car.id,
      carName: car.name,
      name,
      phone,
      email,
      message,
      type: 'detail',
      submitted: new Date().toLocaleString()
    });
    saveInquiries(inquiries);

    form.reset();
    showCarContactAlert('Yêu cầu tư vấn đã được gửi. Chúng tôi sẽ liên hệ lại sớm.', 'success');
  });
}

function renderAdminInquiries() {
  const inquiryList = document.getElementById('customer-inquiries');
  if (!inquiryList) return;
  const inquiries = getStoredInquiries();
  if (!inquiries.length) {
    inquiryList.innerHTML = '<div class="col-12"><div class="card p-4 text-center text-muted">Chưa có yêu cầu khách hàng.</div></div>';
    return;
  }

  inquiryList.innerHTML = inquiries.map(item => `
    <div class="col-12">
      <div class="card p-4">
        <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h5 class="mb-1">${item.name}</h5>
            <p class="mb-1 text-muted">${item.email} • ${item.phone}</p>
            <p class="mb-1 text-muted">${item.carName ? `Xe: ${item.carName}` : 'Yêu cầu chung'}</p>
            <p class="mb-0"><strong>Gửi:</strong> ${item.submitted}</p>
          </div>
          <div>
            <span class="badge bg-primary">${item.type === 'detail' ? 'Chi tiết xe' : 'Trang chủ'}</span>
          </div>
        </div>
        <div>
          <p class="mb-0">${item.message}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderAdminOrders() {
  const orderContainer = document.getElementById('order-history');
  if (!orderContainer) return;
  const orders = getStoredOrders();
  if (!orders.length) {
    orderContainer.innerHTML = '<div class="col-12"><div class="card p-4 text-center text-muted">Chưa có đơn hàng nào.</div></div>';
    return;
  }

  orderContainer.innerHTML = orders.map(order => `
    <div class="col-12">
      <div class="card p-4">
        <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h5 class="mb-1">Đơn hàng: ${order.orderId}</h5>
            <p class="mb-1 text-muted">Khách: ${order.customer.name} • ${order.customer.phone}</p>
            <p class="mb-1 text-muted">Email: ${order.customer.email}</p>
            <p class="mb-1 text-muted">Địa chỉ: ${order.customer.address}</p>
            <p class="mb-0"><strong>Ngày:</strong> ${order.submitted}</p>
          </div>
          <div class="text-end">
            <span class="badge bg-success">Tổng: ${formatPrice(order.total)}</span>
          </div>
        </div>
        <div>
          <h6>Chi tiết sản phẩm:</h6>
          <ul class="mb-0">
            ${order.items.map(item => `<li>${item.name} x${item.quantity} - ${item.price}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCarDetail() {
  const detailContainer = document.getElementById('car-detail');
  if (!detailContainer) return;
  const carId = getQueryParam('id');
  const cars = getStoredCars();
  const car = cars.find(item => item.id === carId);
  if (!car) {
    detailContainer.innerHTML = '<div class="alert alert-warning">Không tìm thấy thông tin xe.</div>';
    return;
  }

  const highlightList = car.highlights.map(item => `<li>${item}</li>`).join('');
  const specList = car.specs.map(item => `<li>${item}</li>`).join('');

  detailContainer.innerHTML = `
    <div class="row g-4 align-items-center">
      <div class="col-lg-6">
        <img src="${car.image}" alt="${car.name}" class="img-fluid rounded shadow-sm">
      </div>
      <div class="col-lg-6">
        <h1 class="fw-bold">${car.name}</h1>
        <p class="text-muted mb-1">${car.model}</p>
        <h3 class="price-tag">${car.price}</h3>
        <p class="mt-3">${car.description}</p>
        <div class="mb-3">
          <h5 class="fw-semibold">Những điểm nổi bật</h5>
          <ul>${highlightList}</ul>
        </div>
        <div>
          <h5 class="fw-semibold">Thông số kỹ thuật</h5>
          <ul>${specList}</ul>
        </div>
        <a href="index.html" class="btn btn-outline-secondary mt-3">Quay về danh sách</a>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-12">
        <div class="card bg-light shadow-sm">
          <div class="card-body">
            <h4 class="mb-4">Nhận tư vấn cho ${car.name}</h4>
            <div id="car-contact-alert"></div>
            <form id="car-detail-form">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Họ và tên</label>
                  <input type="text" id="car-detail-name" class="form-control" placeholder="Nguyễn Văn A" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Số điện thoại</label>
                  <input type="tel" id="car-detail-phone" class="form-control" placeholder="0909123456" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Email</label>
                  <input type="email" id="car-detail-email" class="form-control" placeholder="name@example.com" required>
                </div>
                <div class="col-12">
                  <label class="form-label">Yêu cầu</label>
                  <textarea id="car-detail-message" class="form-control" rows="3" placeholder="Tôi cần tư vấn..." required></textarea>
                </div>
                <div class="col-12 text-end">
                  <button class="btn btn-primary" type="submit">Gửi tư vấn</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  setupCarDetailForm(car);
}

function showLoginMessage(message, type = 'danger') {
  const box = document.getElementById('login-alert');
  if (!box) return;
  box.innerHTML = `<div class="alert alert-${type} py-2">${message}</div>`;
}

function handleLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  function processLogin(event) {
    if (event) event.preventDefault();

    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showLoginMessage('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }

    if (username === adminCredentials.username && password === adminCredentials.password) {
      sessionStorage.setItem('carMarketUser', 'admin');
      window.location.href = 'admin.html';
      return;
    }

    if (username === 'user' && password === 'user123') {
      sessionStorage.setItem('carMarketUser', 'customer');
      window.location.href = 'index.html';
      return;
    }

    showLoginMessage('Tên đăng nhập hoặc mật khẩu không đúng.');
  }

  form.addEventListener('submit', processLogin);
}

function setupAdminPage() {
  const adminStatus = document.getElementById('admin-status');
  if (!adminStatus) return;
  const addForm = document.getElementById('car-add-form');
  const carList = document.getElementById('admin-car-list');
  const inquiryList = document.getElementById('customer-inquiries');
  const logoutButton = document.getElementById('logout-button');
  const saveButton = document.getElementById('save-car-button');
  const cancelEditButton = document.getElementById('cancel-edit-button');
  const nameInput = document.getElementById('car-name');
  const modelInput = document.getElementById('car-model');
  const priceInput = document.getElementById('car-price');
  const imageInput = document.getElementById('car-image');
  const categoryInput = document.getElementById('car-category');
  const descriptionInput = document.getElementById('car-description');
  const highlightsInput = document.getElementById('car-highlights');
  const specsInput = document.getElementById('car-specs');
  let editingCarId = null;

  const user = sessionStorage.getItem('carMarketUser');
  if (user !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  if (adminStatus) {
    adminStatus.textContent = 'Xin chào Admin';
  }

  function resetCarForm() {
    editingCarId = null;
    if (addForm) addForm.reset();
    if (saveButton) saveButton.textContent = 'Thêm xe';
    if (cancelEditButton) cancelEditButton.style.display = 'none';
  }

  function populateCarForm(car) {
    editingCarId = car.id;
    if (nameInput) nameInput.value = car.name;
    if (modelInput) modelInput.value = car.model;
    if (priceInput) priceInput.value = car.price;
    if (imageInput) imageInput.value = car.image;
    if (categoryInput) categoryInput.value = car.category || 'sport';
    if (descriptionInput) descriptionInput.value = car.description || '';
    if (highlightsInput) highlightsInput.value = car.highlights ? car.highlights.join(' | ') : '';
    if (specsInput) specsInput.value = car.specs ? car.specs.join(' | ') : '';
    if (saveButton) saveButton.textContent = 'Lưu thay đổi';
    if (cancelEditButton) cancelEditButton.style.display = 'inline-flex';
  }

  function renderAdminCars() {
    if (!carList) return;
    const cars = getStoredCars();
    if (!cars.length) {
      carList.innerHTML = '<div class="col-12"><div class="card p-4 text-center text-muted">Chưa có xe nào.</div></div>';
      return;
    }

    carList.innerHTML = cars.map(car => `
      <div class="col-md-6">
        <div class="card mb-3 shadow-sm">
          <div class="row g-0 align-items-center">
            <div class="col-5">
              <img src="${car.image}" class="img-fluid rounded-start" alt="${car.name}">
            </div>
            <div class="col-7">
              <div class="card-body">
                <h5 class="card-title mb-1">${car.name}</h5>
                <p class="mb-1 text-muted">${car.model} • ${car.category === 'electric' ? 'Xe điện' : car.category === 'sport' ? 'Thể thao' : 'Sedan'}</p>
                <p class="mb-2 text-primary fw-semibold">${car.price}</p>
                <div class="d-flex gap-2 flex-wrap">
                  <button class="btn btn-sm btn-outline-secondary" data-action="edit" data-car-id="${car.id}">Sửa</button>
                  <button class="btn btn-sm btn-outline-danger" data-action="delete" data-car-id="${car.id}">Xóa</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    carList.querySelectorAll('button[data-car-id]').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-car-id');
        const action = button.getAttribute('data-action');
        if (action === 'delete') {
          const cars = getStoredCars().filter(item => item.id !== id);
          saveCars(cars);
          renderAdminCars();
          return;
        }
        if (action === 'edit') {
          const cars = getStoredCars();
          const car = cars.find(item => item.id === id);
          if (car) populateCarForm(car);
        }
      });
    });
  }

  if (addForm) {
    addForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = nameInput.value.trim();
      const model = modelInput.value.trim();
      const price = priceInput.value.trim();
      const image = imageInput.value.trim();
      const category = categoryInput.value;
      const description = descriptionInput.value.trim();
      const highlights = highlightsInput.value.trim();
      const specs = specsInput.value.trim();

      if (!name || !model || !price || !image) {
        return;
      }

      const cars = getStoredCars();
      if (editingCarId) {
        const carIndex = cars.findIndex(item => item.id === editingCarId);
        if (carIndex !== -1) {
          cars[carIndex] = {
            ...cars[carIndex],
            name,
            model,
            price,
            image,
            category,
            description: description || cars[carIndex].description,
            highlights: highlights ? highlights.split('|').map(item => item.trim()).filter(Boolean) : cars[carIndex].highlights,
            specs: specs ? specs.split('|').map(item => item.trim()).filter(Boolean) : cars[carIndex].specs
          };
          saveCars(cars);
          resetCarForm();
          renderAdminCars();
          return;
        }
      }

      const newCar = {
        id: `car-${Date.now()}`,
        name,
        model,
        price,
        category,
        image,
        description: description || 'Xe mới được thêm bởi admin.',
        highlights: highlights ? highlights.split('|').map(item => item.trim()).filter(Boolean) : ['Thông tin chi tiết sẽ được cập nhật'],
        specs: specs ? specs.split('|').map(item => item.trim()).filter(Boolean) : ['Thông số sẽ được cập nhật']
      };

      cars.unshift(newCar);
      saveCars(cars);
      addForm.reset();
      renderAdminCars();
    });
  }

  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', () => {
      resetCarForm();
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem('carMarketUser');
      window.location.href = 'login.html';
    });
  }

  renderAdminCars();
  renderAdminInquiries();
  renderAdminOrders();
}

function initPage() {
  renderCarCards();
  setupSearchAndFilter();
  setupCustomerContactForm();
  renderCartUI();
  renderCarDetail();
  handleLoginForm();
  setupAdminPage();
}

function renderCartUI() {
  const cartSection = document.getElementById('cart');
  if (!cartSection) return;
  setupCartUI();
}

document.addEventListener('DOMContentLoaded', initPage);
