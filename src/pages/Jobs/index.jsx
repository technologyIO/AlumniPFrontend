import IntJobs from "../../components/IntJobs";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import PageSubTitle from "../../components/PageSubTitle";
import JobPost from "../../components/JobPost";
import {Archive}  from "./Archive";

const Jobs = () => {
    const title = 'Jobs';
    const titleS = 'job'
    const entityType = 'jobs';
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [archivedJobs, setArchivedJobs] = useState([]);
    const [archivedInternships, setArchivedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const buttontext1 = 'My Jobs';
    const buttontext2 = 'Archive';
    const buttontext1Link = "/jobs";
    const buttontext2Link = "/jobs/archive";
    // const buttontext3Link = "/internships";
    // const buttontext4Link = "/internships/archive";


    const getData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/${title}/`)
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
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='jobs' create={false} />
                        </div>
                    } />
                    <Route path="/archive" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='jobs' create={false} />
                        </div>
                    } />
                </Routes>
                <Routes>
                    <Route path="/archive" element={<>
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
                                            <div>No archived jobs</div>
                                        )}
                                    </div>
                                </div>
                    </>
                    } />
                    <Route path="/" element={<>
                        <div className="job-poztt">
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap',paddingTop: '20px' }}>
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
                    </>} />
                </Routes>
            </div>
        </>
    )
}

export default Jobs;