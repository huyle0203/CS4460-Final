import React from 'react'

const TeamIntro = () => {
  return (
    <div className="relative w-full h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/earthDuo.gif')" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-60 p-12 max-w-4xl text-center">
          <h1 className="text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            INFO RIZZ
          </h1>
          <p className="text-white font-bold text-3xl leading-relaxed">
            Global Language Learning: Trends, Influences, and the Role of Technology in Language Acquisition
          </p>
        </div>
      </div>
    </div>
  )
}

export default TeamIntro

