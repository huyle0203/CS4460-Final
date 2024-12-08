import React from 'react'

const RocketSlide = () => {
  return (
    <div className="relative w-full h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/rocketlaunch.gif')" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-60 p-8 max-w-2xl text-center">
          <p className="text-white text-4xl">
          With the modern world and the global adoption of technologies, new trends in language learning began to emerge.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RocketSlide

