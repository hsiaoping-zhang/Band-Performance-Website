import Form from 'react-bootstrap/Form';
import { APIUrl } from "../src/constant/global";
import { GetAuthToken } from "../utils/Cookie";
import React from "react";

export default function WeekSelector({ setData, setLoading, handleExpired }) {
	let today = new Date()

	const mondayOffset = (dayOfWeek) => {
		return (dayOfWeek === 0 ? -6 : 1) - dayOfWeek
	}

	const lastMonday = today.setDate(today.getDate() + mondayOffset(today.getDay()));
    const convertTime = (time, datailTime=true) => {
        let selectedTime = new Date(time)
        let weekdays = "日,一,二,三,四,五,六".split(",");
        let timeString = `${selectedTime.getFullYear()} 年 ${(selectedTime.getMonth()+1).toString().padStart(2, "0")} 月 ${(selectedTime.getDate()).toString().padStart(2, "0")} 日 (${weekdays[selectedTime.getDay()]})`
        return datailTime ? timeString + ` ${selectedTime.getHours().toString().padStart(2, "0")} 時 ${selectedTime.getMinutes().toString().padStart(2, "0")} 分` : timeString
    }

	// get area list pass to select element
	const fetchWeekActivitiy = async (weekNumber) => {
		let token = GetAuthToken()
		fetch(APIUrl + `/weekActivity/${weekNumber}`, {
			method: "GET",
			// headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }
		})
		.then((response) => {
			switch(response.status){
				case 200:
					return response.json()
				case 401:
					// unauthorized
                    setData(null)
					handleExpired()
					return
				default:
					// error
			}
		})
		.then((data) => {
            let activities = data["activity_array"]
            setData(activities)
			setLoading(false)
		});

	}

	const weekString = (weeks) => {
		let thisWeekStartDate = new Date(lastMonday);
		thisWeekStartDate.setDate(new Date(lastMonday).getDate() + weeks * 7);
		
		let thisWeekEndDate = new Date(thisWeekStartDate).setDate(new Date(thisWeekStartDate).getDate() + 6)
		return`${convertTime(thisWeekStartDate, false)} ~ ${convertTime(thisWeekEndDate, false)}`
	}

	function handleSelect(event){
		setLoading(true)
		fetchWeekActivitiy(event.target.value)
	}

	const numbers = Array.from({ length: 10 }, (_, i) => i);
	return (
		<Form.Select aria-label="選擇週次" onChange={handleSelect}>
			{numbers.map((number) => (
				<option key={number} value={number}>
					{weekString(number)}
				</option>
			))}
		</Form.Select>
	)
}