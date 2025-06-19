import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { 
    text: string;
}

const Button = ({text, className, ...props} : Props) => {
  return (
    <button {...props} className={twMerge('mt-6 bg-white flex items-center justify-center text-black font-[400] text-base h-3.25 w-full md:max-w-[26.5rem] rounded-3xl hover:bg-gray-200 transition-colors duration-300 cursor-pointer', className)}>
        {text}
    </button>
  )
}

export default Button