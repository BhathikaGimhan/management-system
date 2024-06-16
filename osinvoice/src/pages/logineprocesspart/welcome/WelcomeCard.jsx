import React, { useEffect, useState } from "react";
import { useSpring, animated, easings } from "react-spring";
import { useInView } from "react-intersection-observer";

export const WelcomeCard = ({ icon, des, key }) => {
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
    <animated.div style={fadeUp} ref={ref} className="md:w-[16%] w-full flex flex-col items-center md:items-start gap-4 xl:gap-2 xl:mb-5 rounded-4 overflow-hidden p-1 md:pl-4" key={key}>
      <img src={icon} className="md:w-[178px] w-[53px]" alt="" />
      <div className="text-[#64728C] text-[14px] font-normal leading-[21px] pb-2 xl:pb-0 text-opacity-80 text-center md:text-center w-[85%] md:w-[90%] pt-6">{des}</div>
      <div className="flex flex-row items-center gap-2 bg-gray-200 rounded"></div>
      
    </animated.div>

    
    
  );
};