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
    <section className="h-full">
      <Navbar />

    <div className="mobile:h-4 lg:h-24 bg-primary w-full">

    </div>
    <div id="all" className="h-auto bg-primary w-full">
      <div className="flex inline-block w-full items-center mobile:px-10 lg:px-64 ">
        <div className="flex flex-col w-full">

        <div className="mobile:w-full lg:w-8/12">
          <h1 className="font-CreteRoundRegular mobile:text-4xl lg:text-6xl text-white lg:ml-12">Manage your food digitally like never before.</h1>
        </div>
        <div className="mt-6">
          <h1 className="font-CreteRoundRegular text-2xl text-white ml-12">Control your fridge, freezer, and pantry from anywhere.</h1>
        </div>
        <div className="">
          <img className="ml-12 h-36 cursor-pointer" src={require('../images/app_store.png')} alt="..."/>
        </div>
        </div>
        
        <div className="flex ml-auto">
          <img className="mobile:w-48 lg:w-96 cursor-pointer" src={require('../images/hand.png')} alt="..."/>
        </div>
      </div>
    </div>
    </section>
  )
}

export default Home