import React from "react";
import { Card, Typography, CardBody } from "@material-tailwind/react";

export const ActionItem = () => {
  return (
    <Card className="md:h-[340px] h-auto rounded-none mx-3 md:ml-6 ">
      <CardBody className="flex flex-col gap-5 p-3 pl-6 ">
        <div className=" flex justify-between w-full">
          <Typography
            variant="h5"
            className=" font-inter font-light tracking-wide"
            color="blue-gray"
          >
            Action Items
          </Typography>
        </div>

        <div className="text-gray-500 md:text-lg text-base">
          🎉 You're all caught up
        </div>
      </CardBody>
    </Card>
  );
};
