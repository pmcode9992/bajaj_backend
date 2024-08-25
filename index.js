const express = require("express");
const app = express();
const port = process.env.port || 3000;

app.use(express.json());

const cors = require('cors');
app.use(cors());


app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Invalid JSON received:', err);
        return res.status(400).send({
            is_success: false,
            message: "Invalid JSON format."
        });
    }
    next();
});

app.get("/bfhl", (req, res) => {
  try {
    res.send({ operation_code: 1 });
  } catch (error) {
    console.error("Error occurred:", error);

    res.status(500).send({
      operation_code: 0,
      message: "An error occurred while processing your request.",
    });
  }
});

app.post("/bfhl", (req, res) => {
    try {
        const array = req.body.data;
        if (!Array.isArray(array)) {
            return res.status(400).send({ 
                is_success: false, 
                message: "Please enter a valid array." 
            });
        }

        const numbers = array.filter(item => !isNaN(item));
        const alphabets = array.filter(item => isNaN(item) && /^[a-zA-Z]+$/.test(item));

        const highestAsciiAlphabet = alphabets.reduce((highest, current) => {
            return current > highest ? current : highest;
        }, alphabets[0]);

        const result = {
            is_success: true,
            user_id: "pranav_murthy_20112003",
            email: "pranavmurthy201@gmail.com",
            roll_number: "21BBS0059",
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: (highestAsciiAlphabet && highestAsciiAlphabet >= 'a') ? highestAsciiAlphabet : [],
        };
        res.send(result);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({
            is_success: false,
            message: "An error occurred while processing your request."
        });
    }
});

app.listen(port, ()=>{
    console.log(`Listening on http://localhost:${port}`);
})