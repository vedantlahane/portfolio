// src/hooks/useReducedMotion.jsx  

import { useState, useEffect } from "react";

export const useReducedMotion = () =>{

    const [prefersReduced, setPrefersReduced] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReduced(mediaQuery.matches);
        const handleChange = (e) =>{
            setPrefersReduced(e.matches);
        }
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    },[]);

    return prefersReduced;

    
}