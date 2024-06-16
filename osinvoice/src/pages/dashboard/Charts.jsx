import { Card, CardBody, Tooltip } from "@material-tailwind/react";
import { SemiCircleProgress } from "react-semicircle-progressbar";
// import SemiCircleProgress from 'react-semicircle-progressbar';

export const Charts = () => {
  return (
    <Card className="md:h-[340px] h-auto rounded-none mx-3 md:ml-6">
      <CardBody className="flex flex-col gap-5 p-3 pl-6 ">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="flex justify-center">
              <SemiCircleProgress
                percentage={50}
                size={{
                  width: 200,
                  height: 200,
                }}
                strokeWidth={10}
                strokeColor="#fc3c04"
              />
            </div>

            <div className="text-center text-sm">TIME TO PAY</div>
            <Tooltip content="Generated at Feb 27, 2024">
              <div className="text-center  text-sm ">____</div>
            </Tooltip>
            <div className="text-center text-sm pt-3">A/R BALANCE</div>
            <div className="text-center text-lg pt-3">LKR 5,300.00</div>
          </div>
          <div className="md:w-1/3 md:py-0 py-5">
            <div className="flex justify-center">
              <SemiCircleProgress
                percentage={80}
                size={{
                  width: 200,
                  height: 200,
                }}
                strokeWidth={10}
                strokeColor="#fc3c04"
              />
            </div>

            <div className="text-center text-sm">CEI</div>
            <Tooltip content="Generated at Feb 27, 2024">
              <div className="text-center  text-lg ">33%</div>
            </Tooltip>
            <div className="text-center text-sm pt-3">OPEN ITEMS</div>
            <div className="text-center text-lg pt-3">2</div>
          </div>
          <div className="md:w-1/3">
            <div className="flex justify-center">
              <SemiCircleProgress
                percentage={20}
                size={{
                  width: 200,
                  height: 200,
                }}
                strokeWidth={10}
                strokeColor="#fc3c04"
              />
            </div>

            <div className="text-center text-sm">DSO</div>
            <Tooltip content="Generated at Feb 27, 2024">
              <div className="text-center  text-sm ">7 days</div>
            </Tooltip>
            <div className="text-center text-sm pt-3">EXPECTED PAYMENTS</div>
            <div className="text-center text-lg pt-3">LKR 0.00</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
