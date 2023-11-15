import React from 'react'
import Button from './Button';
import {useState} from 'react';
import Logo from '../images/Logo.jpg';
import { useEffect } from 'react';

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const onToggleMenu = () => {
        console.log('clicked');
        setOpen(!open); // add !
    }

    useEffect(() => {

        // check which page is active
        let page = window.location.pathname;
        console.log(page);

            // check for sign-in button click
    let signIn = document.getElementById('sign-in');
    signIn.addEventListener('click', () => {
        console.log('clicked');
    }); 

        if(open){
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('top-[9%]');
        }else{
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('top-[9%]');
        }
    });



  return (
    
<section id="nav" className="">
    <div className="font-[Poppins] bg-primary h-auto p-2">
        <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
        <div className="">
        <nav className="flex justify-between items-center mx-auto">
            <a href="/">
            <div className="flex inline-block items-center">
                <img className="md:ml-6 w-8 cursor-pointer shadow-2xl" src={require('../images/logo.png')} alt="..."/>
                <h1 className="font-CreteRoundRegular text-white text-xl ml-2">KitchIN</h1>
            </div>
            </a>
            <div
                className="nav-links duration-500 md:static absolute md:min-h-fit min-h-[80vh] left-0 top-[-100%] md:w-auto mr-16 w-full flex items-center px-5">
                <ul className="flex md:flex-row bg-primary flex-col md:items-center md:gap-[4vw] gap-8">
                    <li>
                        <a className="hover:underline text-white hover:underline-offset-4 hover:decoration-2 hover:decoration-green-800 font-CreteRoundRegular" href="#">Home</a>
                    </li>
                    <li>
                        <a className="hover:underline text-white hover:underline-offset-4 hover:decoration-2 hover:decoration-green-800  font-CreteRoundRegular" href="#">Our Team</a>
                    </li>
                    <li>
                        <a className="hover:underline text-white hover:underline-offset-4 hover:decoration-2 hover:decoration-green-800 font-CreteRoundRegular" href="#">Resources</a>
                    </li>
                    <li>
                        <a className="hover:underline text-white hover:underline-offset-4 hover:decoration-2 hover:decoration-green-800 font-CreteRoundRegular" href="#">Support</a>
                    </li>
                </ul>
            </div>
                    <div className="flex items-center gap-6">
                        <button id="sign-in" className="bg-white text-green-600 font-CreteRoundRegular px-5 py-2 rounded-full hover:bg-green-800">Sign in</button>
                        {/* <button onClick={onToggleMenu} name="menu" className="text-3xl cursor-pointer md:hidden">H</button> */}
                        <button onClick={onToggleMenu} name="menu" className="text-3xl cursor-pointer md:hidden">H</button>
                    </div>
                </nav>
            </div>
        </div>

    </section>
  )
}

export default Navbar