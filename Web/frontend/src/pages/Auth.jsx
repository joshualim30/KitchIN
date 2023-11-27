import React from 'react'
import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'

const Auth = () => {

    const [count, setCount] = useState(0);

    const pageComponents = [
        <>
            <div className="flex inline-block ">
                <img src={require("../images/Logo.jpg")} alt="logo" className=" w-12 h-12 mb-4" />
                <h1 className="text-primary font-CreteRoundRegular text-4xl ml-2 mt-1 ">KitchIN</h1>
            </div>

            <div className="flex flex-col mr-auto w-full">
                <p className="font-CreteRoundRegular text-xl text-primary mt-2">Sign In</p>
                <input type="text" placeholder="Email or Phone" className="border-b-2 py-2 w-full border-gray-300 focus:outline-none focus:border-green-500 mb-4 mt-2" />
            </div>

            <div className="flex inline-block">
                <p className="font-CreteRoundRegular text-sm text-black">Don't have an account?</p>
                <a href="/auth"><p className="font-CreteRoundRegular text-sm text-primary ml-1">Create one!</p></a>
            </div>

        </>,
        <>
                    <div className="flex inline-block ">
                <img src={require("../images/Logo.jpg")} alt="logo" className=" w-12 h-12 mb-4" />
                <h1 className="text-primary font-CreteRoundRegular text-4xl ml-2 mt-1 ">KitchIN 2</h1>
            </div>

            <div className="flex flex-col mr-auto w-full">
                <p className="font-CreteRoundRegular text-xl text-primary mt-2">Sign In</p>
                <input type="text" placeholder="Email or Phone" className="border-b-2 py-2 w-full border-gray-300 focus:outline-none focus:border-green-500 mb-4 mt-2" />
            </div>

            <div className="flex inline-block">
                <p className="font-CreteRoundRegular text-sm text-black">Don't have an account?</p>
                <a href="/auth"><p className="font-CreteRoundRegular text-sm text-primary ml-1">Create one!</p></a>
            </div>

        </>
    ]

    

  return (
    <section className="flex h-screen bg-primary items-center justify-center">

        <div className="flex flex-col mobile:w-9/12 tablet:w-3/12 mobile:mb-32 tablet:mb-0 rounded-2xl w-full h-auto bg-white shadow-black shadow-md p-10">

        <div id="layer" className="flex flex-col w-full">

            {pageComponents[count]}

            {count > 0 ?
            <div className="flex inline-block">
                <button id="previous" className="mt-10 mr-auto bg-primary text-white font-CreteRoundRegular px-5 py-2 rounded-full hover:bg-green-800" onClick={() => setCount(count - 1)}>Previous</button> 
                <button id="signin" className="mt-10 ml-auto bg-primary text-white font-CreteRoundRegular px-5 py-2 rounded-full hover:bg-green-800" onClick={() => setCount(count - 1)}>Sign in</button> 
            </div>
             : null}
            {count < pageComponents.length - 1 ? <button id="next" className="mt-10 ml-auto bg-primary text-white font-CreteRoundRegular px-5 py-2 rounded-full hover:bg-green-800" onClick={() => setCount(count + 1)}>Next</button> : null}

        </div>

        </div>

    </section>
  )
}

export default Auth