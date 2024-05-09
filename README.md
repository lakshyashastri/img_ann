# Overview

[Jump to Installation](#installation)

This application is a full-stack web application for uploading, annotating, searching, and managing images. It includes a React frontend and an Express.js backend with a PostgreSQL database. The app features a modern, seamless, and intuitive user experience with smooth transitions throughout, making interactions feel fluid and natural.

#### Frontend Components

1. **App.js**: Root component integrating the `ImageUpload` and `SearchComponent` within a tabbed interface using Mantine UI components.
2. **ImageUploadDropzone.js**: Provides a dropzone for image files; supported formats are PNG, JPEG, and WEBP.
3. **Search.js**: Facilitates image search based on annotations. Supports pagination (5 images per page) and modal dialogs for editing and deleting annotations.
4. **Viewer.js**: Displays individual images as cards with options to annotate or remove them.
5. **ImageUpload.js**: Manages the state of all the image cards, including annotations, and handles the submission process.

#### Backend Components (app.js)

1. **Upload Endpoint**: Handles image uploads and annotation storage. Uses Multer for handling file uploads and PostgreSQL for storing image and annotation data.
2. **Search Endpoint**: Retrieves images based on annotation criteria.
3. **Update Endpoint**: Updates the annotation for a specific image.
4. **Delete Endpoint**: Deletes a specific image and its annotations, including removing the file from the server's filesystem.

#### Database Schema (PostgreSQL)

1. **Images Table**: Stores image files with an ID, file path, and file name. Images themselves are stored on the server's filesystem.
2. **Annotations Table**: Associates images with annotations, referencing the Images table.

#### Usage

-   **Uploading Images**: Users can upload images via the dropzone, with each image requiring an annotation before submission.
-   **Searching Images**: Users can search for images based on annotations. Results support pagination and include options to edit or delete annotations.
-   **Editing Annotations**: Annotations can be edited through a modal dialog, which is accessible from the search results.
-   **Deleting Images**: Images can be deleted along with their annotations. This action is also performed through a modal dialog.

#### Libraries and Frameworks

-   **React**: For building the user interface.
-   **Mantine**: Provides ready-to-use UI components.
-   **Express.js**: Handles server-side logic.
-   **Multer**: Manages file uploads to the server.
-   **PostgreSQL**: Stores and manages image and annotation data.
-   **Framer Motion**: Utilized for adding smooth and natural animations throughout the application to make transitions and interactions more fluid.

# Installation

#### Requirements

-   **Node.js**: Backend runtime environment.
-   **npm**: Node package manager, typically installed with Node.js.
-   **PostgreSQL**: Database system.

#### Backend Setup

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd <repository-path>
    ```

2. **Install dependencies**:
   Navigate to the backend directory and install the required npm packages. Also create an "uploads" folder to store images.

    ```bash
    cd backend
    mkdir uploads
    npm install
    ```

3. **Environment Variables**:
   Create a `.env` file in the backend directory to store environment variables:

    ```plaintext
    PORT=8000
    DATABASE_URL=postgres://username:password@localhost:5432/databasename
    ```

4. **Database Setup**:

    - Start your PostgreSQL service and log in to the PostgreSQL command line tool.
    - Create a new database:
        ```sql
        CREATE DATABASE databasename;
        ```
    - Connect to the database and create the necessary tables:
        ```sql
        \c databasename
        CREATE TABLE IF NOT EXISTS Images (
            image_id SERIAL PRIMARY KEY,
            file_path TEXT NOT NULL,
            file_name VARCHAR(255) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS Annotations (
            annotation_id SERIAL PRIMARY KEY,
            image_id INT,
            class_name VARCHAR(255) NOT NULL,
            FOREIGN KEY (image_id) REFERENCES Images(image_id)
        );
        ```

5. **Start the Server**:
   Run the server with the following command:
    ```bash
    npm start
    ```
    The server will start on the port specified in the `.env` file (default 8000). Ensure that the backend server is using the URL `http://localhost:8000`

#### Frontend Setup

1. **Navigate to the frontend directory**:

    ```bash
    cd ../frontend
    ```

2. **Install dependencies**:
   Install the required npm packages:

    ```bash
    npm install
    ```

3. **Start the React Application**:
   Run the frontend application:
    ```bash
    npm start
    ```
    This will start the React development server and open the web application in your default browser.

#### Additional Notes

-   Ensure your firewall or network settings allow traffic on the ports the services are running on (default 8000 for backend).

# Running the Application

1. Start the backend server (`node app.js`).
2. Launch the frontend application (`npm start` in the React project directory).

# Screenshots

### Annotate images

![Annotate images](/screenshots/annotate.png)

### Search

![Search](/screenshots/search.png)

### Modify image on hover

![Modify image](/screenshots/edit.png)

### Delete image

![Delete image](/screenshots/delete.png)
