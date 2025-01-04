# Backend API Documentation

## **Register User** -

### Overview

This API handles the registration of new users for the application.

---

### Endpoints

- ### URL: `/api/v1/users/register`
- ### Method: `POST`

---

### Request Body:

The request body should be in JSON format and include the following fields:

```json
{
  "fullname": {
    "firstname": "test_firstname",
    "lastname": "test_laststname"
  },
  "email": "test@test.com",
  "password": "securepassword"
}
```

---

### **Validation Rules**

| Field                | Rules                     | Error Message                                   |
| -------------------- | ------------------------- | ----------------------------------------------- |
| `email`              | Must be a valid email     | "Invalid email"                                 |
| `fullname.firstname` | Minimum 2 characters long | "First name must be at least 2 characters long" |
| `password`           | Minimum 6 characters long | "Password must be at least 6 characters long"   |

---

### Example Response:

- **Success (200) -**

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "64c1234abcd567ef9012gh34",
    "fullname": {
      "firstname": "test_firstname",
      "lastname": "test_laststname"
    },
    "email": "test@test.com"
  }
}
```

- **Error response (400)**

```json
{
  "error": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be at least 2 characters long.",
      "param": "fullname.firstname",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long.",
      "param": "password",
      "location": "body"
    }
  ]
}
```

- **Error response (500)**

```json
{
  "message": "Internal Server Error"
}
```

### **Error Handling**

- **Validation Errors:** A `400` status is returned with a list of validation errors.
- **Missing Fields or Server Issues:** A `500` status is returned with an appropriate message.

---

### **Behavior**

1. Validates the incoming request using `express-validator`.
2. Hashes the user's password securely using `bcrypt`.
3. Saves the user to the database using the `createUser` service.
4. Generates a JWT token using `jsonwebtoken`.
5. Returns the user object (excluding the password) and the JWT token.

---

## **Login User** -

### Overview

This API handles user authentication and login for the application. Users can log in with their registered email and password to receive an authentication token.

---

### Endpoints

- ### URL: `/api/v1/users/login`
- ### Method: `POST`

---

### Request Body:

The request body should be in JSON format and include the following fields:

```json
{
  "email": "test@test.com",
  "password": "securepassword"
}
```

---

### **Validation Rules**

| Field      | Rules                     | Error Message                                 |
| ---------- | ------------------------- | --------------------------------------------- |
| `email`    | Must be a valid email     | "Invalid email"                               |
| `password` | Minimum 6 characters long | "Password must be at least 6 characters long" |

---

### Example Response:

- **Success (200) -**

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "64c1234abcd567ef9012gh34",
    "fullname": {
      "firstname": "test_firstname",
      "lastname": "test_lastname"
    },
    "email": "test@test.com"
  }
}
```

- **Error response (400)**

```json
{
  "error": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long.",
      "param": "password",
      "location": "body"
    }
  ]
}
```

- **Error response (401)**

```json
{
  "message": "Invalid email or password"
}
```

- **Error response (500)**

```json
{
  "message": "Internal Server Error"
}
```

### **Error Handling**

- **Validation Errors:** A `400` status is returned with a list of validation errors.
- **Authentication Errors:** A `401` status is returned if the email or password is incorrect.
- **Server Errors:** A `500` status is returned with an appropriate message in case of server-side issues..

---

### **Behavior**

1. Validates the incoming request using `express-validator`.
2. Retrieves the user from the database by email.
3. Compares the provided password with the hashed password stored in the database using `bcrypt`.
4. If the email and password are valid:

- Generates a JWT token using jsonwebtoken.
- Returns the token and user details (excluding the password).

5. If validation or authentication fails, returns the appropriate error response.

---

### **Authentication Token**

- The generated JWT token is also set as an HTTP-only cookie to enhance security.
- Options for the cookie include:
  - `httpOnly`: Prevents JavaScript from accessing the cookie.
  - `secure`: Ensures the cookie is sent only over HTTPS (enabled in production).

---

## **Logout User** -

### Overview

This API allows authenticated users to log out of the application by invalidating their JWT token and removing it from the client-side cookies. Blacklisted tokens are stored to prevent reuse.

---

### Endpoints

- ### URL: `/api/v1/users/logout`
- ### Method: `GET`
- ### Authentication Required: Yes

---

### **Headers**

| Key             |     | Value                                           |
| --------------- | --- | ----------------------------------------------- |
| `Authorization` |     | Bearer `<your_authentication_token>  `          |
| `Cookie`        |     | `"Password must be at least 6 characters long"` |

---

### Example Response:

- **Success (200) -**

```json
{
  "message": "Logged out"
}
```

- **Error response (401) - Unauthorized**

```json
{
  "message": "Unauthorized."
}
```

- **Error response (500)**

```json
{
  "message": "Invalid token"
}
```

### **Error Handling**

- **Unauthorized Access:** A `401` status is returned if the user provides no token or an invalid token..
- **Authentication Errors:** A `401` status is returned if the email or password is incorrect.
- **Invalid Token:** If the token is invalid or blacklisted, the API will return an error with a `401` or `500` status depending on the context.

---

### **Behavior**

1. **Token Validation:**

   - Checks for the presence of a valid token in cookies or the `Authorization` header.

   - Verifies the token using `jsonwebtoken` and checks if the token is blacklisted.

2. **Token Blacklisting:**
   - Adds the token to the `BlacklistToken` collection in the database with an expiration of 24 hours.
3. **Cookie Removal:**
   - Clears the `token` cookie from the client.
4. **Response:**
   - Returns a success message confirming the logout.

---

### **Security Considerations**

- **HTTP-only Cookies:** The token is stored in an HTTP-only cookie, minimizing the risk of XSS attacks.

- **Token Blacklisting:** Ensures that even if a token is intercepted, it cannot be reused after logout.

- **Token Expiry:** Blacklisted tokens expire automatically after 24 hours to maintain database performance.

---

## **User Profile** -

### Overview

Retrieves the profile information of the currently authenticated user.

---

### Endpoints

- ### URL: `/api/v1/users/profile`
- ### Method: `GET`
- ### Authentication Required: Yes

---

### **Authentication**

- Requires a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

---

### Example Response:

- **Success (200) -**

```json
{
  "fullname": {
    "firstname": "test_first",
    "lastname": "test_last"
  },
  "email": "test@gmail.com"
}
```

- **Error response (401) - Unauthorized**

```json
{
  "message": "Unauthorized."
}
```

- **Error response (500)**

```json
{
  "message": "Invalid token"
}
```

### **Error Handling**

- **Unauthorized Access:** A `401` status is returned if the user provides no token or an invalid token..
- **Authentication Errors:** A `401` status is returned if the email or password is incorrect.
- **Invalid Token:** If the token is invalid or blacklisted, the API will return an error with a `401` or `500` status depending on the context.

---
