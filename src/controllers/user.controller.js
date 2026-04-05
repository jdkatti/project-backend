const User = require("../models/user.model");

exports.getAllUsers = async(req, res) => {
    try{
        const users = await User.find().select("-password");

        res.json({
            success : true,
            count : users.length,
            data: users
        });
    }catch (err){
        res.status(500).json({message: err.message});
    }
};

exports.updateUser= async(req, res) => {
    try{
        let {role, status} = req.body;

        const updatedFields = {};

        if(role){
            role = role.trim().toUpperCase();
            const validRoles = ["VIEWER", "ANALYST", "ADMIN"];
            if(!validRoles.includes(role)){
                return res.status(400).json({message: "Invalid role"});
            }
            updatedFields.role = role;
        }

        if(status){
            status = status.trim().toUpperCase();
            const validStatus = ["ACTIVE", "INACTIVE"];
            if(!validStatus.includes(status)){
                return res.status(400).json({message: "Invalid status"});
            }
            updatedFields.status = status;
        }

        // prevent empty update
        if(Object.keys(updatedFields).length === 0){
            return res.status(400).json({
                message: "At least one field (status or role) is required."
            });
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            {returnDocument : "after"},
        ).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.json({
            success: true, 
            message: "User updated successfully",
            data: user
        });
    
    }catch (err){
        res.status(500).json({message: err.message});
    }
};


exports.deleteUser = async(req, res) => {
    try{
        userToDelete = req.params.id;
        loggedInUser = req.user.id;

        if(loggedInUser === userToDelete){
            return res.status(400).json({
                message : "Admin cannot delete their account"
            });
        }

        const user = await User.findByIdAndDelete(userToDelete);

        if(!user){
            res.status(404).json({
                message : "User not found"
            });
        }

        res.json({
            success : true,
            message: "User deleted successfully"
        });

    }catch (err){
        res.status(500).json({message: err.message});
    }

};