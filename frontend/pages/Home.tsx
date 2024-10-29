import React, {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { APIUrl } from "../src/constant/global";
import ListGroup from 'react-bootstrap/ListGroup';

// import DatePicker from "react-datepicker";
import { Badge, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { UserContext } from "../Context";
import { GetAuthToken, GetToken, SetToken } from "../utils/Cookie";
import { FetchGoogleUserInfo } from "../utils/GoogleLogin";
import InvalidJWTModal from "../componenet/InvalidJWTModal";
import ActivityTable from "../componenet/ActivityTable";
import ActivityBoard from "../componenet/ActivityBoard";
// import "../../node_modules/react-datepicker/dist/react-datepicker.css";

const convertTime = (time, datailTime=true) => {
	let selectedTime = new Date(time)
	let weekdays = "日,一,二,三,四,五,六".split(",");
	let timeString = `${selectedTime.getFullYear()} 年 ${(selectedTime.getMonth()+1).toString().padStart(2, "0")} 月 ${(selectedTime.getDate()).toString().padStart(2, "0")} 日 (${weekdays[selectedTime.getDay()]})`
	return datailTime ? timeString + ` ${selectedTime.getHours().toString().padStart(2, "0")} 時 ${selectedTime.getMinutes().toString().padStart(2, "0")} 分` : timeString
}

const WeekSelector = ({ data, setData, loading, setLoading, handleExpired }) =>{
	let today = new Date()
	// const [data, setData] = useState(data)
	// const [loading, setLoading] = useState(loading)
	const mondayOffset = (dayOfWeek) => {
		return (dayOfWeek === 0 ? -6 : 1) - dayOfWeek
	}
	const lastMonday = today.setDate(today.getDate() + mondayOffset(today.getDay()));
	// convertTime(weekStartDate, false)} ~ {convertTime(weekEndDate, false)

	// get area list pass to select element
	const fetchWeekActivitiy = async (weekNumber) => {
		console.log("GET fetchWeekActivitiy")
		
		let token = GetAuthToken()

		fetch(APIUrl + `/weekActivity/${weekNumber}`, {
			method: "GET",
			headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }
		})
		.then((response) => {
			switch(response.status){
				case 200:
					return response.json()
				case 401:
					// unauthorized
					handleExpired()
					return
				default:
					// error
			}
			return response.json()
		})
		.then((data) => {
			if(data.status != 200){
				setData(null)
			}
			else{
				let activities = data["activity"]
				setData(activities)
				console.log("set data:", data)
			}
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
		console.log(event.target.value)
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

export default function Home() {
	// const { user, setUser } = useContext(UserContext)
	const [data, setData] = useState([]);
	const [areaData, setAreaData] = useState([]);
  	const [loading, setLoading] = useState(true);
	const [selectedArea, setSelectedArea] = useState("A");
	const today = new Date()
	const mondayOffset = (dayOfWeek) => {
		return (dayOfWeek === 0 ? -6 : 1) - dayOfWeek
	}
	const weekStartDate = new Date().setDate(today.getDate() + mondayOffset(today.getDay()))
	const weekEndDate = new Date().setDate(today.getDate() + mondayOffset(today.getDay()) + 6)
	// const isAuth = (GetToken("level") != "") && (GetToken("level") != "guest")
	const [expired, setExpired] = useState(false)

	// get area list pass to select element
	const fetchActivitiy = async () => {
		// return null
		return fetch(APIUrl + "/activity")
		.then((response) => {
			switch(response.status){
				case 200:
					return response.json()
				case 401:
					// unauthorized
					handleTokenExpired()
					return
				default:
					// error
			}
			
		})
		.then((data) => {
			let activities = data["activity_array"]
			setData(activities)
			setAreaData(activities)
			setLoading(false)
		});
	}

	const handleTokenExpired = () => {
		setExpired(true)
	}

	const changeArea = (e) => {
		// let area = e.target.value
		let area;
		if(!!e){
			setSelectedArea(e.target.value)
			area = e.target.value
		}
		else{
			area = selectedArea
		}

		if(area == "A"){
			setAreaData(data)
			return
		}
		let selectedActivities = data?.filter((activity) => {
			return activity["area"] == area
		})
		setAreaData(selectedActivities)
	}

	useEffect(() => {
		fetchActivitiy();
	}, []);

	useEffect(() =>{
		changeArea(null)
	}, [data])

  return (
	<Container className="mt-4">
		<Row className="justify-content-md-center">
			<Col>
				<WeekSelector data={data} setData={setData} loading={loading} handleExpired={handleTokenExpired} setLoading={setLoading}></WeekSelector>
			</Col>
		</Row>
		<Row>
		<Col>
			<Form.Select aria-label="選擇區域" onChange={changeArea} value={selectedArea} style={{marginTop: "10px"}}>
				<option value="A">全部</option>
				<option value="北部">北部</option>
				<option value="中部">中部</option>
				<option value="南部">南部</option>
				<option value="東部">東部</option>
				<option value="離島">離島</option>
			</Form.Select>
		</Col>
		</Row>
		<Row>
		<ActivityBoard className={"bg-secondary text-white"} isLoading={loading} activities={areaData} />
		   <InvalidJWTModal isShow={expired} />
		</Row>
	</Container>
  );
}


