import React, { useState } from "react";
import { Badge, Button, Card, Form, ListGroup, Stack } from "react-bootstrap";
import { APIUrl } from "../src/constant/global";

export default function PerformerActivity() {
    const [loading, setLoading] = useState(true)
    const [activities, setActivities] = useState([])
    const [performerName, setPerformerName] = useState(""),
    onInput = ({target:{value}}) => setPerformerName(value),
    onFormSubmit = e => {
        e.preventDefault()
        console.log("search:", performerName)
        fetch(`${APIUrl}/performerActivity/${encodeURIComponent(performerName)}`)
        .then((response) => {
            if(response.status != 200){
                console.log("error")
            }
            return response.json()
        })
        .then((data) => {
            setActivities(data["activity"])
            setLoading(false)
        })
        // setValue()
    }

    const splitPerformers = (performers) => {
		let performerArray = performers.split(",")
		return performerArray.map((performer) => (
			<Badge bg="secondary" style={{marginTop: "5px"}}>{performer}</Badge>
		))
	}

    const convertTime = (time, datailTime=true) => {
        let selectedTime = new Date(time)
        let weekdays = "日,一,二,三,四,五,六".split(",");
        let timeString = `${selectedTime.getFullYear()} 年 ${(selectedTime.getMonth()+1).toString().padStart(2, "0")} 月 ${(selectedTime.getDate()).toString().padStart(2, "0")} 日 (${weekdays[selectedTime.getDay()]})`
        return datailTime ? timeString + ` ${selectedTime.getHours().toString().padStart(2, "0")} 時 ${selectedTime.getMinutes().toString().padStart(2, "0")} 分` : timeString
    }
     
    return <div className='m-5'>
        <Form onSubmit={onFormSubmit}>
            <Form.Group className="mb-3" controlId="formGridName">
                <Form.Label>表演者名稱</Form.Label>
                <Form.Control
                    name="performerName"
                    onChange={onInput}
                    value={performerName}
                    // value={performerName}
                // value={values.activityName}
                // onChange={handleChange}
                />

            </Form.Group>
            <Button variant="primary" type="submit">
                查詢
            </Button>
        </Form>

        <div>
			{loading ? (<p>Loading...</p>) : (
				<ListGroup variant="flush">
					{activities?.map((activity) => (
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
    </div>;
}