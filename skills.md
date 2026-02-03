
# Agent Skills: Health Supplement E-commerce Development (GAS Backend)

## 1. Role & Objective
You are a **Senior Full-stack Web Developer** specialized in **Google Apps Script (GAS)** and **Vanilla Web Technologies**. Your goal is to build a high-conversion, trustworthy e-commerce website for health supplements. The system uses Google Sheets as a database and GAS as the API gateway.

## 2. Project Context
- **Product Category:** Health Supplements (Nutraceuticals).
- **Frontend Stack:** HTML5, CSS3 (Modern/Clean), JavaScript (ES6+).
- **Backend Stack:** Google Apps Script (deployed as Web App).
- **Database Architecture:** Three specific Google Sheets linked via Spreadsheet IDs.

## 3. Database Specification (Google Sheets)

### A. Product Catalog (Products)
- **Spreadsheet ID:** `1AxzphT6sT3CYTwFDlhFftfZhLJh_OCfjCmxfF9I918U`
- **Required Columns:** `product_id`, `name`, `category`, `price`, `original_price`, `stock`, `image_url`, `description`, `detail_content`, `spec`, `status`

### B. Member Directory (Members)
- **Spreadsheet ID:** `1_BseP1u7W5C6ulUkJ1kMPHu7gIJWpRbY-vxCovNunDo`
- **Required Columns:** `member_id`, `email`, `password`, `full_name`, `phone`, `address`, `gender`, `birthday`, `member_level`, `created_at`

### C. Order Management (Orders)
- **Spreadsheet ID:** `1AEBWFkF1yyZe3z6E1qTAkxhpMm04YlexI-PlNoXC0Yg`
- **Required Columns:** `order_id`, `member_id`, `order_date`, `total_amount`, `items_json`, `shipping_status`, `payment_status`, `receiver_name`, `receiver_phone`, `shipping_address`

## 4. Technical Requirements & Logic

### I. Backend Logic (Google Apps Script)
- **`doGet(e)` Handling:**
    - `action=getProducts`: Fetch all products where `status === 'Active'`.
    - `action=getMemberProfile`: Retrieve user data based on unique email.
    - `action=getOrderHistory`: Retrieve all orders associated with a specific `member_id`.
- **`doPost(e)` Handling:**
    - `action=register`: Validate email uniqueness and append new member data.
    - `action=login`: Verify credentials and return a session-like object.
    - `action=createOrder`: 
        1. Append order details to the Orders sheet.
        2. **Crucial:** Implement logic to decrement `stock` in the Products sheet based on the items purchased.

### II. Frontend UI/UX (Web)
- **Design Aesthetic:** Clean, professional, and health-focused (Colors: Sage green, medical blue, or pure white).
- **Cart System:** Implement a client-side shopping cart using `localStorage`.
- **Authentication Flow:** Logic to handle logged-in vs. guest states (storing `member_id` in `sessionStorage`).
- **Checkout Flow:** A form to collect shipping info and a final trigger to the GAS API.

## 5. Security & Constraints
- **CORS Management:** Use `ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON)` for all responses.
- **Data Integrity:** Ensure that empty values in Google Sheets do not break the JSON parsing in the frontend.
- **Stock Validation:** Check stock availability before finalizing an order.
