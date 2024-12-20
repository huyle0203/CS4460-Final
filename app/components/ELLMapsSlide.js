'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createSideBySideMaps } from './D3Maps.js'


const ELLMapsSlide = () => {
    const containerRef = useRef(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (containerRef.current && !isLoaded) {
            const geoDataUrl = './us-states.json';

            createSideBySideMaps(containerRef.current, geoDataUrl)
            setIsLoaded(true)
        }
    }, [isLoaded])

    return (
        <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
            <div className="w-full h-auto bg-white rounded-lg p-4" ref={containerRef}>
                {/* The D3 maps will render here */}
            </div>
            <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-2xl">
                <p className="text-white text-xl text-center">
                    Brick-and-mortar education is not ineffective. Technology will not replace it.
                    In fact, there is a steady correlation between the supply of English Language Learner (ELL) programs
                    and the demand of foreign language speakers. Nevertheless, technology accelerates language learning.
                </p>
                <p className="text-white text-sm mt-4 text-center italic">
                    Figure 4 and Figure 9: Brushing and Linking by State (Scatter Plot or Choropleth)
                </p>
            </div>
        </div>
    )
}

export default ELLMapsSlide
