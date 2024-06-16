import React, { useEffect, useState } from "react";
import { useSpring, animated, easings } from "react-spring";
import { useInView } from "react-intersection-observer";
// import { WelcomeArray } from "./../../../utils/dataArrays";
import { WelcomeCard } from "./WelcomeCard";
import { Link } from "react-router-dom";
import Line from "./../../../assets/images/Line 49.png";
import welcome1 from "./../../../assets/images/welcome1.png";
import welcome2 from "./../../../assets/images/welcome2.png";
import welcome3 from "./../../../assets/images/welcome3.png";

export const WelcomePage = () => {
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
    <>
      <section
        ref={ref}
        className="w-full px-[3%] flex justify-center flex-col pb-20 pt-8"
      >
        <div className="h-[5px] w-full bg-[#f7f5f5] relative">
          <div className="w-[30px] aspect-square rounded-full bg-[#7335E5] -top-[12.5px] absolute"></div>
        </div>
        <div className="flex flex-col items-center w-full mt-12">
          <animated.div
            style={fadeUp}
            className="text-center font-poppins text-semibold text-[30px] leading-[45px] text-[#64728C]"
          >
            Welcome! We're delighted to have you here.
          </animated.div>
          <animated.div
            style={fadeUpDes}
            className="text-center text-[#64728C] font-poppins text-semibold leading-[24px] mt-5"
          >
            Here's what we'll do together right now.
          </animated.div>
        </div>
        <animated.div
          className="flex justify-center items-top mt-16 w-[1000px] mx-auto border-b border-[#e0e3e8] pb-10"
          style={fadeUpDes}
        >
          <div className="w-[180px] aspect-square">
            <img src={welcome1} />
            <p className="text-center font-poppins font-medium text-[14px] leading-[22px] text-[#64728C] w-[90%] mt-5">
              Tell us what you need help with
            </p>
          </div>
          <div className="w-[180px] h-[80px] border-b border-[#b0b7c4] border-dashed"></div>
          <div className="w-[180px] aspect-square">
            <img src={welcome2} />
            <p className="text-center font-poppins font-medium text-[14px] leading-[22px] text-[#64728C] w-[90%] mt-5">
              We'll ask a few questions to get to know your business
            </p>
          </div>
          <div className="w-[180px] h-[80px] border-b border-[#b0b7c4] border-dashed"></div>
          <div className="w-[180px] aspect-square">
            <img src={welcome3} />
            <p className="text-center font-poppins font-medium text-[14px] leading-[22px] text-[#64728C] w-[90%] mt-5">
              We'll get started on what you're here for
            </p>
          </div>
        </animated.div>
        <animated.div className="w-[1000px] mx-auto" style={fadeUpDes}>
          <Link to="/business">
            <button className="bg-[#7335E5] font-nunito font-bold text-white text-[20px] px-4 py-0.5 rounded-[10px] mt-5 hover:opacity-70">
              Next
            </button>
          </Link>
        </animated.div>
      </section>
    </>
  );
};
