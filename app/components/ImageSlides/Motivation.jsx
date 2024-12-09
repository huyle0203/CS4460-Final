import React from 'react'

const Motivation = () => {
  return (
    <div className="relative w-screen h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/duo.gif')", backgroundSize: '100% auto' }}
      />
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8">
        <div className="bg-black bg-opacity-60 p-6 w-full max-w-none text-center">
          <p className="text-white text-2xl sm:text-3xl md:text-4xl max-w-4xl mx-auto">
            People are increasingly motivated to learn new languages due to <span className='text-red-300'>cultural curiosity, globalization, and business opportunities </span>. They do so through accessible <span className='text-teal-400'> digital platforms </span>, which prioritize flexibility and engagement over traditional classroom rigidity
          </p>
        </div>
      </div>
    </div>
  )
}

export default Motivation

