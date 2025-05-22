const bcrypt = require("bcrypt");
const userModel = require("../models/user.js");

async function signup(req, res)
{
    try
    {
        let {name, email, password} = req.body;

        name = name.trim();
        email = email.trim();
        password = password.trim();
        if(name === "" || email === "" || password === "")
        {
            res.status(400).json({
                success: false,
                message: "All fields must be filled."
            });
        }

        if(password.length < 8)
        {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        const doesUserExist = await userModel.findOne({email: email});

        if(doesUserExist)
        {
            res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userDocument = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            user_id: userDocument._id,
            message: "Unverifed account created successfully."
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = signup;