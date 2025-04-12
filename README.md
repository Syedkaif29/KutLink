# KutLink

> **URL Shortener** with built‑in **QR Code** generation.

<p align="center">
  <img src="assets/title kutlink.png" alt="KutLink Screenshot" width="400"/>
</p>

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Demo](#demo)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running Locally](#running-locally)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Overview

KutLink is a simple, lightweight web application that lets users:

1. **Shorten** any long URL.  
2. **Copy** the shortened link to clipboard.  
3. **Generate** and **download** a QR code for quick mobile access.

---

## Features

- 🔗 **Short URL** creation  
- 📋 **One‑click copy** to clipboard  
- 🖼️ **QR code** generation & download  
- 🚀 Fast, responsive UI  

---

## Demo

<p align="center">
  <img src="assets/kutlink-qr.png" alt="KutLink Screenshot" width="400" />
</p> 

1. Enter your long URL (e.g. `https://www.google.com`).  
2. Click **KutLink URL**.  
3. View and copy your short URL.  
4. Download the QR code or scan it directly.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Spring Boot (Java)  
- **Database:** PostgreSQL 
- **QR Code:** [ZXing](https://github.com/zxing/zxing)  
- **Build Tools:** Maven / npm  

---

## Getting Started

### Prerequisites

- Java 11+  
- Node.js & npm  
- MongoDB or PostgreSQL instance (or Docker)  
- Git  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/kutlink.git
   cd kutlink
## Backend setup

```bash
cd backend
# Create a PostgreSQL database (e.g. kutlink_db)
```

In `src/main/resources/application.properties`, configure:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/kutlink_db
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

Build the project:

```bash
mvn clean install
```

## Frontend setup

```bash
cd ../frontend
npm install
```

## Running Locally

### Start the backend

```bash
cd backend
mvn spring-boot:run
```
The API will be available at `http://localhost:8080`.

### Start the frontend

```bash
cd ../frontend
npm start
```
The UI will run on `http://localhost:3000`.

## Usage

1. Open your browser and navigate to `http://localhost:3000`.  
2. Paste your long URL into the input field.  
3. Click **KutLink URL** to generate.  
4. Copy the link or download the QR code.

## API Endpoints

The controller is at `com.kutlink.kutlink.controller.UrlController`.

| Method | Path            | Description                               | Request Body                         | Response                                |
| ------ | --------------- | ----------------------------------------- | ------------------------------------ | --------------------------------------- |
| POST   | `/api/shorten`  | Create a new short URL & generate QR code | `{ "originalUrl": "http://..." }`    | `UrlShortenResponse` JSON:<br>```json<br>{<br>  "originalUrl":"http://www.google.com",<br>  "shortUrl":"http://localhost:8080/ABc123",<br>  "shortCode":"ABc123",<br>  "qrCodeBase64":"data:image/png;base64,..."<br>}<br>``` |
| GET    | `/{shortCode}`  | Redirect to the original URL              | _No body_                            | 302 redirect to the stored URL          |

**Example:**

```bash
# Shorten a URL
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"www.google.com"}'

# Visit a shortened URL
open http://localhost:8080/ABc123

## Contributing

1. Fork the repository  
2. Create a new branch (`git checkout -b feature/AwesomeFeature`)  
3. Commit your changes (`git commit -m 'Add some feature'`)  
4. Push to your branch (`git push origin feature/AwesomeFeature`)  
5. Open a Pull Request  

Please follow the existing code style and include tests where appropriate.

## License

Distributed under the MIT License. See `LICENSE` for details.

