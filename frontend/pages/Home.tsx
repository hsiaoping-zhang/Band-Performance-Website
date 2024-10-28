import React, {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { APIUrl } from "../src/constant/global";
import ListGroup from 'react-bootstrap/ListGroup';

// import DatePicker from "react-datepicker";
import { Badge, Card, Stack } from "react-bootstrap";
import { UserContext } from "../Context";
import { GetAuthToken, GetToken, SetToken } from "../utils/Cookie";
import { FetchGoogleUserInfo } from "../utils/GoogleLogin";
import InvalidJWTModal from "../componenet/InvalidJWTModal";
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
		
		// return null
		// let permissionId = GetToken("permission ID").toString()
		// if(!permissionId){
		// 	console.log("not user can not search")
		// }
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
	const isAuth = (GetToken("level") != "") && (GetToken("level") != "guest")
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
		
		// console.log("change:", data.length)

		if(area == "A"){
			setAreaData(data)
			return
		}
		let selectedActivities = data?.filter((activity) => {
			return activity["area"] == area
		})
		setAreaData(selectedActivities)
		
	}

	const splitPerformers = (performers) => {
		let performerArray = performers.split(",")
		return performerArray.map((performer) => (
			<Badge bg="secondary" style={{marginTop: "5px"}}>{performer}</Badge>
		))
	}

	useEffect(() => {
		fetchActivitiy();
		// console.log(GetToken("level"))
		console.log("isAuth:", isAuth)
	}, []);

	useEffect(() =>{
		// console.log(selectedArea, data.length)
		changeArea(null)
		// setAreaData(result)
		
	}, [data])

  return (
    <div className='m-5'> {/* style={{backgroundColor: "#f6f7f8"}} */}
		{
			isAuth ? (<WeekSelector data={data} setData={setData} loading={loading} handleExpired={handleTokenExpired} setLoading={setLoading}></WeekSelector>) : (
				<div style={{textAlign: "center", margin: "5px"}}>查詢區間：{convertTime(weekStartDate, false)} ~ {convertTime(weekEndDate, false)}</div>
			)
		}
      <div>
		<Form.Select aria-label="選擇區域" onChange={changeArea} value={selectedArea} style={{marginTop: "10px"}}>
			<option value="A">全部</option>
			<option value="北部">北部</option>
			<option value="中部">中部</option>
			<option value="南部">南部</option>
			<option value="東部">東部</option>
			<option value="離島">離島</option>
		</Form.Select>
	  </div>
	  <div style={{backgroundColor: "#8d949e", 
	  	borderTopLeftRadius: "10px", 
		borderTopRightRadius: "10px", 
		width: "100%", height: "50px", 
		marginTop: "5px",
		textAlign: "center",
		alignContent: "center",
		fontSize: "large",
		color: "white"}}>
			活動列表
		</div>
	  <div>
			{loading ? (<p>Loading...</p>) : (
				<ListGroup variant="flush">
					{areaData?.map((activity) => (
					<ListGroup.Item className="d-flex justify-content-between align-items-start">
					<div className="ms-2 me-auto">
						<div className="fw-bold">{activity["name"]}</div>
						<div>{activity["city"]} / {activity["location"]}</div>
						<div>日期時間：{convertTime(activity["time"])}</div>
						<div>演出者</div>
						<Stack direction="horizontal" gap={2} style={{fontSize: "larger"}}>
							{splitPerformers(activity["performers"])}
						</Stack>
						{activity["note"] != "" ? (
							<div><div>備註</div>
							<Card body>{activity["note"]}</Card></div>
						) : (null)}
					</div>
					{activity["is_free"] ? (<Badge pill bg="success" style={{marginRight: "5px"}}>免費</Badge>) : (null)}
					
					<Badge bg="primary" pill>
					{activity["area"]}
					</Badge>
				</ListGroup.Item>
					))}
				</ListGroup>
			)}

	  </div>
	  <InvalidJWTModal isShow={expired} />
    </div>
  );
}


