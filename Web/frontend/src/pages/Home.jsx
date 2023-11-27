import React from 'react'
import Navbar from '../components/Navbar';
import { useEffect } from 'react';

const Home = () => {

  React.useEffect(() => {

    // get user agent
    let userAgent = navigator.userAgent.toLowerCase();

    // check if user is on mobile
    if(userAgent.indexOf('mobi') !== -1){

      let div = document.getElementById('all');

      div.innerHTML = `
      <div class="flex flex-col w-full">
      <div class="flex inline-block items-center justify-center">
      <img class="mobile:w-48 lg:w-96 cursor-pointer" src=${require('../images/mobile_phone_new.png')} alt="..."/>
      

      </div>
      <div class="flex mobile:w-full lg:w-8/12 text-center">
        <h1 class="font-CreteRoundRegular text-4xl px-2 text-white">Manage your food digitally like never before.</h1>
      </div>
      <div class="mt-4 text-center">
        <h1 class="font-CreteRoundRegular text-2xl text-white px-1">Control your fridge, freezer, and pantry from anywhere.</h1>
      </div>
      <div class="flex justify-center">
        <img class="h-36 cursor-pointer" src=${require('../images/app_store.png')} alt="..."/>
      </div>
      </div>

      `;

    }

  });

  // 70 138 82

  return (
    <section className="h-full mb-20">
      <Navbar />

    <div className="mobile:h-4 lg:h-24 bg-primary w-full">

    </div>
    <div id="all" className="h-auto bg-primary w-full">
      <div className="flex inline-block w-full items-center mobile:px-10 lg:px-64 ">
        <div className="flex flex-col w-full">

        <div className="mobile:w-full lg:w-10/12 xl:w-8/12">
          <h1 className="font-CreteRoundRegular mobile:text-4xl xl:text-6xl text-white xl:ml-12">Manage your food digitally like never before.</h1>
        </div>
        <div className="mt-6">
          <h1 className="font-CreteRoundRegular text-2xl text-white xl:ml-12">Control your fridge, freezer, and pantry from anywhere.</h1>
        </div>
        <div className="">
          <img className="xl:ml-12 h-36 cursor-pointer" src={require('../images/app_store.png')} alt="..."/>
        </div>
        </div>
        
        <div className="flex ml-auto">
          <img className="mobile:w-48 lg:w-96 lg:ml-24 xl:ml-0 xl:w-96 cursor-pointer" src={require('../images/hand.png')} alt="..."/>
        </div>
      </div>
    </div>

    <div className="flex flex-row mt-20 p-8 items-center justify-center w-full ">
        <div className="flex flex-col justify-center items-center ml-auto w-3/6 ">
          <div className="flex">
            <h1 className="text-6xl font-CreteRoundRegular text-primary">Automated<br/> food tracking</h1>
          </div>
          <div className="flex mt-5 ml-4">
            <h1 className="text-md font-CreteRoundRegular text-primary">Accurately tracking every item in your household and <br/>  estimating its expiration time.</h1>
          </div>
        </div>

        <div className="flex ml-auto mr-24 w-2/5 ">
          <div className="flex flex-col w-9/12 bg-primary mr-auto px-8 py-4 shadow-black shadow-md">
            <h1 className="text-white font-CreteRoundRegular text-md">"With our new AI technology, we can handle all the logistic work from the moment you add the item to your fridge, pantry, or freezer, to the moment it expires, or is consumed."</h1>
            <h1 className="mt-2 text-white font-CreteRoundRegular text-lg">- Founders of KitchIN</h1>
          </div>
        </div>
    </div>

    <div className="flex items-center justify-center mt-20">

      <div className="flex flex-row items-center justify-center space-x-16 w-8/12">
      <div className="flex flex-col w-2/5 items-center justify-center outline outline-primary outline-4 p-6">
          <h1 className="text-2xl font-CreteRoundRegular text-primary">Add items to your fridge, freezer, or pantry.</h1>
        </div>
        <div className="flex bg-green-300 w-2/5">Hi</div>
        <div className="flex bg-cyan-300 w-2/5">Hi2323</div>
      </div>
    </div>

      

    </section>
  )
}

export default Home