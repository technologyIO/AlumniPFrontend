import '../../pages/Jobs/jobs.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import React from 'react';
import { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import JobPost from "../JobPost";
import { useSelector } from 'react-redux';
import PageSubTitle from '../PageSubTitle';
import { Route, Routes } from "react-router-dom";
import Donations from '../../pages/Donations';
import Sponsorships from '../../pages/Sponsorships';
import { useLocation } from 'react-router-dom';
import { Archive } from '../../pages/Jobs/Archive';



const IntJobs = (props) => {
    const [modalShow, setModalShow] = React.useState(false);
    const [rangeValue, setRangeValue] = useState(0);
    const [questions, setQuestions] = useState(['']);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [archivedJobs, setArchivedJobs] = useState([]);
    const [archivedInternships, setArchivedInternships] = useState([]);
    const title = props.title;
    const titleS = props.titleS;
    const profile = useSelector((state) => state.profile);
    const buttontext1Link = "/jobs";
    const buttontext2Link = "/jobs/archive";
    const buttontext3Link = "/internships";
    const buttontext4Link = "/internships/archive";

    console.log('title1', title)

    const pathname = useLocation().pathname;

    // Define the link for the "Archive" button based on the current URL path
    const getArchiveLink = () => {
        if (pathname.startsWith('/jobs')) {
            return '/jobs/archive';
        } else if (pathname.startsWith('/internships')) {
            return '/internships/archive';
        }
        // Add more conditions if needed for other URLs
    };

    // const getData = async () => {
    //     try {
    //         const response = await axios.get(`http://34.229.93.25:5000/${title}/`)
    //         if (title === 'Jobs') {
    //             const filteredJobs = response.data.filter(job => job.archive === false);
    //             const filteredArchivedJobs = response.data.filter(job => job.archive === true);
    //             setJobs(filteredJobs);
    //             setArchivedJobs(filteredArchivedJobs)
    //             setLoading(false);
    //         }
    //         if (title === 'Internships') {
    //             const filteredInternships = response.data.filter(job => job.archive === false);
    //             const filteredArchivedInternships = response.data.filter(job => job.archive === true);
    //             setInternships(filteredInternships);
    //             setArchivedInternships(filteredArchivedInternships);
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         return console.log(error);
    //     }
    // }



    // useEffect(() => {
    //     getData();
    // }, [])






    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!'),
        );
        return (
            <button
                type="button"
                style={{ backgroundColor: 'pink' }}
                onClick={decoratedOnClick}
            >
                {children}
            </button>
        );
    }

    const handleRangeChange = (event) => {
        setRangeValue(event.target.value);
    };
    function MyVerticallyCenteredModal(props) {
        const [jobFormData, setJobFormData] = useState({
            userId: profile._id,
            jobTitle: '',
            location: '',
            salaryMin: '',
            salaryMax: '',
            currency: 'INR',
            duration: 'per hour',
            jobType: 'Full-time',
            category: 'Other',
            description: '',
            attachments: [],
            questions: [''],
        });

        const [internshipFormData, setInternshipFormData] = useState({
            userId: profile._id,
            internshipTitle: '',
            location: '',
            salaryMin: '',
            salaryMax: '',
            currency: 'INR',
            duration: 'per day',
            internshipType: 'Full-time',
            category: 'Other',
            description: '',
            attachments: [],
            questions: [''],
        });

        const handleInputChange = (e) => {
            const { name, value } = e.target;

            // Determine which form data to update based on the title
            if (title === 'Jobs') {
                setJobFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: value,
                }));
            } else if (title === 'Internships') {
                console.log('internships data loading')
                setInternshipFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: value,
                }));
            }
        };

        const handleImageChange = (e) => {
            const files = e.target.files;
            if (files) {
                // Convert the FileList to an array
                const filesArray = Array.from(files);

                // Update the attachments field of jobFormData with the array of files
                if (title === 'Jobs') {
                    setJobFormData((prevJobFormData) => ({
                        ...prevJobFormData,
                        attachments: filesArray,
                    }));
                }
                else if (title === 'Internships') {
                    setInternshipFormData((prevIntershipFormData) => ({
                        ...prevIntershipFormData,
                        attachments: filesArray,
                    }));
                }
            }
        };


        const handlePublish = async () => {
            try {
                const formData = new FormData();

                if (title === 'Jobs') {
                    for (const key in jobFormData) {
                        if (key === 'attachments') {
                            // Append each file individually
                            jobFormData.attachments.forEach(file => {
                                formData.append('attachments', file);
                            });
                        } else {
                            formData.append(key, jobFormData[key]);
                        }
                    }
                }
                else if (title === 'Internships') {
                    console.log('internship form data', internshipFormData)
                    for (const key in internshipFormData) {
                        if (key === 'attachments') {
                            // Append each file individually
                            internshipFormData.attachments.forEach(file => {
                                formData.append('attachments', file);
                            });
                        } else {
                            formData.append(key, internshipFormData[key]);
                        }
                    }
                }
                console.log('form data', formData)


                const response = await fetch(`http://34.229.93.25:5000/${title}/create`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('Data saved successfully');
                    toast.success(`${title} successfully created`);
                    setModalShow(false);
                    window.location.reload();
                } else {
                    const errorData = await response.json();
                    console.error('Failed to save data', errorData);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };



        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {title === 'Jobs' ? 'Create a Job' : title === 'Internships' ? 'Create an internship' : ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form enctype="multipart/form-data">
                        <Row>
                            <Col>
                                <Form.Group as={Col} >
                                    <Form.Label htmlFor="job">{title} Title</Form.Label>
                                    <Form.Control
                                        id="job"
                                        type="text"
                                        placeholder="Enter job title"
                                        name={title === 'Jobs' ? 'jobTitle' : 'internshipTitle'}
                                        value={title === 'Jobs' ? jobFormData.jobTitle : internshipFormData.internshipTitle}
                                        onChange={handleInputChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group as={Col} controlId="location">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter location"
                                        name="location"
                                        value={title === 'Jobs' ? jobFormData.location : internshipFormData.location}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group as={Col} controlId="salaryRange">
                                    <Form.Label>Salary Range</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Minimum"
                                        name="salaryMin"
                                        className='mb-2'
                                        value={title === 'Jobs' ? jobFormData.salaryMin : internshipFormData.salaryMin}
                                        onChange={handleInputChange}
                                    />


                                    To

                                    <Form.Control
                                        type="text"
                                        placeholder="Maximum"
                                        name="salaryMax"
                                        className='mt-2'
                                        value={title === 'Jobs' ? jobFormData.salaryMax : internshipFormData.salaryMax}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group as={Col} className='mt-4' controlId="currency">
                                    <DropdownButton
                                        id="createJob-currency-dropdown"
                                        title={title === 'Jobs' ? jobFormData.currency : internshipFormData.currency}
                                        onSelect={(eventKey) => {
                                            if (title === 'Jobs') {
                                                setJobFormData((prevJobFormData) => ({
                                                    ...prevJobFormData,
                                                    currency: eventKey,
                                                }));
                                            } else if (title === 'Internships') {
                                                setInternshipFormData((prevInternshipFormData) => ({
                                                    ...prevInternshipFormData,
                                                    currency: eventKey,
                                                }));
                                            }
                                        }}
                                    >
                                        <div className="scrollable-dropdown">
                                            <Dropdown.Item eventKey="INR">INR</Dropdown.Item>
                                            <Dropdown.Item eventKey="USD">USD</Dropdown.Item>
                                            <Dropdown.Item eventKey="JPY">JPY</Dropdown.Item>
                                            <Dropdown.Item eventKey="EUR">EUR</Dropdown.Item>
                                            <Dropdown.Item eventKey="GBP">GBP</Dropdown.Item>
                                        </div>
                                    </DropdownButton>
                                </Form.Group>


                                <Form.Group as={Col} className='mt-5' controlId="wages">
                                    <DropdownButton
                                        id="createJob-timings-dropdown"
                                        title={title === 'Jobs' ? jobFormData.duration : internshipFormData.duration}
                                        onSelect={(eventKey) => {
                                            if (title === 'Jobs') {
                                                setJobFormData((prevJobFormData) => ({
                                                    ...prevJobFormData,
                                                    duration: eventKey,
                                                }));
                                                console.log('form data',jobFormData)
                                            } else if (title === 'Internships') {
                                                setInternshipFormData((prevInternshipFormData) => ({
                                                    ...prevInternshipFormData,
                                                    duration: eventKey,
                                                }));
                                                console.log('form data I',internshipFormData)
                                            }
                                        }}
                                    >
                                        <div className="scrollable-dropdown">
                                            <Dropdown.Item eventKey="per hour">per hour</Dropdown.Item>
                                            <Dropdown.Item eventKey="per week">per week</Dropdown.Item>
                                            <Dropdown.Item eventKey="per month">per month</Dropdown.Item>
                                            <Dropdown.Item eventKey="per year">per year</Dropdown.Item>
                                        </div>
                                    </DropdownButton>
                                </Form.Group>
                            </Col>
                            {/* </Form.Group> */}
                        </Row>
                        <Form.Group controlId="jobType">
                            <Form.Label>{title} Type</Form.Label>
                            <DropdownButton
                                id="createJob-type-dropdown"
                                title={title === 'Jobs' ? jobFormData.jobType : internshipFormData.internshipType}
                                onSelect={(eventKey) => {
                                    if (title === 'Jobs') {
                                        console.log('jobs dropdown')
                                        setJobFormData((prevJobFormData) => ({
                                            ...prevJobFormData,
                                            jobType: eventKey,
                                        }));
                                        console.log('form data',jobFormData)
                                    } else if (title === 'Internships') {
                                        setInternshipFormData((prevInternshipFormData) => ({
                                            ...prevInternshipFormData,
                                            internshipType: eventKey,
                                        }));
                                        console.log('form data I',internshipFormData)
                                    }
                                }}
                            >
                                <div className="scrollable-dropdown">
                                    <Dropdown.Item eventKey="Full-time" >Full-time</Dropdown.Item>
                                    <Dropdown.Item eventKey="Part-time" >Part-time</Dropdown.Item>
                                    <Dropdown.Item eventKey="Internship" >Internship</Dropdown.Item>
                                    <Dropdown.Item eventKey="Volunteer" >Volunteer</Dropdown.Item>
                                    <Dropdown.Item eventKey="Contract" >Contract</Dropdown.Item>
                                </div>
                            </DropdownButton>


                        </Form.Group>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <DropdownButton
                                id="createJob-categories-dropdown"
                                title={title === 'Jobs' ? jobFormData.category : internshipFormData.category}
                                onSelect={(eventKey) => {
                                    if (title === 'Jobs') {
                                        setJobFormData((prevJobFormData) => ({
                                            ...prevJobFormData,
                                            category: eventKey,
                                        }));
                                    } else if (title === 'Internships') {
                                        setInternshipFormData((prevInternshipFormData) => ({
                                            ...prevInternshipFormData,
                                            category: eventKey,
                                        }));
                                    }
                                }}
                            >
                                <div className="scrollable-dropdown">
                                    <Dropdown.Item eventKey="Other" >Other</Dropdown.Item>
                                    <Dropdown.Item eventKey="Admin & Office" >Admin & Office</Dropdown.Item>
                                    <Dropdown.Item eventKey="Art & Design" >Art & Design</Dropdown.Item>
                                    <Dropdown.Item eventKey="Business Operations" >Business Operations</Dropdown.Item>
                                    <Dropdown.Item eventKey="Cleaning & Facilities" >Cleaning & Facilities</Dropdown.Item>
                                    <Dropdown.Item eventKey="Community & Social Services" >Community & Social Services</Dropdown.Item>
                                    <Dropdown.Item eventKey="Computer & Data" >Computer & Data</Dropdown.Item>
                                    <Dropdown.Item eventKey="Construction & Mining" >Construction & Mining</Dropdown.Item>
                                    <Dropdown.Item eventKey="Education" >Education</Dropdown.Item>
                                    <Dropdown.Item eventKey="Farming & Forestry">Farming & Forestry</Dropdown.Item>
                                    <Dropdown.Item eventKey="Healthcare">Healthcare</Dropdown.Item>
                                    <Dropdown.Item eventKey="Installation,Maintenance & Repair">Installation,Maintenance & Repair</Dropdown.Item>
                                    <Dropdown.Item eventKey="Legal">Legal</Dropdown.Item>
                                    <Dropdown.Item eventKey="Management" >Management</Dropdown.Item>
                                    <Dropdown.Item eventKey="Manufacturing" >Manufacturing</Dropdown.Item>
                                    <Dropdown.Item eventKey="Media & Communication">Media & Communication</Dropdown.Item>
                                    <Dropdown.Item eventKey="Personal Care" >Personal Care</Dropdown.Item>
                                    <Dropdown.Item eventKey="Protective Services" >Protective Services</Dropdown.Item>
                                    <Dropdown.Item eventKey="Restaurants & Hospitality" >Restaurants & Hospitality</Dropdown.Item>
                                    <Dropdown.Item eventKey="Retail & Sales" >Retail & Sales</Dropdown.Item>
                                    <Dropdown.Item eventKey="Science & Engineering">Science & Engineering</Dropdown.Item>
                                    <Dropdown.Item eventKey="Sports & Entertainment">Sports & Entertainment</Dropdown.Item>
                                    <Dropdown.Item eventKey="Transportation" >Transportation</Dropdown.Item>
                                </div>
                            </DropdownButton>
                        </Form.Group>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Card.Header>
                                    <CustomToggle eventKey="1" style={{ padding: '10px' }}>Add a question</CustomToggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body><Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter question"
                                        name="question"
                                        value={title === 'Jobs' ? jobFormData.questions : internshipFormData.questions}
                                        onChange={handleInputChange}
                                    /></Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <Form.Group controlId="description">
                            <Form.Label>Describe the responsibilities and preferred skills for this {titleS}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter job description"
                                name="description"
                                value={title === 'Jobs' ? jobFormData.description : internshipFormData.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="attachments">
                            <Form.Label>Add attachments</Form.Label>
                            <input className='form-control' type="file" onChange={handleImageChange} multiple accept=".jpg, .jpeg, .png, .pdf" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                    <Button onClick={handlePublish}>Publish</Button>
                </Modal.Footer>
            </Modal>
        );
    }



    return (
        <>  <div className="jobs-page" style={{ width: '100%' }}>
            <div className="jobs-title">
                <p>{title}</p>
                <p>Search, find and apply to {title} opportunities at Alumni Portal</p>
                <div className="centered-content">
                    <div className="jobs-search-box">
                        <div className="jobs-card">
                            <div className="card-body">
                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control type="text" placeholder={`Search for ${title}`} />
                                    </Form.Group>
                                </Form>
                                <div className="jobs-dropdowns">
                                    <DropdownButton id="job-type-dropdown" title={`${title} Type`}>
                                        <div className="scrollable-dropdown">
                                            <Dropdown.Item href="#/action-1">Full-time</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Part-time</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Internship</Dropdown.Item>
                                            <Dropdown.Item href="#/action-4">Volunteer</Dropdown.Item>
                                            <Dropdown.Item href="#/action-5">Contract</Dropdown.Item>
                                        </div>
                                    </DropdownButton>
                                    <DropdownButton id="categories-dropdown" title="Categories">
                                        <div className="scrollable-dropdown">
                                            <Dropdown.Item href="#/action-1">Other</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Admin & Office</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Art & Design</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Business Operations</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Cleaning & Facilities</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Community & Social Services</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Computer & Data</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Construction & Mining</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Education</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Farming & Forestry</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Healthcare</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Installation,Maintenance & Repair</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Legal</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Management</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Manufacturing</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Media & Communication</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Personal Care</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Protective Services</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Restaurants & Hospitality</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Retail & Sales</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Science & Engineering</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Sports & Entertainment</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Transportation</Dropdown.Item>
                                        </div>
                                    </DropdownButton>
                                    <DropdownButton id="location-distance-dropdown" title="Location Distance">
                                        <div className="location-distance-form">
                                            <label htmlFor="location-distance-range" style={{ padding: '10px', fontSize: 'large', fontWeight: 'bolder' }}>
                                                Location Distance: {rangeValue} km
                                            </label>
                                            <Form.Range
                                                id="location-distance-range"
                                                min="0"
                                                max="100"
                                                value={rangeValue}
                                                onChange={handleRangeChange}
                                                style={{ padding: '10px' }}
                                            />
                                        </div>
                                    </DropdownButton>
                                    <Button variant="primary">Nearby Business</Button>
                                    <Button variant="danger" onClick={() => setModalShow(true)}>
                                        Create {title}
                                    </Button>

                                    <MyVerticallyCenteredModal
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* <div className="job-pozt">
                <Routes>
                    <Route path="/" element={<PageSubTitle buttontext1="My Jobs" buttontext2="Archive" buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='donations' create={false} />} />
                    <Route path="/archive" element={<PageSubTitle buttontext1="My Jobs" buttontext2="Archive" buttontext1Link={buttontext3Link} buttontext2Link={getArchiveLink()} name='donations' create={false} />} />
                </Routes>
                <Routes>
                    <Route path="/" element={
                        <>
                            {title === 'Jobs' && (
                                <div className="job-poztt">
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap' }}>
                                        {loading ? (
                                            <div>Loading.....</div>
                                        ) : jobs.length ? (
                                            jobs.map((job) => (
                                                <div key={job._id} className="job-post">
                                                    <JobPost
                                                        userId={job.userId}
                                                        id={job._id}
                                                        jobTitle={job.jobTitle}
                                                        description={job.description}
                                                        salaryMin={job.salaryMin}
                                                        salaryMax={job.salaryMax}
                                                        picture={job.picture}
                                                        duration={job.duration}
                                                        jobType={job.jobType}
                                                        questions={job.questions}
                                                        category={job.category}
                                                        currency={job.currency}
                                                        createdAt={job.createdAt}
                                                        attachments={job.attachments}
                                                        title={title}
                                                        titleS={titleS}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div>No jobs posted</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {title === 'Internships' && (
                                <div className="job-poztt">
                                    {loading ? (
                                        <div>Loading Internships.....</div>
                                    ) : internships.length ? (
                                        internships.map((internship) => (
                                            <div key={internship._id} className="job-post">

                                                <JobPost
                                                    userId={internship.userId}
                                                    id={internship._id}
                                                    jobTitle={internship.internshipTitle}
                                                    description={internship.description}
                                                    salaryMin={internship.salaryMin}
                                                    salaryMax={internship.salaryMax}
                                                    picture={internship.picture}
                                                    duration={internship.duration}
                                                    jobType={internship.internshipType}
                                                    questions={internship.questions}
                                                    category={internship.category}
                                                    currency={internship.currency}
                                                    createdAt={internship.createdAt}
                                                    attachments={internship.attachments}
                                                    title={title}
                                                    titleS={titleS}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div>No internships posted</div>
                                    )}
                                </div>
                            )}
                        </>
                    } />
                    <Route path="/archive" element={
                        <>
                            {title === 'Jobs' && (
                                <div className="job-poztt">
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap' }}>
                                        {loading ? (
                                            <div>Loading.....</div>
                                        ) : archivedJobs.length ? (
                                            archivedJobs.map((job) => (
                                                <div key={job._id} className="job-post">
                                                    <Archive
                                                        userId={job.userId}
                                                        id={job._id}
                                                        jobTitle={job.jobTitle}
                                                        description={job.description}
                                                        salaryMin={job.salaryMin}
                                                        salaryMax={job.salaryMax}
                                                        picture={job.picture}
                                                        duration={job.duration}
                                                        jobType={job.jobType}
                                                        questions={job.questions}
                                                        category={job.category}
                                                        currency={job.currency}
                                                        createdAt={job.createdAt}
                                                        attachments={job.attachments}
                                                        title={title}
                                                        titleS={titleS}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div>No jobs posted</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {title === 'Internships' && (
                                <div className="job-poztt">
                                    {loading ? (
                                        <div>Loading Internships.....</div>
                                    ) : archivedInternships.length ? (
                                        archivedInternships.map((internship) => (
                                            <div key={internship._id} className="job-post">

                                                <Archive
                                                    userId={internship.userId}
                                                    id={internship._id}
                                                    jobTitle={internship.internshipTitle}
                                                    description={internship.description}
                                                    salaryMin={internship.salaryMin}
                                                    salaryMax={internship.salaryMax}
                                                    picture={internship.picture}
                                                    duration={internship.duration}
                                                    jobType={internship.internshipType}
                                                    questions={internship.questions}
                                                    category={internship.category}
                                                    currency={internship.currency}
                                                    createdAt={internship.createdAt}
                                                    attachments={internship.attachments}
                                                    title={title}
                                                    titleS={titleS}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div>No internships posted</div>
                                    )}
                                </div>
                            )}
                        </>
                    } />
                </Routes>
            </div>
 */}


        </div>
        </>
    );
}

export default IntJobs;