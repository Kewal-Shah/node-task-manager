const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const multer = require("multer");
const upload = multer({
    limits :{
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|JPG|jpeg|png|PNG)$/)){
            return callback(new Error("Please upload an image file"));
        }
        callback(undefined, true);
    }
});

//Upload Image to Server
router.post("/users/me/avatar",auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250,  height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send("Uploaded");
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

// Remove image from user's profile
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send("Image Deleted");
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

//Serve image of a User
router.get("/users/:id/avatar", async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error("No image found for this user");
        }
        res.set("Content-Type", "image/jpg");
        res.send(user.avatar);
    }catch(error){
        res.status(400).send();
    }
    
});

// Create Detail of a user
router.post("/users", async (req,res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    } catch(error) {
        res.status(400).send(error);
    }
    
    /* user.save().then(() => {
        res.send(user);
    }).catch((error) => {
        res.status(400).send(error);
    }) */
});

//check login credentials route for a user
router.post("/users/login", async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    } catch(error) {
        res.status(400).send(error);
    }
    
});

//Logout a user
router.post("/users/logout",auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send("Successfully Logged Out");
    } catch(error) {    
        res.status(500).send(error);
    }
    
});

//Logout All users
router.post("/users/logoutAll",auth, async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send("Successfully Logged Out from All Devices");
    } catch(error) {    
        res.status(500).send(error);
    }
    
});

// Get Profile Details of a user
router.get("/users/me", auth, async (req, res) => {
    res.status(200).send(req.user);
    
   /*  try {
        const users = await User.find({});
        res.send(users);
    } catch(error) {
        res.status(400).send();
    } */
    
    /* User.find({}).then((users) => {
        res.send(users);
    }).catch((error) =>{
        res.status(400).send();
    }) */
});

// Get Details of a Single user -Not needed any more as we have developed another route
// This route will allow one user to fetch details of another user based on its id. hence removing it
/* router.get("/users/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch(error) {
        res.status(500).send();
    } */
    
    /* User.findById(_id).then((user) => {
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    }).catch((error) => {
        res.status(500).send();
    }) */
//});


// Update a Particular User using its Id
router.patch("/users/me", auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "email", "password"];
    const isOperationValid = updates.every( update => allowedUpdates.includes(update));
    if(!isOperationValid) {
        return res.status(400).send({error : "Invalid Update Operation!!"});
    }
    try {
        // method findByIdAndUpdate does not run middleware methods so need to replace it save() method like post 
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        //const user = await User.findById(req.params.id);
        /* if(!user) {
            return res.status(404).send();
        } */
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        
        res.send(req.user);
    } catch(error) {
        res.status(400).send(error);
    }
});

// Delete a User using its Id
router.delete("/users/me", auth, async (req,res) => {
    try {
        
        //await User.deleteOne(req.user);
        await req.user.remove(); // deprecated
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;