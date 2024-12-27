import userModel from "../models/userModel.js"
import JWT from 'jsonwebtoken';
import bcrypt from "bcrypt";


export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({ success: false, message: "All fields are required." });
    }

    // Save user without hashing the password
    const user = new userModel({
      name,
      email,
      password, // Store password as plain text (not recommended)
      phone,
      address,
      answer,
    });

    await user.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error in registration", error });
  }
};


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered.",
      });
    }

    // Compare plain-text passwords
    if (user.password !== password) {
      return res.status(401).send({
        success: false,
        message: "Invalid password.",
      });
    }

    // Generate token (optional)
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in login.",
      error,
    });
  }
};




// export const registerController = async(req,res)=>{

//       try {
//        const {name,email,password,phone,address,answer} = req.body;
//        //validation
//        if(!name){
//         return res.send({message:'Name is required'})
//        }
//        if(!email){
//         return res.send({message:'Email is required'})
//        }
//        if(!password){
//         return res.send({message:'Password is required'})
//        }
//        if(!phone){
//         return res.send({message:'Phone is required'})
//        }
//        if(!address){
//         return res.send({message:'Address is required'})
//        }
//        if(!answer){
//         return res.send({message:'Answer is required'})
//        }

//       // check user
//       const existinguser = await userModel.findOne({email})
//    if(existinguser){
//     return res.status(200).send({
//         success:false,
//         message:'Already Register please login'
//     })
//    }
//    //save 
//    const user = await new userModel({
//       name,
//       email,
//       password,
//       phone,
//       address,
//       answer
//    }).save();
//       res.status(201).send({
//         success:true,
//         message:'user register succesfully',
//         user
//       })

//       } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success:false,
//             message:'Error in Register',
//             error
//         })
//       }
// }



//post login
 
// export const loginController = async (req,res) =>{
//   try {
//       const { email, password } = req.body;
//       //validation
//       if (!email || !password) {
//         return res.status(404).send({
//           success: false,
//           message: "Invalid email or password",
//         });
//       }
//       //check user
//       const user = await userModel.findOne({ email });
//       if (!user) {
//         return res.status(404).send({
//           success: false,
//           message: "Email is not registerd",
//         });
//       }

      
//       const match = (password, user.password);
//       if (!match) {
//         return res.status(200).send({
//           success: false,
//           message: "Invalid Password",
//         });
//       }



//       //token
//       //await use there
//       const token =  JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//       });
//       res.status(200).send({
//         success: true,
//         message: "login successfully",
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           address: user.address,
//           // role: user.role,
//         },
//         token,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         success: false,
//         message: "Error in login",
//         error,
//       });
//     }
// }


export const forgotPasswordController = async(req,res)=>{
  try {
    const {email,answer,newPassword}= req.body
    if(!email){
      res.status(400).send({message:"email is required"})
    }
    if(!answer){
      res.status(400).send({message:"answer is required"})
    }
    if(!newPassword){
      res.status(400).send({message:"New Password is required"})
    }

    // check 
    const user = await userModel.findOne({email,answer})
    // validation
    if(!user){
      return res.status(404).send({
        success:false,
        message:"wrong email or answer"
      })
    }
    
     await userModel.findByIdAndUpdate(user._id,{password:newPassword});
     res.status(200).send({
      success:true,
      message:"password reset succesfully",
     });

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"something went wrong",
      error
    })
  }
};