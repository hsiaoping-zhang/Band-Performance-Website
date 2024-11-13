import React, { useEffect } from "react";
import { APIUrl } from "../src/constant/global";
// import { UserContext } from "../Context";

export default function About() {

  const fetchCityList = async () => {
    console.log('enter city list')
    const cityApiUrl = APIUrl + "/CityList"
    return fetch(cityApiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
            let cities = data["data"]
            console.log(cities)
        });
  }

  useEffect(() => {
    fetchCityList()
  })
  return <div>About</div>;
}
