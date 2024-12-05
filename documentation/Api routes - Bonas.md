# API routes 

Yes, to interact with a MySQL database for your classified listing website, you'll need an API to handle data retrieval, updates, and other operations. Here’s a basic outline of how you can structure the API for the Obilli project:

### API Structure for Obilli**

#### 1. **Authentication and User Management**

- **Register User**
  - **Endpoint:** `POST /api/users/register`
  - **Request Body:** `{ "username": "string", "email": "string", "password": "string", "phone_number": "string", "address": "string", "date_of_birth": "YYYY-MM-DD", "gender": "string", "interests": "string", "preferred_categories": "string" }`
  - **Response:** `{ "user_id": "int", "message": "User registered successfully" }`

- **Login User**
  - **Endpoint:** `POST /api/users/login`
  - **Request Body:** `{ "username": "string", "password": "string" }`
  - **Response:** `{ "token": "string", "user_id": "int", "message": "Login successful" }`

- **Get User Profile**
  - **Endpoint:** `GET /api/users/{user_id}`
  - **Headers:** `{ "Authorization": "Bearer token" }`
  - **Response:** `{ "user_id": "int", "username": "string", "email": "string", "phone_number": "string", "address": "string", "date_of_birth": "YYYY-MM-DD", "gender": "string", "interests": "string", "preferred_categories": "string" }`

- **Update User Profile**
  - **Endpoint:** `PUT /api/users/{user_id}`
  - **Request Body:** `{ "phone_number": "string", "address": "string", "date_of_birth": "YYYY-MM-DD", "gender": "string", "interests": "string", "preferred_categories": "string" }`
  - **Headers:** `{ "Authorization": "Bearer token" }`
  - **Response:** `{ "message": "Profile updated successfully" }`

#### 2. **Listings Management**

- **Create Listing**
  - **Endpoint:** `POST /api/listings`
  - **Request Body:** `{ "user_id": "int", "category_id": "int", "title": "string", "description": "string", "price": "decimal", "location": "string" }`
  - **Headers:** `{ "Authorization": "Bearer token" }`
  - **Response:** `{ "listing_id": "int", "message": "Listing created successfully" }`

- **Get Listing**
  - **Endpoint:** `GET /api/listings/{listing_id}`
  - **Response:** `{ "listing_id": "int", "user_id": "int", "category_id": "int", "title": "string", "description": "string", "price": "decimal", "location": "string", "created_at": "timestamp", "updated_at": "timestamp" }`

- **Update Listing**
  - **Endpoint:** `PUT /api/listings/{listing_id}`
  - **Request Body:** `{ "title": "string", "description": "string", "price": "decimal", "location": "string" }`
  - **Headers:** `{ "Authorization": "Bearer token" }`
  - **Response:** `{ "message": "Listing updated successfully" }`

- **Delete Listing**
  - **Endpoint:** `DELETE /api/listings/{listing_id}`
  - **Headers:** `{ "Authorization": "Bearer token" }`
  - **Response:** `{ "message": "Listing deleted successfully" }`

- **Get Listings by Category**
  - **Endpoint:** `GET /api/listings/category/{category_id}`
  - **Response:** `[ { "listing_id": "int", "user_id": "int", "title": "string", "description": "string", "price": "decimal", "location": "string" }, ... ]`

#### 3. **Images Management**

- **Upload Image**
  - **Endpoint:** `POST /api/images`
  - **Request Body:** `{ "listing_id": "int", "image_url": "string" }`
  - **Headers:** `{ "Authorization": "Bearer token" }`
  - **Response:** `{ "image_id": "int", "message": "Image uploaded successfully" }`

- **Get Images for Listing**
  - **Endpoint:** `GET /api/images/listing/{listing_id}`
  - **Response:** `[ { "image_id": "int", "image_url": "string" }, ... ]`

#### 4. **Reviews Management**

- **Add Review**
  - **Endpoint:** `POST /api/reviews`
  - **Request Body:** `{ "listing_id": "int", "user_id": "int", "rating": "int", "comment": "string" }`
  - **Headers:** `{ "Authorization": "Bearer token" }`
  - **Response:** `{ "review_id": "int", "message": "Review added successfully" }`

- **Get Reviews for Listing**
  - **Endpoint:** `GET /api/reviews/listing/{listing_id}`
  - **Response:** `[ { "review_id": "int", "user_id": "int", "rating": "int", "comment": "string", "created_at": "timestamp" }, ... ]`

#### 5. **Job Seekers Management**

- **Create Job Seeker Profile**
  - **Endpoint:** `POST /api/job-seekers`
  - **Request Body:** `{ "user_id": "int", "resume_url": "string", "skills": "string", "experience": "string", "desired_job": "string" }`
  - **Headers:** `{ "Authorization": "Bearer token" }`
  - **Response:** `{ "seeker_id": "int", "message": "Job seeker profile created successfully" }`

- **Get Job Seeker Profile**
  - **Endpoint:** `GET /api/job-seekers/{seeker_id}`
  - **Response:** `{ "seeker_id": "int", "user_id": "int", "resume_url": "string", "skills": "string", "experience": "string", "desired_job": "string" }`
