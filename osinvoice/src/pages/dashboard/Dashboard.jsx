import React, { useEffect, useState } from "react";
import { Collection } from "./Collection";
import { Activity } from "./Activity";
import { CountCard } from "./CountCard";
import { MonthlySales } from "./MonthlySales";
import { NearByCheques } from "./NearByCheques";
import { useStateContext } from "../../contexts/NavigationContext";
import axiosClient from "../../../axios-client";

export const Dashboard = () => {
  const { user } = useStateContext();
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = () => {
      axiosClient
        .get(`/dashboard/${user.branch}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getData();
  }, []);
  return (
    <>
      <div class="md:flex w-full">
        <CountCard data={data} />
      </div>
      <div class="md:grid md:grid-cols-2  ">
        <Collection data={data} />
        <MonthlySales data={data} />
      </div>
      <div class="md:grid md:grid-cols-2 md:mb-10">
        <Activity />
        <NearByCheques data={data} />
      </div>
    </>
  );
};
