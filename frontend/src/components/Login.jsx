import React from "react";

function Login() {
  return (
    <>
      <div className="justify-items-center space-y-16 w-full h-screen">
        <h1 className="text-3xl md:text-4xl text-center text-blue-100 mt-12 md:mt-10 font-medium text-shadow-xs text-shadow-black w-3/4 md:w-1/2">
          Welcome to the Attendance Portal!
        </h1>
        <div className="justify-items-center rounded-b-xl w-3/4 md:w-1/2">
          <div className="flex w-full">
            <button className="bg-amber-400 cursor-pointer p-2 text-white rounded-tl-xl w-1/2 border-3 border-black">
              User
            </button>
            <button className="bg-blue-400 cursor-pointer p-2 text-white rounded-tr-xl w-1/2 border-3 border-black">
              Admin
            </button>
          </div>
          <div className="justify-self-center justify-items-center bg-yellow-100 border-3 border-black p-8 px-12 space-y-4 rounded-b-xl w-full">
            <div className="space-y-2 w-full">
              <p>Username</p>
              <input
                type="text"
                placeholder="Enter username"
                className="border-2 border-blue-400 p-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-blue-500 w-full"
              ></input>
            </div>
            <div className="space-y-2 w-full">
              <p>Password</p>
              <input
                type="text"
                placeholder="Enter password"
                className="p-2 border-2 border-blue-400 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-blue-500 w-full"
              ></input>
            </div>
            <div className="w-full">
              <button className="bg-blue-400 cursor-pointer p-2 text-white rounded-xl mt-4 w-full hover:bg-blue-600 font-medium">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
