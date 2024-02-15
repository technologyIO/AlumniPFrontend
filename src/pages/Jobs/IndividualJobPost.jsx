import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GiMoneyStack } from 'react-icons/gi';
import { FaLocationDot, FaTags } from 'react-icons/fa6';
import { FcBriefcase } from 'react-icons/fc';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from "react";
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";

import './individualJobPost.css';
const IndividualJobPost = () => {
    const { _id, title } = useParams();
    const [cookie] = useCookies(['access_token']);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [candidateModalShow, setCandidateModalShow] = React.useState(false);
    const [appliedCandidates, setAppliedCandidates] = useState([]);
    const [appliedCandidatesDetails, setAppliedCandidatesDetails] = useState([]);


    const toggleShareOptions = () => {
        setShowShareOptions(!showShareOptions);
    };
    const profile = useSelector((state) => state.profile);
    const fetchDonationPost = async () => {
        const response = await axios.get(`http://localhost:5000/${title}/${_id}`)
        const data = response.data;
        setJobs(data);
        setLoading(false)
    }

    let admin;
    if (profile.profileLevel === 0) {
        admin = true;
    }
    const fetchAppliedUserIds = async () => {
        const response = await axios.get(`http://localhost:5000/${title}/appliedCandidates/${_id}`)
        const data = response.data;
        setAppliedCandidates(data.userIds);
        setAppliedCandidatesDetails(data.appliedCandidates);
    }



    useEffect(() => {
        fetchDonationPost();
        fetchAppliedUserIds();
    }, [_id])
    const isApplied = appliedCandidates.includes(profile._id);

    function MyVerticallyCenteredModal(props) {
        const [name, setName] = useState('');
        const [resume, setResume] = useState(null);

        const handleNameChange = (e) => {
            setName(e.target.value);
        };

        const handleResumeChange = (e) => {
            setResume(e.target.files[0]);
        };

        const handleSubmit = () => {
            const apiUrl = `http://localhost:5000/jobs/apply/${_id}`;
            const formData = new FormData();
            formData.append('userId', profile._id);
            formData.append('name', name);
            formData.append('resume', resume);


            // Dummy POST request
            fetch(apiUrl, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Application submitted successfully!');
                        toast.success("Applied");
                        props.onHide();
                        window.location.reload()
                    } else {
                        console.error('Failed to submit application');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
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
                        Apply
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={handleNameChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>Upload Resume</Form.Label>
                            <Form.Control type="file" accept=".pdf" onChange={handleResumeChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                    <Button onClick={handleSubmit}>Apply</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    const formatCreatedAt = (createdAt) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const timeString = new Date(createdAt).toLocaleTimeString(undefined, options);
        const dateString = new Date(createdAt).toLocaleDateString();

        return `${dateString} ${timeString} `;
    };

    const renderCandidateDetails = () => {
        if (appliedCandidatesDetails.length === 0) {
            return <p>No interested Candidates</p>;
        }

        return appliedCandidatesDetails.map((candidate, index) => (
            <div key={index}>
                <div style={{ display: 'flex', gap: '1vw' }}>
                    <p style={{ fontWeight: '500' }}>Name: </p><p>{candidate.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '1vw' }}>
                    <p style={{ fontWeight: '500' }}>Resume: </p><a href={`http://localhost:5000/uploads/${candidate.resume}`} target="_blank" rel="noopener noreferrer">{candidate.resume}</a>
                </div>
                <div style={{ display: 'flex', gap: '1vw' }}>
                    <p style={{ fontWeight: '500' }}>Applied At: </p> <p>{formatCreatedAt(candidate.appliedAt)}</p>
                </div>
                <hr />
            </div>
        ));
    };

    const CandidatesModal = () => (
        <Modal
            show={candidateModalShow}
            onHide={() => setCandidateModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Interested Candidates
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderCandidateDetails()}
            </Modal.Body>
        </Modal>
    );

    const viewCandidatesButton = (
        <button onClick={() => setCandidateModalShow(true)}>View Interested Candidates (<span>{appliedCandidatesDetails.length}</span>)</button>
    );


    return (
        <div key={jobs._id} style={{ width: '55%', display: 'flex', justifyContent: 'center' }}>
            {loading ? (<div>Loading..</div>) :
                (
                    <div className="ijp-card-container" style={{ backgroundColor: '#f9f9f9' }}>
                        <div className="ijp-card">
                            <div className="ijp-image">
                                {jobs.attachments.map((attachment, index) => {
                                    if (!attachment.endsWith('.pdf')) {
                                        return (
                                            <img
                                                key={index}
                                                src={`http://localhost:5000/uploads/${attachment}`}
                                                alt=""
                                                className="src"
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <img src={profile.profilePicture} alt="Profile Image" style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                marginRight: '10px'
                            }} />
                            <div className="ijp-title">
                                <p>{title === 'Jobs' ? jobs.jobTitle : title === 'Internships' ? jobs.internshipTitle : ''}</p>
                            </div>
                            <div className="ijp-user-details">

                                <p>{profile.firstName} </p>

                            </div>
                            <div className="ijp-location-bar">
                                <div className="ijp-location">
                                    <FaLocationDot />
                                    <p>{jobs.location}</p>
                                </div>
                                <div className="ijp-jobType">
                                    <FcBriefcase />
                                    <p>{title === 'Jobs' ? jobs.jobType : title === 'Internships' ? jobs.internshipType : ''}</p>
                                </div>
                                <div className="ijp-category">
                                    <FaTags />
                                    <p>{jobs.category}</p>
                                </div>
                            </div>
                            <div className="ijp-candidates-button">
                                {admin ? (
                                    <>{viewCandidatesButton}</>
                                ) : (
                                    isApplied ? (
                                        <button style={{ backgroundColor: '#a3e3ff' }}>Applied</button>
                                    ) : (
                                        <>
                                            <button onClick={() => setModalShow(true)} style={{ backgroundColor: '#174873', padding: '7px 20px' }}>Apply</button>
                                            <MyVerticallyCenteredModal
                                                show={modalShow}
                                                onHide={() => setModalShow(false)}
                                            />
                                        </>
                                    )
                                )}
                            </div>
                            <CandidatesModal />

                            <div className="ijp-desc-salary">
                                <div className="ijp-user-details">
                                    <div className="ijp-minimum">
                                        <p >Minimum</p>
                                        <p>{jobs.salaryMin}{jobs.currency}</p>
                                    </div>
                                    <div className="ijp-maximum">
                                        <p>Maximum</p>
                                        <p>{jobs.salaryMax}{jobs.currency}</p>
                                    </div>
                                </div>
                                <div className="ijp-description">
                                    <p style={{ fontWeight: '500' }}>JOB DESCRIPTION:-</p>
                                    {jobs.attachments.map((attachment, index) => {
                                        if (attachment.endsWith('.pdf')) {
                                            return (
                                                <a
                                                    key={index}
                                                    href={`http://localhost:5000/uploads/${attachment}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'block', marginBottom: '10px' }}
                                                >
                                                    {attachment}
                                                </a>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )


}

export default IndividualJobPost;