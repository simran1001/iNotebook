const express = require('express');
const User = require('./User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'simranisagoodg$irl'
const jwt = require('jsonwebtoken');
const { reconstructFieldPath } = require('express-validator/lib/field-selection');
const fetchuser = require('./fetchuser');


// Route 1 :Authenticate a user using POST : /api/auth/createUser -> No login required
router.post('/createUser', [body('name', 'Enter a valid name.').isLength({ min: 3 }),
body('email', 'Enter a valid email.').isEmail(),
body('password', 'Password must be atleast five characters.').isLength({ min: 5 })
], async (req, res) => {

    //if there are errors then return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }
    //check whether the user with this email is exist already?
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email is already existed.." })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        }

        // .then(user => res.json(user))
        // .catch(err=>console.log(err))
        // res.json({error: 'Please enter a unique value.'})

        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log(authtoken);



        res.json({authtoken: {authtoken}})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error.")
    }
})


// Route2: Authenticate a user using POST : /api/auth/login  -> No login required

router.post('/login', [
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Password cannot be blank.').exists()
    ], async (req, res)=>{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors:"Please try to login with correct credentials."});
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(400).json({errors:"Please try to login with correct credentials."});
        }
        const data = {
            user: {
                id: user.id
            }
        }
        
        const authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(authtoken);
        res.json({authtoken: {authtoken}})
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Internal server error.")
    }
    })

    //Route3 : get loggedin user details using POST : api/auth/getuser ->Login required
    router.post('/getuser',fetchuser, async (req, res)=>{
            try {
                userID = req.user.id;
                const user =  await User.findById(userID).select("-password");
                res.send(user);
            } catch (error) {
                console.log(error.message);
                res.status(500).send("Internal server error.")
            }
        })
  
module.exports = router;