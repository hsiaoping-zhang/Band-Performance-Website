import React, {useEffect, useState} from 'react';
import { InputGroup, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { APIUrl, CityMapToArea } from '../src/constant/global';
import * as formik from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { GetAuthToken } from '../utils/Cookie';
// import Time from 'react-time';

export default function NewActivity() {
    const [data, setData] = useState([])
  	const [loading, setLoading] = useState(true)
    const cityApiUrl = APIUrl + "/CityList"
    const [isFreeChecked, setChecked] = useState(false); 
    const [submitSuccess, setSubmitStatus] = useState(false);
    const handleClose = () => navigate("/activityList");
    const [newActivityId, setActivityId] = useState(0)
    const [performersList, setPerformersList] = useState([])
    const [performerString, setPerformerString] = useState("宇宙人、告五人、鹿洐人")
    const navigate = useNavigate();
    // const handleShow = () => setShow(true);
    // const cityApiUrl = "http://api.opencube.tw/twzipcode/get-citys"

    // get area list pass to select element
	const fetchCityList = async () => {
		console.log('enter city list')
		return fetch(cityApiUrl)
		.then((response) => response.json())
		.then((data) => {
			let cities = data["data"]
            console.log(cities)
			setData(cities)
			setLoading(false)
		});
	}

    const handleCheckChange = (e) => {
        // setChecked(true)
        isFreeChecked ? setChecked(false) : setChecked(true)
        // console.log(isFreeChecked)
        // setChecked(e.target.checked);
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

    const convertTime = (year, month, date, hour, minute) => {
        let time = new Date(year, month, date, hour, minute);
        return time
        console.log(time)
    }

    const splitPerformers = (values) => {
        console.log(values)
        let spliter = ","
        
        let newPerformerString = values.activityPerformers.replaceAll("、" , spliter)
        let newPerformerList = newPerformerString.split(spliter).filter((item) => item !== "")

        values.activityPerformers = newPerformerList.map((item) => item).join(spliter)
        setPerformersList(newPerformerList)
        console.log(newPerformerList)
        return newPerformerList
    }

    const SubmitNewActivity = (values) => {
        event.preventDefault()
        console.log("submit form")
        let token = GetAuthToken()

        let performersList = splitPerformers(values)
        console.log("final:", values.activityPerformers)
        // console.log(">", performersList)
        let cityArea = CityMapToArea(values.activityCity)
        let monthIndex = values.activityMonth - 1
        let activityTime = new Date(values.activityYear, monthIndex, values.activityDate, values.activityHour, values.activityMinute)

        fetch(APIUrl + "/activity", {method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ 
                name: values.activityName,
                area: cityArea,
                city: values.activityCity,
                location: values.activityLocation,
                time: activityTime,
                performers: values.activityPerformers,
                is_free: isFreeChecked,
                note: values.activityNote,
                permission_id: "17018581147448188124"
            })
        })
        .then(response => response.json())
        .then(data => {
            if(!!data['id']){
                setSubmitStatus(true)
                setActivityId(data['id'])
            }
        })
    }
    const clicktest = (e) =>{
        console.log(e.target.value)
    }

    useEffect(() => {
		console.log('fetch data');
		fetchCityList();
	}, []);

  return (
    <div className='m-5'>
        <h1 style={{textAlign: "center"}}>新增活動</h1>
        <Formik
              validationSchema={schema}
              onSubmit={SubmitNewActivity}
              initialValues={{
                activityName: "活動名稱：" + (Date.now()), 
                activityCity: "臺北市",
                activityLocation: "暫時地點",
                activityYear: (new Date().getFullYear()),
                activityMonth: ((new Date().getMonth()) + 1),
                activityDate: (new Date().getDate()),
                activityHour: 18,
                activityMinute: 0,
                activityPerformers: "宇宙人、告五人、鹿洐人",
                activityIsFree: false,
                activityNote: ""
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
                        </Form.Group>
        
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>縣市</Form.Label>
                                <Form.Select 
                                    name="activityCity"
                                    onChange={handleChange}
                                    value={values.activityCity}>
                                    {loading ? <option>...</option> : (
                                        data.map((city) => (
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
                                    // isValid={!!errors.activityName && values.activityLocation != ""}
                                    />
                            </Form.Group>
                        </Row>        
        
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridYear">
                            <Form.Label>年</Form.Label>
                            <Form.Control
                                name="activityYear"
                                value={values.activityYear} 
                                onChange={handleChange}
                                isInvalid={!!errors.activityYear}/>
                            <Form.Control.Feedback type="invalid">
                                年份不為空
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
                                月份不為空
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
        
                            {/* <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="Username" aria-label="Username">
                                <span class="input-group-text">@</span>
                                <input type="text" class="form-control" placeholder="Server" aria-label="Server">
                            </div> */}
        
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
                                isInvalid={!!errors.activityPerformers}/>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Button variant="info" onClick={() => {splitPerformers(values)}}>整理</Button>
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
                            <Form.Check type="checkbox" label="免費" onClick={handleCheckChange}/>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            送出
                        </Button>
                    </Form>
                )
                }
        </Formik>
        
        
        <Modal show={submitSuccess} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>新增完成</Modal.Title>
            </Modal.Header>
            <Modal.Body>活動新增成功，活動 ID : {newActivityId}</Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
                OK
            </Button>
            </Modal.Footer>
        </Modal>
        
    </div>
  );
}