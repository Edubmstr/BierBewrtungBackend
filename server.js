import dotenv from 'dotenv';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import express from 'express';
import cors from 'cors';
import { getAllReviews, getSingleReviews, getUserReviews, createNewReview } from './prismatest.js';
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
dotenv.config();
const port = process.env.PORT 

//var adapter = new FileSync("./database.json");
//var db = low(adapter);

const pool = mysql.createPool(
    process.env.DATABASE_URL
);

app.get('/getdata', async (req, res) => {

    try {
        const resultData = await getAllReviews();
        res.send(resultData); 
    } catch (error) {
        res.sendStatus(500);
    }
    
});  

app.post('/userreviews', async (req, res) => {
    
    try {
        const resultData = await getUserReviews(req.body.user_id);
        res.send(resultData)
    } catch (error) {
        res.sendStatus(500);
    }
});  

app.get('/getentry', async (req, res) => {

    try {
        const resultData = await getSingleReviews(req.body.id);
        res.send(resultData)
    } catch (error) {
        res.sendStatus(500);
    }
        
}); 

app.post('/newentry', async (req,res) => {
    try {
        const resultData = await createNewReview(req.body);
        res.send(resultData);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.post('/newuser', (req,res) => {
    const { name, password } = req.body;

    const userEntryDb = pool.execute('SELECT * FROM beerAppUser WHERE user_name = ?', [name], function(err, rows, fields){
       // res.send(rows[0].user_name);
       if(rows[0]) {
        res.status(200);
       }else{
        res.send(200);
       }
    });
});

/*app.get("/", (_req, res) => {
    res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication")
})

// The auth endpoint that creates a new user record or logs a user based on an existing record
app.post("/auth", (req, res) => {
    
    const { email, password } = req.body;

    // Look up the user entry in the database
    const user = db.get("users").value().filter(user => email === user.email)

    // If found, compare the hashed passwords and generate the JWT token for the user
    if (user.length === 1) {
        bcrypt.compare(password, user[0].password, function (_err, result) {
            if (!result) {
                return res.status(401).json({ message: "Invalid password" });
            } else {
                let loginData = {
                    email,
                    signInTime: Date.now(),
                };

                const token = jwt.sign(loginData, jwtSecretKey);
                res.status(200).json({ message: "success", token });
            }
        });
    // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
    } else if (user.length === 0) {
        bcrypt.hash(password, 10, function (_err, hash) {
            console.log({ email, password: hash })
            db.get("users").push({ email, password: hash }).write()

            let loginData = {
                email,
                signInTime: Date.now(),
            };

            const token = jwt.sign(loginData, jwtSecretKey);
            res.status(200).json({ message: "success", token });
        });

    }


})

// The verify endpoint that checks if a given JWT token is valid
app.post('/verify', (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];
    try {
      const verified = jwt.verify(authToken, jwtSecretKey);
      if (verified) {
        return res
          .status(200)
          .json({ status: "logged in", message: "success" });
      } else {
        // Access Denied
        return res.status(401).json({ status: "invalid auth", message: "error" });
      }
    } catch (error) {
      // Access Denied
      return res.status(401).json({ status: "invalid auth", message: "error" });
    }

})

// An endpoint to see if there's an existing account for a given email address
app.post('/check-account', (req, res) => {
    const { email } = req.body

    console.log(req.body)

    const user = db.get("users").value().filter(user => email === user.email)

    console.log(user)
    
    res.status(200).json({
        status: user.length === 1 ? "User exists" : "User does not exist", userExists: user.length === 1
    })
})*/

app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`)
});

