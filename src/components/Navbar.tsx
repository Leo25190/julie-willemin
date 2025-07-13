import { motion } from 'framer-motion';
import { useState } from 'react';
import { navLogoText } from '../data';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ navLinks }) {
  const [isToggled, setIsToggled] = useState(false);
  const subMenuLinkStyles = `text-xl transition-all duration-[0.3s]`;
  const MenuLinkStyles = `text-lg transition-all duration-[0.3s] hover:text-primary`;
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 100 },
    show: { opacity: 1, x: 0 },
  };
  return (
    <nav className='fixed top-0 left-0 w-full bg-background bg-opacity-80 backdrop-blur-xl z-40'>
      <div className='flex justify-between items-center p-5 z-'>
        <a href='/' className='logo text-md font-bold relative group'>
          {navLogoText ? navLogoText : 'julie-willemin'}
          <span className='absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full'></span>
        </a>
        <div className='flex items-center gap-5'>
          <div className='links'>
            <ul className='hidden md:flex items-center gap-3'>
              {navLinks.map((link) => (
                <li key={link.name} className={MenuLinkStyles}>
                  <a href={`${link.href}`}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <ThemeToggle />
        </div>
        <motion.div
          className={`flex flex-col md:hidden gap-[3.5px] cursor-pointer z-50 ${
            isToggled ? 'fixed top-6 right-5' : ''
          }`}
          onClick={() => setIsToggled((prev) => !prev)}
        >
          <motion.span
            animate={{
              rotate: isToggled ? 45 : 0,
              translateY: isToggled ? 7 : 0,
              width: isToggled ? 30 : 30,
            }}
            className='w-[30px] h-[2px] bg-text'
          />
          <motion.span
            animate={{ opacity: isToggled ? 0 : 1, width: isToggled ? 0 : 25 }}
            className='w-[20px] h-[2px] bg-text'
          />
          <motion.span
            animate={{
              rotate: isToggled ? -45 : 0,
              translateY: isToggled ? -5 : 0,
              width: isToggled ? 30 : 15,
            }}
            className='w-[15px] h-[2px] bg-text'
          />
        </motion.div>
      </div>
      {isToggled && (
        <motion.div className='md:hidden fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center z-40 bg-background'>
          <motion.ul
            className='flex md:hidden flex-col items-center gap-3'
            variants={container}
            initial='hidden'
            animate='show'
          >
            {navLinks.map((link) => (
              <motion.li variants={item} key={link.name}>
                <a
                  href={link.href}
                  className={subMenuLinkStyles}
                  onClick={() => setIsToggled(false)}
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </nav>
  );
}
