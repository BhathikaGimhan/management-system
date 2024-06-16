const HalfCircleProgressBar = ({ progress, radius, strokeWidth }) => {
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg
      width={radius * 2}
      height={radius}
      viewBox={`0 0 ${radius * 2} ${radius}`}
    >
      <circle
        className="fill-current text-transparent stroke-current"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        r={radius - strokeWidth / 2}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

export default HalfCircleProgressBar;
