import React, { useState } from "react";
import { Badge, Button, Card, Form, ListGroup, Stack, Container } from "react-bootstrap";
import { APIUrl } from "../src/constant/global";
import ActivityTable from "../componenet/ActivityTable";
import ActivityBoard from "../componenet/ActivityBoard";

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
                setActivities([])
            }
            return response.json()
        })
        .then((data) => {
            setActivities(data["activity"])
            setLoading(false)
        })
    }
     
    return <Container>
        <Form onSubmit={onFormSubmit} className="my-2">
            
            <Stack direction="horizontal" gap={3}>
                <Form.Label className="w-25" >表演者</Form.Label>
                <Form.Control className="ms-auto" 
                    name="performerName"
                    onChange={onInput}
                    value={performerName}/>
                <Button variant="primary" type="submit">Search</Button>
            </Stack>
        </Form>
        <ActivityBoard className={"bg-info text-white"} isLoading={loading} activities={activities} />
    </Container>;
}