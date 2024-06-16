import { Card, CardBody, Typography } from '@material-tailwind/react'
import React from 'react'

export const Notifications = () => {
  return (
    <>
      <Card className="h-fit  rounded-none mx-3 md:mx-6 mr-3 font-inter">
        <CardBody className="flex flex-col min-h-[60vh] gap-5 p-3 pl-6 ">
          <div className=" flex justify-between w-full">
            <Typography
              variant="h4"
              className=" font-inter font-bold tracking-wide"
              color="blue-gray"
            >
              Notifications
            </Typography>
          </div>
          <div className='flex items-center justify-center flex-1'>
            <span className=' font-inter font-medium'>
              There are no notifications for this account
            </span>
          </div>
        </CardBody>
      </Card>
    </>
  )
}
