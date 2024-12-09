import React from 'react'

const Bye = () => {
  return (
    <div className="relative w-screen h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/duoThicc.gif')", backgroundSize: '100% auto' }}
      />
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8">
        <div className="bg-black bg-opacity-60 p-6 w-full max-w-none text-center">
          <p className="text-white text-2xl sm:text-3xl md:text-4xl max-w-4xl mx-auto">
            <span>That&apos;ss All of It For Now!</span>
            <br />
            <span>Don&apos;st Forget Your Duolingo Streak, else...</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Bye
