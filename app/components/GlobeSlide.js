'use client';


import React, { useEffect, useRef, useState } from 'react';
import { createInteractiveGlobe } from './globe'; // Adjust path as needed

const GlobeSlide = () => {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (containerRef.current && !isLoaded) {
            const geoDataUrl = '/globeCoordinates.json'; // Adjust for your Next.js public folder
            const dataUrl = '/languages_per_country.csv'; // Adjust for your Next.js public folder

            createInteractiveGlobe(containerRef.current, geoDataUrl, dataUrl);
            setIsLoaded(true);
        }
    }, [isLoaded]);

    return (
        <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
            <div className="w-full h-auto bg-white rounded-lg p-4" ref={containerRef}>
                {/* The globe will render here */}
            </div>
            <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-2xl">
                <p className="text-white text-xl text-center">
                    "Interestingly, there is little correlation between the most multilingual countries and the main users of language learning apps."
                </p>
                <p className="text-white text-sm mt-4 text-center italic">
                    Figure 11 and 12: Opening Up Martini Glass
                </p>
            </div>
        </div>
    );
};

export default GlobeSlide;
