import React, { useEffect } from "react";
import { APIUrl } from "../src/constant/global";

export default function About() {

  const fetchCityList = async () => {
    return fetch(`${APIUrl}/CityList`)
        .then((response) => response.json())
        .then((data) => {
            let cities = data["data"]
        });
  }

  useEffect(() => {
    fetchCityList()
  })
  return <div>About</div>;
}
