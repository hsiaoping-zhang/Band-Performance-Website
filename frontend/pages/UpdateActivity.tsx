import React, {useEffect, useState} from 'react';
import { Container, InputGroup, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { APIUrl, CityMapToArea } from '../src/constant/global';
import * as formik from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { GetAuthToken } from '../utils/Cookie';

export default function UpdateActivity() {
    const { activity_id } = useParams(); // 获取路由参数 id
    const [cityData, setCityData] = useState([])
  	const [loading, setLoading] = useState(true)
    const [dataIsReady, setDataReady] = useState(false)
    const cityApiUrl = APIUrl + "/CityList"
    const [activityData, setActivityData] = useState(null)
    // let activityData = new Object()
    const [isFreeChecked, setChecked] = useState(false); 
    const [submitSuccess, setSubmitStatus] = useState(false);
    const [submitInfo, setSubmitInfo] = useState("")
    const handleClose = () => navigate("/activityList");
    const token = GetAuthToken()

    const navigate = useNavigate();

    // get area list pass to select element
	const fetchCityList = async () => {
		console.log('enter city list')
		return fetch(cityApiUrl)
		.then((response) => response.json())
		.then((data) => {
			let cities = data["data"]
			setCityData(cities)
			setLoading(false)
            
		});
	}

    const fetchActivity = async (id) => {
        fetch(APIUrl + `/activity/${id}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
        })
        .then((response) => response.json())
        .then((data) => {
            setActivityData(data["activity"])
            setChecked(data["activity"]["is_free"])
            setDataReady(true)
        })
    }

    const handleCheckChange = (e) => {
        isFreeChecked ? setChecked(false) : setChecked(true)
    }

    const { Formik } = formik;

    const schema = yup.object().shape({
        activityName: yup.string().default("").min(1),
        activityCity: yup.string().required(),
        activityLocation: yup.string().required(),
        activityYear: yup.number().required(),
        activityMonth: yup.number().required().min(1).max(12),
        activityDate: yup.number().required().min(1).max(31),
        activityHour: yup.number().required().min(0).max(24),
        activityMinute: yup.number().required().min(0).max(59),
        activityPerformers: yup.string().required(),
    });

    const convertTime = (time) => {
        let activityTime = new Date(time);
        return activityTime
        // console.log(time)
    }

    const SubmitUpdateActivity = (values) => {
        event.preventDefault()
        let cityArea = CityMapToArea(values.activityCity)
        let monthIndex = values.activityMonth - 1
        let activityTime = new Date(values.activityYear, monthIndex, values.activityDate, values.activityHour, values.activityMinute)
        console.log("enter")
        fetch(APIUrl + `/activity/${activity_id}`, {method: "PATCH",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ 
                name: values.activityName,
                area: cityArea,
                city: values.activityCity,
                location: values.activityLocation,
                time: activityTime,
                performers: values.activityPerformers,
                is_free: isFreeChecked,
                note: values.activityNote
            })
        })
        .then(response => {
            if(response.status != 200){
                setSubmitInfo("更新失敗，請重新嘗試或聯絡管理員")
                setSubmitStatus(true)
            }
            else{
                setSubmitInfo(`活動更新成功，活動 ID : ${activity_id}，即將跳回首頁`)
                setSubmitStatus(true)
            }
        })
        
    }

    useEffect(() => {
		console.log('fetch data');
		fetchCityList();
        fetchActivity(activity_id)
	}, []);

    
  return (
    <Container>
        <h1 className='my-2' style={{textAlign: "center"}}>更新活動</h1>
        {dataIsReady ? (
            <Formik
                validationSchema={schema}
                onSubmit={SubmitUpdateActivity}
                initialValues={{
                activityName: activityData?.name, 
                activityCity: activityData?.city,
                activityLocation: activityData?.location,
                activityYear: (convertTime(activityData?.time).getFullYear()),
                activityMonth: ((convertTime(activityData?.time).getMonth()) + 1),
                activityDate: (convertTime(activityData?.time).getDate()),
                activityHour: (convertTime(activityData?.time).getHours()),
                activityMinute: (convertTime(activityData?.time).getMinutes()),
                activityPerformers: activityData?.performers,
                activityIsFree: isFreeChecked,
                activityNote: activityData?.note
            }}
                >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formGridName">
                            <Form.Label>活動名稱</Form.Label>
                            <Form.Control
                                name="activityName" 
                                value={values.activityName} 
                                onChange={handleChange}
                                isInvalid={!!errors.activityName}/>
                            <Form.Control.Feedback type="invalid">
                                    活動名稱不可為空
                                </Form.Control.Feedback>
                        </Form.Group>
        
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>縣市</Form.Label>
                                <Form.Select 
                                    name="activityCity"
                                    onChange={handleChange}
                                    value={values.activityCity}>
                                    {loading ? <option>...</option> : (
                                        cityData.map((city) => (
                                            <option value={city}>{city}</option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>
        
                            <Form.Group as={Col} controlId="formGridLocation">
                                <Form.Label>地點</Form.Label>
                                <Form.Control 
                                    name="activityLocation" 
                                    value={values.activityLocation} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.activityLocation}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    地點不可為空
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row> 

        
                        <Row className="mb-3 justify-content-md-center text-center">
                            <Form.Group as={Col} controlId="formGridYear">
                            <Form.Label>年</Form.Label>
                            <Form.Control
                                name="activityYear"
                                value={values.activityYear} 
                                onChange={handleChange}
                                isInvalid={!!errors.activityYear}/>
                            <Form.Control.Feedback type="invalid">
                                年份不正確
                            </Form.Control.Feedback>
                            </Form.Group>
                            
        
                            <Form.Group as={Col} controlId="formGridMonth">
                            <Form.Label>月</Form.Label>
                            {/* <Form.Select defaultValue="月份"> */}
                                <Form.Control 
                                    name="activityMonth"
                                    value={values.activityMonth} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.activityMonth}
                                    />
                                {/* <option>Choose...</option>
                                <option>...</option> */}
                            {/* </Form.Select> */}
                            <Form.Control.Feedback type="invalid">
                                月份不正確
                            </Form.Control.Feedback>
                            </Form.Group>
        
                            <Form.Group as={Col} controlId="formGridDate">
                                <Form.Label>日</Form.Label>
                                <Form.Control 
                                    name="activityDate"
                                    value={values.activityDate} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.activityDate}/>
                                <Form.Control.Feedback type="invalid">
                                    {errors.activityDate}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 justify-content-md-center text-center">
                            <Form.Group as={Col} controlId="formGridHour">
                                <Form.Label>時</Form.Label>
                                <Form.Control name="activityHour"
                                    value={values.activityHour} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.activityHour}/>
                            </Form.Group>
        
                            <Form.Group as={Col} controlId="formGridMinute">
                                <Form.Label>分</Form.Label>
                                <Form.Control 
                                    name="activityMinute"
                                    value={values.activityMinute} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.activityMinute}/>
                            </Form.Group>
                        </Row>
        
                        <Form.Group className="mb-3" controlId="formGridPerformers">
                            <Form.Label>表演者</Form.Label>
                            <Form.Control as="textarea" aria-label="With textarea" 
                                name="activityPerformers"
                                value={values.activityPerformers}
                                onChange={handleChange}
                                disabled
                                isInvalid={!!errors.activityPerformers}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridNote">
                            <Form.Label>備註</Form.Label>
                            <Form.Control as="textarea" aria-label="With textarea" 
                                name="activityNote"
                                value={values.activityNote}
                                onChange={handleChange}
                                isInvalid={!!errors.activityNote}/>
                        </Form.Group>
        
                        <Form.Group className="mb-3" id="formGridIsFree">
                            <Form.Check type="checkbox" label="免費" checked={isFreeChecked} onClick={handleCheckChange}/>
                        </Form.Group>
                        
                        <Row className='mx-2'>
                            <Button variant="primary" type="submit">
                                更新
                            </Button>
                        </Row>
                        
                    </Form>
                )
                }
        </Formik>
            ):
            (<div>...</div>)}
        <Modal show={submitSuccess} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>更新狀態</Modal.Title>
            </Modal.Header>
            <Modal.Body>{submitInfo}</Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
                OK
            </Button>
            </Modal.Footer>
        </Modal>
    </Container>
  );
}