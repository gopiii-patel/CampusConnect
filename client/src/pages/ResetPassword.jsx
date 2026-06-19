import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";

function ResetPassword() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["","","","","",""]);

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");



  const handleOtpChange = (value,index)=>{

    if(!/^\d?$/.test(value)) return;

    const copy=[...otp];

    copy[index]=value;

    setOtp(copy);

    if(value && index<5){

      document.getElementById(`otp-${index+1}`).focus();

    }

  };



  const handleSubmit=async(e)=>{

    e.preventDefault();

    setError("");

    setMessage("");



    if(password!==confirmPassword){

      setError("Passwords do not match");

      return;

    }



    const finalOtp=otp.join("");



    if(finalOtp.length!==6){

      setError("Enter complete OTP");

      return;

    }



    try{

      setLoading(true);



      const res=await api.post(

        "/auth/reset-password",

        {

          email,

          otp:finalOtp,

          password,

        }

      );



      setMessage(res.data.message);



      setTimeout(()=>{

        navigate("/login");

      },1800);



    }

    catch(err){

      setError(

        err.response?.data?.message ||

        "Unable to reset password"

      );

    }

    finally{

      setLoading(false);

    }

  };



  return(

<div className="min-h-screen bg-slate-900 flex justify-center items-center px-4">

<div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-xl">

<h1 className="text-3xl font-bold text-white text-center">

Reset Password

</h1>

<p className="text-slate-400 text-center mt-2 mb-8">

Enter the OTP sent to your email

</p>



{

error&&

<div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-5">

{error}

</div>

}



{

message&&

<div className="bg-green-500/20 text-green-400 p-3 rounded-xl mb-5">

{message}

</div>

}



<form onSubmit={handleSubmit}>



<div className="flex justify-between mb-6">

{

otp.map((digit,index)=>(

<input

key={index}

id={`otp-${index}`}

type="text"

maxLength="1"

value={digit}

onChange={(e)=>handleOtpChange(e.target.value,index)}

className="w-12 h-12 rounded-xl bg-slate-700 text-center text-xl text-white outline-none"

 />

))

}

</div>



<input

type="password"

placeholder="New Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full p-4 rounded-xl bg-slate-700 text-white mb-4"

/>



<input

type="password"

placeholder="Confirm Password"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

className="w-full p-4 rounded-xl bg-slate-700 text-white mb-6"

/>



<button

disabled={loading}

className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl p-4 text-white"

>

{

loading

?

"Updating..."

:

"Reset Password"

}

</button>

</form>

</div>

</div>

  );

}

export default ResetPassword;