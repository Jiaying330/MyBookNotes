# My Book Notes

Welcome to **My Book Notes**, a personal digital library platform designed to enhance the experience of book lovers and lifelong learners. This application allows users to store, manage, and review detailed notes on the books they have read, ensuring that key insights and takeaways are retained and easily accessible for future reference.

## Features

- **View Books**: Browse through a collection of books you added sorted by rating, last update, and title.
- **Manage Books**: Add, edit, and delete books in your library.
- **Book Details**: Access detailed views of each book, including images, summaries, and categories.
- **Note Management**: Create, edit, and delete notes associated with each book.
- **Search**: Find books in your collection using a flexible search feature.

## Technologies

My Book Notes is built using the following technologies:

- **Node.js** with **Express** for the backend server.
- **PostgreSQL** for the database.
- **Axios** for making HTTP requests to external services.
- **EJS** for server-side rendering of pages.
- **Body-Parser** for parsing incoming request bodies.
- **dotenv** for managing environment variables.

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

Ensure you have Node.js and PostgreSQL installed on your system. You also need to set up environment variables for your database configuration:

```env
DATABASE_USER=yourusername
DATABASE_HOST=localhost
DATABASE_NAME=yourdatabase
DATABASE_PASSWORD=yourpassword
DATABASE_PORT=5432
```

### Installation
1. Clone the repository:
```bash
git clone https://github.com/Jiaying330/MyBookNotes.git
cd MyBookNotes
```
2. Install NPM packages:
```bash
npm install
```
3. Start the application:
```bash
node index.js
```
This will start the server on http://localhost:3000.

## About the Project
My Book Notes was created to address the challenge of retaining the rich insights gathered from reading. As an avid reader, the need to catalog thoughts and reflections on books became evident, leading to the development of this platform. It serves not just as a collection of books but as a well-organized repository of knowledge suitable for students, professionals, and casual readers alike.

## License
Distributed under the MIT License. See LICENSE for more information.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
