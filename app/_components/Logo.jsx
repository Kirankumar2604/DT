import Image from 'next/image'
import React from 'react'

function Logo() {
  return (
    <div className='flex items-center'>
      <Image src={'/logo1.jpg'} alt='logo' width={50} height={50}/>
      <h2 className='font-bold text-xl'>NOTEZY</h2>
    </div>
  )
}

export default Logo