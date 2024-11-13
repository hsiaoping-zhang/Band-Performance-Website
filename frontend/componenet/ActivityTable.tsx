import React from "react";
import { Badge, Button, Card, ListGroup, Modal, Stack } from "react-bootstrap";

export default function ActivityTable({ activities }) {
    const splitPerformers = (performers) => {
        let performerArray = performers.split(",")
        return performerArray.map((performer) => (
            <Badge bg="secondary" style={{ marginTop: "5px" }}>{performer}</Badge>
        ))
    }

    const convertTime = (time, datailTime = true) => {
        let selectedTime = new Date(time)
        let weekdays = "日,一,二,三,四,五,六".split(",");
        let timeString = `${selectedTime.getFullYear()} 年 ${(selectedTime.getMonth() + 1).toString().padStart(2, "0")} 月 ${(selectedTime.getDate()).toString().padStart(2, "0")} 日 (${weekdays[selectedTime.getDay()]})`
        return datailTime ? timeString + ` ${selectedTime.getHours().toString().padStart(2, "0")} 時 ${selectedTime.getMinutes().toString().padStart(2, "0")} 分` : timeString
    }

    return (
        activities != null && activities.length > 0 ? (
            <ListGroup variant="flush">
                {activities?.map((activity) => (
                    <ListGroup.Item className="d-flex justify-content-between align-items-start bg-light text-dark">
                        <div className="ms-2 me-auto w-100">
                            {activity["is_free"] ? (<Badge pill bg="success" style={{ marginRight: "5px" }}>免費</Badge>) : (null)}
                            <Badge bg="primary" pill>
                                {activity["area"]}
                            </Badge>

                            <div className="fw-bold mt-2">{activity["name"]}</div>
                            <div>{activity["city"]} / {activity["location"]}</div>
                            <div>日期時間：{convertTime(activity["time"])}</div>
                            <div>演出者</div>
                            <Stack className="d-flex flex-wrap" direction="horizontal" gap={2} style={{ fontSize: "larger" }}>
                                {splitPerformers(activity["performers"])}
                            </Stack>
                            {activity["note"] != "" ? (
                                <div className="w-100">
                                    <div>備註</div>
                                    <Card body>{activity["note"]}</Card>
                                </div>

                            ) : (null)}

                            
                        </div>

                    </ListGroup.Item>
                ))}
            </ListGroup>) :
            (<div className="bg-light text-dark" style={{
                borderBottomLeftRadius: "5px",
                borderBottomRightRadius: "5px",
                width: "100%", height: "100px",
                textAlign: "center",
                alignContent: "center",
                fontSize: "large",
            }}>
                查無結果
            </div>)
    )
}