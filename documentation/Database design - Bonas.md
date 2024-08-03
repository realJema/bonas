Here’s a database design for your classified listing website, Bonas. The design includes tables for users, categories, listings, and other essential components.

### **Database Schema for Bonas**

#### **1. Users Table**

| Column Name         | Data Type      | Constraints            | Description                            |
|---------------------|----------------|-------------------------|----------------------------------------|
| user_id             | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each user         |
| username            | VARCHAR(255)   | UNIQUE, NOT NULL        | Username of the user                    |
| password_hash       | VARCHAR(255)   | NOT NULL                | Hashed password for user authentication |
| email               | VARCHAR(255)   | UNIQUE, NOT NULL        | User's email address                    |
| phone_number        | VARCHAR(20)    | NULL                    | User's contact number                   |
| created_at          | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Account creation date and time          |
| updated_at          | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last account update date and time       |
| profile_picture     | VARCHAR(255)   | NULL                    | URL to the user's profile picture       |
| address             | VARCHAR(255)   | NULL                    | User's address for location-based recommendations |
| date_of_birth       | DATE           | NULL                    | User's date of birth                    |
| gender              | VARCHAR(10)    | NULL                    | User's gender                           |
| interests           | TEXT           | NULL                    | User's interests for personalized recommendations |
| preferred_categories | TEXT         | NULL                    | Categories the user is most interested in |
| search_history      | TEXT           | NULL                    | Historical search queries for recommendations |
| favorite_listings   | TEXT           | NULL                    | List of user’s favorite listings (could be a comma-separated list of listing IDs) |


#### **2. Categories Table**

**Purpose:** Store information about different listing categories.

| Column Name     | Data Type      | Constraints            | Description                        |
|-----------------|----------------|-------------------------|------------------------------------|
| category_id     | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each category |
| name            | VARCHAR(255)   | NOT NULL                | Name of the category                |
| description     | TEXT           | NULL                    | Description of the category         |
| parent_id       | INT            | NULL, FOREIGN KEY       | Reference to a parent category (self-referencing) |
| created_at      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Category creation date and time     |
| updated_at      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last category update date and time |

#### **3. Listings Table**

**Purpose:** Store information about individual classified ads.

| Column Name     | Data Type      | Constraints            | Description                        |
|-----------------|----------------|-------------------------|------------------------------------|
| listing_id      | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each listing  |
| user_id         | INT            | FOREIGN KEY (Users.user_id) | ID of the user who created the listing |
| category_id     | INT            | FOREIGN KEY (Categories.category_id) | ID of the category of the listing   |
| title           | VARCHAR(255)   | NOT NULL                | Title of the listing                |
| description     | TEXT           | NOT NULL                | Description of the listing          |
| price           | DECIMAL(10,2)  | NULL                    | Price of the item                   |
| location        | VARCHAR(255)   | NULL                    | Location of the item                |
| created_at      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Listing creation date and time      |
| updated_at      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last listing update date and time |

#### **4. Images Table**

**Purpose:** Store images associated with listings.

| Column Name     | Data Type      | Constraints            | Description                        |
|-----------------|----------------|-------------------------|------------------------------------|
| image_id        | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each image    |
| listing_id      | INT            | FOREIGN KEY (Listings.listing_id) | ID of the listing the image is associated with |
| image_url       | VARCHAR(255)   | NOT NULL                | URL of the image                    |
| created_at      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Image upload date and time          |

#### **5. Reviews Table**

**Purpose:** Store user reviews for listings.

| Column Name     | Data Type      | Constraints            | Description                        |
|-----------------|----------------|-------------------------|------------------------------------|
| review_id       | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each review   |
| listing_id      | INT            | FOREIGN KEY (Listings.listing_id) | ID of the listing being reviewed   |
| user_id         | INT            | FOREIGN KEY (Users.user_id) | ID of the user who wrote the review |
| rating          | INT            | NOT NULL, CHECK(rating BETWEEN 1 AND 5) | Rating given by the user (1 to 5)   |
| comment         | TEXT           | NULL                    | Review comment                      |
| created_at      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Review creation date and time       |

#### **6. Job Seekers Table**

**Purpose:** Store information about users looking for jobs.

| Column Name     | Data Type      | Constraints            | Description                        |
|-----------------|----------------|-------------------------|------------------------------------|
| seeker_id       | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each job seeker |
| user_id         | INT            | FOREIGN KEY (Users.user_id) | ID of the user who is a job seeker  |
| resume_url      | VARCHAR(255)   | NULL                    | URL to the job seeker's resume      |
| skills          | TEXT           | NULL                    | List of skills                      |
| experience      | TEXT           | NULL                    | Work experience description         |
| desired_job      | VARCHAR(255)   | NULL                    | Job position the seeker is looking for |
| created_at      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Job seeker profile creation date and time |

---

### **Relationships**

- **Users** can create multiple **Listings**.
- **Listings** belong to a specific **Category**.
- **Listings** can have multiple **Images**.
- **Listings** can receive multiple **Reviews** from **Users**.
- **Users** can also be **Job Seekers**.

This database design should support the core functionality of your classified listing website, allowing for efficient management of users, listings, categories, and associated elements.
