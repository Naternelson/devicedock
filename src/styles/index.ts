import { useEffect, useRef } from 'react';
import './animations.scss';
import './custom.css';
export const useDOMListeners = () => {
	const ref = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if(!ref.current) return;
        const el = ref.current;
        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if(mutation.type === 'childList') {
                    el.querySelectorAll(".delaygroup").forEach((element, i) => { // Changed variable name from 'el' to 'element'
                        element.querySelectorAll(".fadeup").forEach((el, i) => {
                            el.setAttribute("style", `animation-delay: ${i * 0.1}s`);
                        });
                    });
                }
            }
        });
        observer.observe(el, config);
        return () => {
            observer.disconnect();
        }

    },[ref])
    return ref 
};
