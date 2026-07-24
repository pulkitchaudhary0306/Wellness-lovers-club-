# AntigravityB Headless REST API Documentation

All endpoints register under the base WordPress REST API prefix `/wp-json/agb/v1/`.

---

## 1. Authentication Endpoints

### User Login (`POST /login`)
*   **Request Headers**: `Content-Type: application/json`
*   **Request Body**:
    ```json
    {
      "username": "user@example.com",
      "password": "userpass123"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "token": "JWT_HEADER.PAYLOAD.SIGNATURE",
      "refresh_token": "",
      "user": {
        "id": "123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com",
        "avatar": "https://avatar-url.com"
      }
    }
    ```
*   **Error Response (401 Unauthorized)**:
    ```json
    {
      "success": false,
      "message": "Invalid username or password",
      "code": 401
    }
    ```

### User Registration (`POST /register`)
*   **Request Body**:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "password": "userpass123",
      "phone": "+12345678",
      "company": "Company Inc",
      "address": "123 Street name",
      "city": "Boston",
      "country": "US",
      "bio": "Developer bio"
    }
    ```
*   **Success Response (201 Created)**: Returns the user JWT token and mapped profile object (similar to Login).

### Forgot Password (`POST /forgot-password`)
*   **Request Body**:
    ```json
    {
      "email": "user@example.com"
    }
    ```

### Reset Password (`POST /reset-password`)
*   **Request Body**:
    ```json
    {
      "key": "reset_key_from_email",
      "login": "username_login",
      "password": "new_password"
    }
    ```

---

## 2. Content & Integrations Endpoints

### Get Pages (`GET /pages`)
*   **Query Parameters**: `page` (default 1), `perPage` (default 10), `search` (optional)
*   **Response Shape**:
    ```json
    {
      "items": [
        {
          "id": 2,
          "title": "Sample Page",
          "slug": "sample-page",
          "content": "Page content body..."
        }
      ],
      "total": 1,
      "totalPages": 1,
      "page": 1,
      "perPage": 10
    }
    ```

### Contact Form Submit (`POST /contact`)
*   **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "message": "I would like to enquire about your services.",
      "website": "" // Honeypot spam protection (keep blank)
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Your message has been successfully received."
    }
    ```

### Newsletter Subscribe (`POST /newsletter`)
*   **Request Body**:
    ```json
    {
      "email": "subscriber@example.com"
    }
    ```
