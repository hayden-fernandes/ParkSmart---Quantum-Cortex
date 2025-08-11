# API_CONTRACT.md

## Problem Statement

Urban drivers often spend **15-30 minutes** searching for a parking spot in busy city areas.  
This leads to:
- Wasted time and driver frustration.
- Extra fuel burned, increasing carbon emissions and air pollution.
- Circling vehicles adding significantly to city traffic congestion.

Our **SmartPark** web application aims to solve this by helping users quickly find and reserve available parking spots in real time.

---

## Application Features

1. **User Registration & Login** – Users can sign up and log in securely.
2. **Search Parking Spots** – View available parking spots based on location.
3. **Reserve a Parking Spot** – Book a spot in advance.
4. **Release Parking Spot** – Free up a spot when leaving.
5. **View Reservation History** – Users can see their past bookings.
6. **Admin Management** – Admin can add, update, or remove parking spots.

---

## Data Models

**User**

{
  "id": "integer",
  
  "username": "string",
  
  "email": "string",
  
  "password": "string (hashed)",
  
  "role": "string (user/admin)"
}

**Parking-spot**

{
  "id": "integer",
  
  "location": "string",
  
  "latitude": "float",
  
  "longitude": "float",
  
  "status": "string (available/reserved)",
  
  "price_per_hour": "float"
}

**Reservation**

{
  "id": "integer",
  
  "user_id": "integer",
  
  "parking_spot_id": "integer",
  
  "start_time": "datetime",
  
  "end_time": "datetime",
  
  "total_cost": "float"
}

---

**1. Register User**  
Feature: User Registration  
Method: POST  
Endpoint: /api/users/register  
Description: Registers a new user.

Request Body:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Success Response (201 Created):
{
  "message": "User registered successfully",
  "user_id": 1
}

Error Response (400 Bad Request):
{
  "error": "Email already exists"
}

---

**2. Login User**  
Feature: User Login  
Method: POST  
Endpoint: /api/users/login  
Description: Logs in a user and returns a token.

Request Body:
{
  "email": "string",
  "password": "string"
}

Success Response (200 OK):
{
  "token": "jwt_token",
  "user_id": 1
}

Error Response (401 Unauthorized):
{
  "error": "Invalid email or password"
}

---

**3. Get Available Parking Spots**  
Feature: Search Parking Spots  
Method: GET  
Endpoint: /api/parkingspots  
Description: Retrieves all available parking spots.

Success Response (200 OK):
[
  {
    "id": 1,
    "location": "Downtown Street 5",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "status": "available",
    "price_per_hour": 5.0
  }
]

Error Response (404 Not Found):
{
  "error": "No parking spots found"
}

---

**4. Reserve a Parking Spot**  
Feature: Reserve Parking  
Method: POST  
Endpoint: /api/reservations  
Description: Reserves a parking spot for a user.

Request Body:
{
  "user_id": 1,
  "parking_spot_id": 3,
  "start_time": "2025-08-08T10:00:00",
  "end_time": "2025-08-08T12:00:00"
}

Success Response (201 Created):
{
  "message": "Reservation successful",
  "reservation_id": 10
}

Error Response (400 Bad Request):
{
  "error": "Parking spot not available"
}

---

**5. Release Parking Spot**  
Feature: Release Spot  
Method: PUT  
Endpoint: /api/reservations/{id}/release  
Description: Marks a reserved spot as available again.

Success Response (200 OK):
{
  "message": "Parking spot released successfully"
}

Error Response (404 Not Found):
{
  "error": "Reservation not found"
}

---

**6. View Reservation History**  
Feature: User Booking History  
Method: GET  
Endpoint: /api/users/{id}/reservations  
Description: Gets all past reservations for a user.

Success Response (200 OK):
[
  {
    "reservation_id": 5,
    "parking_spot": "Downtown Street 5",
    "start_time": "2025-08-01T10:00:00",
    "end_time": "2025-08-01T12:00:00",
    "total_cost": 10.0
  }
]

Error Response (404 Not Found):
{
  "error": "No reservations found"
}

---

**7. Admin - Add Parking Spot**  
Feature: Admin Add Spot  
Method: POST  
Endpoint: /api/admin/parkingspots  
Description: Adds a new parking spot.

Request Body:
{
  "location": "Downtown Street 7",
  "latitude": 40.7130,
  "longitude": -74.0070,
  "status": "available",
  "price_per_hour": 6.0
}

Success Response (201 Created):
{
  "message": "Parking spot added successfully",
  "parking_spot_id": 7
}

Error Response (400 Bad Request):
{
  "error": "Invalid data"
}
