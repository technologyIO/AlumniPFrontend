import IntJobs from "../../components/IntJobs";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import PageSubTitle from "../../components/PageSubTitle";
import { Archive } from "../Jobs/Archive";
import JobPost from "../../components/JobPost";

const Internships = () => {
    const title = 'Internships';
    const titleS = 'internship';
    const entityType = 'jobs';
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [archivedJobs, setArchivedJobs] = useState([]);
    const [archivedInternships, setArchivedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const buttontext1 = 'My Internships';
    const buttontext2 = 'Archive';
    const buttontext1Link = "/internships";
    const buttontext2Link = "/internships/archive";

    const getData = async () => {
        try {
            const response = await axios.get(`http://34.229.93.25:5000/${title}/`)
            if (title === 'Jobs') {
                const filteredJobs = response.data.filter(job => job.archive === false);
                const filteredArchivedJobs = response.data.filter(job => job.archive === true);
                setJobs(filteredJobs);
                setArchivedJobs(filteredArchivedJobs)
                setLoading(false);
            }
            if (title === 'Internships') {
                const filteredInternships = response.data.filter(job => job.archive === false);
                const filteredArchivedInternships = response.data.filter(job => job.archive === true);
                setInternships(filteredInternships);
                setArchivedInternships(filteredArchivedInternships);
                setLoading(false);
            }
        } catch (error) {
            return console.log(error);
        }
    }


    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
                <IntJobs title={title} titleS={titleS} />
                <Routes>
                    <Route path="/" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='internships' create={false} />
                        </div>
                    } />
                    <Route path="/archive" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='internships' create={false} />
                        </div>
                    } />
                </Routes>
                <Routes>
                    <Route path="/archive" element={<>
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
                                <div>No archived internships</div>
                            )}
                        </div>
                    </>
                    } />
                    <Route path="/" element={<>
                        <div className="job-poztt">
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap', paddingTop: '20px' }}>
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
                        </div>
                    </>} />
                </Routes>
            </div>
        </>
    )
}

export default Internships;