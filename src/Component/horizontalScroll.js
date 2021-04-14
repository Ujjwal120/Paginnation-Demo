import React, { useEffect, useRef } from 'react';

import './horizontalScroll.css';

const HorizontalScroll = (props) => {

    let vidCount = useRef(0), startedLoading = useRef(false);

    let slider = useRef(null), mouseDown = useRef(false), startX = useRef(0), scrollLeft = useRef(0);
    let x = useRef(0), scroll = useRef(0), maxScrollLeft = useRef(0);
    let sliderChild = useRef(null);

    const createDiv = () => {
        return new Promise((resolve, reject) => {
            let div1 = document.createElement('div');
            div1.className = 'box';
            div1.onload  = resolve(div1);
        })
    }

    const makeRequest = async(num) => {
        let i;
        for(i = 0; i < num; i++) {
            // make axios request
            await createDiv().then((res) => {
                sliderChild.current.appendChild(res);
            });
        }
    }

    const startDragging = (e) => {
        mouseDown.current = true;
        startX.current = e.pageX - slider.current.offsetLeft;
        scrollLeft.current = slider.current.scrollLeft;
    };

    const stopDragging = (e) => {
        mouseDown.current = false;
    };

    const mouseMotion = (e) => {
        e.preventDefault();
        if(!mouseDown.current) { return; }

        x.current = e.pageX - slider.current.offsetLeft;
        scroll.current = x.current - startX.current;
        slider.current.scrollLeft = scrollLeft.current - scroll.current;
        
        if(!startedLoading.current && slider.current.scrollLeft + 1 >= maxScrollLeft.current && vidCount.current < props.limit) {
            startedLoading.current = true;
            
            // here make the request
            let possible_vid = Math.min(props.withEach, props.limit-vidCount.current);
            
            makeRequest(possible_vid).then(() => {
                vidCount.current += possible_vid;
                maxScrollLeft.current = slider.current.scrollWidth - slider.current.clientWidth;
                startedLoading.current = false;
            });
        }
    }
    
    useEffect(() => {
        slider.current = document.querySelector('.parent');
        sliderChild.current = document.querySelector('.child');
        maxScrollLeft.current = slider.current.scrollWidth - slider.current.clientWidth;

        // the 5 box div that we have hardcoded in App.js
        // can be generated here in a same way by making a single call make request so everything will be dynamic 
        
        slider.current.addEventListener('mousemove', mouseMotion);
        
        // Add the event listeners
        slider.current.addEventListener('mousedown', startDragging, false);
        slider.current.addEventListener('mouseup', stopDragging, false);
        slider.current.addEventListener('mouseleave', stopDragging, false);

        return () => {
            slider.current.removeEventListener('mousemove', mouseMotion);
            slider.current.removeEventListener('mousedown', startDragging);
            slider.current.removeEventListener('mouseup', stopDragging);
            slider.current.removeEventListener('mouseleave', stopDragging);
        }
    });


    return <div className = "parent">
        <div className = "child">
            {props.children}
        </div>
    </div>;
}

export default HorizontalScroll;