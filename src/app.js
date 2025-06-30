const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        // validate data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const userData = await user.save();
        res.status(200).send({success:true, msg:"User added successfully!", data: userData});
    } catch (err) {
        res.status(400).send({sucess:false, msg: err.message})
    }
    
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({emailId: emailId});

        if (!user) {
            throw new Error("User not found!");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.status(200).send({success:true, msg:"Login successfully!", data: user});
        } else {
            throw new Error("Invalid password!");
        }
    } catch (err) {
        res.status(400).send({sucess:false, msg: err.message})
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId =  req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["firstName", "lastName", "gender", "skills", "age"];
        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed) {
           throw new Error("Update not alloweds")
        }
        if(data?.skills.length > 10) {
            throw new Error("You can not add more than 10 skills");
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });

        console.log(user);
        res.status(200).send({success:true, mag: "User updated successfully!"})
    } catch (err) {
        res.status(400).send({success: false, msg: "Smthing went wrong!" + err});
    }
})

connectDB()
    .then(() => {
        console.log("Database connected successfully..");
        app.listen(4000, () => {
            console.log("Server is started successfully.")
        });
    })
    .catch((err) => {
        console.log("Unable to connect database.")
    });