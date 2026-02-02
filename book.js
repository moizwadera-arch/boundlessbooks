// Book data
const books = [
    {
        id: 1,
        title: "Ugly Love",
        author: "Colleen Hoover",
        description: "A heart-wrenching love story that tells the tale of Tate Collins and Miles Archer. When love gets ugly, the line between right and wrong starts to blur in this unforgettable romance.",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "The Alchemist",
        author: "Paulo Coelho",
        description: "A magical fable about following your dreams. Santiago's journey teaches us about listening to our hearts and recognizing opportunity.",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "A Thousand Splendid Suns",
        author: "Khaled Hosseini",
        description: "A breathtaking story set against the volatile events of Afghanistan's last thirty years. An unforgettable portrait of a wounded country and its people.",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        title: "The Forty Rules of Love",
        author: "Elif Shafak",
        description: "A novel within a novel that tells the story of Ella Rubenstein and her transformative journey through the teachings of Rumi and his companion Shams of Tabriz.",
        price: 15.49,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        title: "The Trial",
        author: "Franz Kafka",
        description: "A terrifying psychological trip into the life of Joseph K., who wakes up one morning to find himself arrested for a crime he did not commit.",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('boundlessbooks_cart')) || [];

// DOM Elements
const booksGrid = document.getElementById('booksGrid');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const emptyCart = document.getElementById('emptyCart');
const checkoutBtn = document.getElementById('checkoutBtn');

// Display books
function displayBooks(booksArray) {
    booksGrid.innerHTML = '';
    
    booksArray.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        bookCard.innerHTML = `
            <div class="book-image" style="background-image: url('${book.image}')"></div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-price">
                    <span class="price">$${book.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${book.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        booksGrid.appendChild(bookCard);
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = parseInt(e.target.closest('.add-to-cart').dataset.id);
            addToCart(bookId);
        });
    });
}

// Add to cart function
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    
    // Check if book already in cart
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...book,
            quantity: 1
        });
    }
    
    // Update localStorage
    localStorage.setItem('boundlessbooks_cart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartUI();
    
    // Show confirmation
    showNotification(`${book.title} added to cart!`);
}

// Remove from cart function
function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    
    // Update localStorage
    localStorage.setItem('boundlessbooks_cart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartUI();
    
    // Show notification
    showNotification('Item removed from cart');
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal if open
    if (cartModal.style.display === 'flex') {
        renderCartItems();
    }
}

// Render cart items in modal
function renderCartItems() {
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.innerHTML = '';
        cartTotal.textContent = '0.00';
        return;
    }
    
    emptyCart.style.display = 'none';
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.author}</p>
                    <p>Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = parseInt(e.target.closest('.cart-item-remove').dataset.id);
            removeFromCart(bookId);
        });
    });
}

// Search functionality
function searchBooks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayBooks(books);
        return;
    }
    
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
    );
    
    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = '<p class="no-results">No books found matching your search.</p>';
    } else {
        displayBooks(filteredBooks);
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#2c3e50';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.zIndex = '3000';
    notification.style.fontWeight = '500';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// WhatsApp checkout function
function checkoutViaWhatsApp() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    let message = `Hello BOUNDLESSBOOKS! I would like to order the following books:%0A%0A`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.title} by ${item.author} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0ATotal: $${total.toFixed(2)}%0A%0APlease contact me for delivery details.`;
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/923377068531?text=${message}`, '_blank');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Display books on page load
    displayBooks(books);
    
    // Update cart count on page load
    updateCartUI();
    
    // Search functionality
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchBooks();
        }
    });
    
    // Cart modal functionality
    document.querySelector('a[href="#cart"]').addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'flex';
        renderCartItems();
    });
    
    document.querySelector('.close-cart').addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Close cart modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', checkoutViaWhatsApp);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#cart') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
