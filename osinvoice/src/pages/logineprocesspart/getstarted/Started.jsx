import React, { useEffect, useState } from "react";
import { useSpring, animated, easings } from "react-spring";
import { useInView } from "react-intersection-observer";

import exp from './../../../assets/images/started1.png'

export const Started = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [ref, inView] = useInView({
        triggerOnce: true,
    });

    const prevDelay = 200;
    const fadeUp = useSpring({
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(25px)",
        config: {
            duration: 800,
            delay: prevDelay,
            easing: easings.easeInSine,
        },
    });
    const fadeUpDes = useSpring({
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(25px)",
        config: {
            duration: 800,
            delay: prevDelay + 200,
            easing: easings.easeInSine,
        },
    });

    useEffect(() => {
        const loaderDelay = 100;

        // Simulate loading delay with setTimeout
        setTimeout(() => {
            if (inView) {
                setIsVisible(true);
            }
        }, loaderDelay);
    }, [inView]);

    return (
        <section
            ref={ref}
            className='overflow-hidden w-full px-[20px] md:p-[5%] h-auto flex flex-col gap-[30px] items-center'>
            <animated.div
                style={fadeUp}
                className="text-center text-[#64728C] text-[40px] font-semibold leading-[60px] md:text-[30px] md:leading-[45px]">
                Let's bring all your income and expenses in one place
                <div className="mt-4 text-left text-[16px] md:text-[18px] leading-[22px] md:leading-[25px] font-semibold">
                    We’re almost ready to dive in!
                </div>
            </animated.div>
            <animated.img style={fadeUpDes} className="object-cover" src={exp} />
            <div className="w-full mt-8">
                <div className="w-[55%] border-b-2 border-[#64728C33] mx-auto"></div>
                <button className="items-start ml-[22%] px-12 py-2 mt-6 font-bold text-white bg-[#7335E5] rounded-[5px] hover:bg-blue-700">
                Let's Go 
            </button>
            </div>
            
        </section>
    )
}
