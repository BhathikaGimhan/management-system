import React, { useEffect, useState } from "react";
import { useSpring, animated, easings } from "react-spring";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { WhatWeDoItems } from './../../../utils/dataArrays'

export const WhatDo = () => {

	return (
		<section className='w-full p-[20px] md:p-[7%] flex flex-col gap-6 md:flex-row md:flex-wrap justify-center md:mt-[-70px]'>
             <div  className='flex flex-col w-full items-left'>
        <div  className="text-center w-[95%] md:w-[58%] text-[#64728C] md:text-[30px] font-semibold md:leading-[45px] text-[25px] pb-4">What do you want to do?</div>
        <div  className="text-center w-[95%] md:w-[58%] text-[#64728C] md:text-[18px] font-medium md:leading-[25px] text-lg leading-[30px]">
        Your choices help personalize your setup.
        </div>
      </div>
			{WhatWeDoItems.map((item, itemIndex) => {
				const [ref, inView] = useInView({
					triggerOnce: true,
				});

				const prevDelay = 1000;
				const [isVisible, setIsVisible] = useState(false);
				const fadeDes = useSpring({
					opacity: isVisible ? 1 : 0,
					transform: isVisible ? "translateY(0)" : "translateY(25px)",
					config: {
						duration: 800,
						delay: prevDelay + 200,
						easing: easings.easeInSine,
					},
				});

				useEffect(() => {
					const loaderDelay = 200;

					// Simulate loading delay with setTimeout
					setTimeout(() => {
						if (inView) {
							setIsVisible(true);
						}
					}, loaderDelay);
				}, [inView]);

				
				return (
					<animated.div style={fadeDes} ref={ref} className={`w-full md:w-[33%] hover:bg-[#FFF2E9]  bg-white flex flex-col gap-6 rounded-[10px] p-5  border border-[#979797] hover:border-[#7335E5]`} key={itemIndex}>
						<div className="flex items-center gap-3">
							<img src={item.icon} className="w-[36.25px] h-[36.25px] " alt="" />
							<div className="text-[18px] font-semibold leading-[25px] text-[#64728C] hover:text-[#7335E5]">{item.title}</div>
						</div>
					</animated.div>
				)
			})}
            <div className="flex justify-center w-full mt-8">
                <div className="w-[68%] border-b-2 border-[#64728C33] mx-auto"></div>
            </div>
            <div className="flex w-full mt-4 ml-[16%] mx-auto">
                <Link to="/business" className="inline-flex mr-4">
                    <button className="md:text-[20px] text-[#64728C] border-2 border-[#64728C] rounded-[10px] text-sm font-bold leading-10 md:leading-[28px] md:px-6 md:py-2 transition-colors duration-300 ease-in-out">
                        Back
                    </button>
                </Link>
                <Link to="/colorlogo" className="inline-flex ">
                    <button className="mr-2 bg-[#7335E5] hover:bg-[#461058] md:text-[20px] rounded-[10px] text-white text-sm font-bold leading-10 md:leading-[28px] md:px-6 md:py-2 transition-colors duration-300 ease-in-out">
                        Next
                    </button>
                </Link>
            </div>
		</section>
	)
}
