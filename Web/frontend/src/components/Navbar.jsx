import React from 'react'
import Button from './Button';
import {useState} from 'react';
import Logo from '../images/Logo.jpg';
import { useEffect } from 'react';

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const onToggleMenu = () => {
        console.log('clicked');
        setOpen(!open);
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
    <div className="font-[Poppins] bg-gray-200 h-auto p-2">
        <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
        <div className="">
        <nav className="flex justify-between items-center mx-auto">
            <div>
                <img className="ml-8 w-10 cursor-pointer" src={require('../images/Logo.jpg')} alt="..."/>
            </div>
            <div
                className="nav-links duration-500 md:static absolute bg-white md:min-h-fit min-h-[60vh] left-0 top-[-100%] md:w-auto  w-full flex items-center px-5">
                <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
                    <li>
                        <a className="hover:text-gray-500 font-CreteRoundRegular" href="#">Products</a>
                    </li>
                    <li>
                        <a className="hover:text-gray-500" href="#">Solution</a>
                    </li>
                    <li>
                        <a className="hover:text-gray-500" href="#">Resource</a>
                    </li>
                    <li>
                        <a className="hover:text-gray-500" href="#">Developers</a>
                    </li>
                    <li>
                        <a className="hover:text-gray-500" href="#">Pricing</a>
                    </li>
                </ul>
            </div>
                    <div className="flex items-center gap-6">
                        <button id="sign-in" className="bg-green-600 text-white font-CreteRoundRegular px-5 py-2 rounded-full hover:bg-green-800">Sign in</button>
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