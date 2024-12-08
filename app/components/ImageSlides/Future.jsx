import React from 'react'
import { ChevronDown } from 'lucide-react'

const Future = () => {
  return (
    <div className="relative w-full h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/future.jpg')" }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-between py-8">
        <div className="bg-white bg-opacity-75 p-4 w-full">
          <h1 className="text-black text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            The world if global educational system evolves for language learning
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 w-full px-4">
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 w-full">
            <div className="bg-black bg-opacity-60 p-4 md:p-6 max-w-md text-center flex-1">
              <p className="text-white text-lg sm:text-xl md:text-2xl">
                To foster a more inclusive and effective language learning environment, platforms and classrooms must blend flexibility and rigor.
              </p>
            </div>
            <div className="bg-black bg-opacity-60 p-4 md:p-6 max-w-md text-center flex-1">
              <p className="text-white text-lg sm:text-xl md:text-2xl">
                The trend of increasing linguistic diversity on the internet must continue.
              </p>
            </div>
          </div>
          <ChevronDown className="w-12 h-12 text-white animate-bounce" />
          <div className="bg-black bg-opacity-60 p-4 md:p-6 max-w-md text-center">
            <p className="text-white text-lg sm:text-xl md:text-2xl">
              Global educational systems need to evolve to keep pace with these changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Future

