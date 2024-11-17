import React, {act, useEffect, useState} from "react";
import Form from 'react-bootstrap/Form';
import { APIUrl } from "../src/constant/global";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { OAuthSignIn } from "../utils/GoogleLogin";
import ActivityBoard from "../componenet/ActivityBoard";
import InfoModal from "../componenet/InformationModal";
import WeekSelector from "../componenet/WeekSelector";

export default function Home() {
	// const { user, setUser } = useContext(UserContext)
	const [data, setData] = useState([]);
	const [areaData, setAreaData] = useState([]);
  	const [loading, setLoading] = useState(true);
	const [selectedArea, setSelectedArea] = useState("A");
	const [expired, setExpired] = useState(false)

	// get area list pass to select element
	const fetchActivitiy = async () => {
		return fetch(APIUrl + "/activity", {
			method: "GET",
			// headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }
		})
		.then((response) => {
			switch(response.status){
				case 200:
					return response.json()
				case 401:  // unauthorized
					handleTokenExpired()
					return
				default:  // error
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
				<WeekSelector setData={setData} handleExpired={handleTokenExpired} setLoading={setLoading}></WeekSelector>
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
			<InfoModal size="medium" isShow={expired} title="登入過期" info="請重新登入" handleClose={OAuthSignIn} btnText="重新登入" />
		</Row>
	</Container>
  );
}


