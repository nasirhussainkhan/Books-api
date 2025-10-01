import log = require("console");
import console = require("console");
import express, {type Request, type Response } from "express";

interface Book {
  id: number;
  title: string;
  author: string;
  year?: number; // Optional
}

const books: Book[] = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { id: 2, title: "Atomic Habits", author: "James Clear" },
];

const app = express();
const port = 3000;
app.use(express.json());


app.get("/books",(req:Request, res:Response) => {
    const author = req.query.author as string | undefined;

    if (author) {
        const filtered = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
        return res.status(200).json(filtered);
    }
    res.status(200).json(books);
});

app.post("/books", (req:Request, res:Response) => {
    const {title,author,year } = req.body;
    if (!title || !author){
        return res.status(400).json({error:"title and author are required"})
    }
    if (year !== undefined && typeof year !== "number"){
        return res.status(400).json({error:"year must be a number"})
    }
    if (books.find (b => b.title.toLowerCase() === title.toLowerCase())){
        return res.status(409).json({error:"book with this title already exixts"});

    }
    const newBook:Book = {
        id:(books[books.length -1]?.id ?? 0) + 1,
        title,
        author,
        year
    };
    books.push(newBook);
    res.status(201).json(newBook);

});

app.listen(port,() => {
    console.log(`server running at http://localhost:${port}`);
});