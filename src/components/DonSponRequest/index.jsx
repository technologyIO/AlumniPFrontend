import './donSponReq.css';
import PageTitle from '../PageTitle';
import { FaWallet, FaArrowLeft } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
const DonSponRequest = ({ name, edit }) => {
    console.log("DON SPON");
    console.log('name', name,edit)
    const profile = useSelector((state) => state.profile);
    const icon = <FaWallet style={{ color: '#174873' }} />;
    let heading;
    const { _id } = useParams();
    console.log('params', _id)
    if (edit) {
        heading = <p style={{ marginBottom: '0', fontSize: '17px', fontWeight: '500' }}>Edit new {name} request</p>
    }
    else {
        heading = <p style={{ marginBottom: '0', fontSize: '17px', fontWeight: '500' }}>Create new {name} request</p>
    }
    if (name === 'group') {
        if (!edit)
        heading = <p style={{ marginBottom: '0', fontSize: '17px', fontWeight: '500' }}>Create a new {name} </p>
        else{
        heading = <p style={{ marginBottom: '0', fontSize: '17px', fontWeight: '500' }}>Edit {name} </p>
        }
    }
    const [groupName, setGroupName] = useState("");
    const [groupType, setGroupType] = useState("Public");
    const [category, setCategory] = useState("Cars and Vehicles");
    const [background, setBackground] = useState ("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [picturePath, setPicturePath] = useState("");
    const navigateTo = useNavigate();
    let body;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handling submit");
        console.log('body',body)
        if (!edit) {
            try {
                const response = await axios.post(`http://34.229.93.25:5000/${name}s/create`, 
                 body,
                    {
                        "Content-Type": "application/json"
                    });

                console.log(response.data);

                setTitle("");
                setDescription("");
                setTotalAmount("");
                toast.success(`Successfully stored ${name} details`);
                setTimeout(() => {
                    navigateTo(`/${name}s`);
                    window.location.reload();
                }, 1000);
                return;

            } catch (error) {
                console.error(error);
            }
        }
        else{
        try {
            const response = await axios.put(`http://34.229.93.25:5000/${name}s/${_id}`,
            body,
                {
                    "Content-Type": "application/json"
                });

            console.log(response.data);

            setTitle("");
            setDescription("");
            setTotalAmount("");
            toast.success(`Successfully edited ${name} details`);
            setTimeout(() => {
                navigateTo(`/${name}s`);
                window.location.reload();
            }, 1000);
            return;


        } catch (error) {
            console.error(error);
        }}

    }

    const handleImageChange = (event,item) => {
        console.log('handling image change')
        const file = event.target.files[0]; 

        if (file) {
            console.log('file')
            const reader = new FileReader();

            reader.onloadend = () => {
                
                const blobString = reader.result;
                item(blobString);
            };

            
            reader.readAsDataURL(file);
        }
    };

    let extraFields = null;
    if (name === 'group') {
        extraFields = (
            <>
                <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                    <label htmlFor="groupName">Group Name</label>
                    <input type="text" style={{ borderRadius: '6px', height: '5.5vh' }} value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                    <label htmlFor="groupType">Group Type</label>
                    <select style={{ borderRadius: '6px', height: '5.5vh' }} value={groupType} onChange={(e) => setGroupType(e.target.value)}>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                    <label htmlFor="category">Category</label>
                    <select style={{ borderRadius: '6px', height: '5.5vh' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Cars and vehicles">Cars and Vehicles</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Education">Education</option>
                        <option value="Sport">Sport</option>
                        <option value="Pets and Animals">Pets and Animals</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                    <label htmlFor="image">Group Background</label>
                    <label for="images" className="drop-container" id="dropcontainer">
                        <span className="drop-title">Drop files here</span>
                        or
                        <input type="file" id="images" accept="image/*" required onChange={(e) => handleImageChange(e, setBackground)}/>
                    </label>
                </div>
            </>
        );
        body = {
            userId: profile._id,
            groupName: groupName,
            groupType: groupType,
            category: category,
            groupLogo: background
        };

    } else {
        extraFields = (
            <>
                <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                    <label htmlFor="title">Title</label>
                    <input type="text" style={{ borderRadius: '6px', height: '5.5vh' }} value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                    <label htmlFor="totalAmount">How much money would you like to receive?</label>
                    <input type="number" style={{ borderRadius: '6px', height: '5.5vh' }} value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                    <label htmlFor="description">Description</label>
                    <textarea name="description" id="description" cols="30" rows="10" value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'none', borderRadius: '6px' }}></textarea>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                    <label htmlFor="image">Image</label>
                    <label for="images" className="drop-container" id="dropcontainer">
                        <span className="drop-title">Drop files here</span>
                        or
                        <input type="file" id="images" accept="image/*" required onChange={(e) => handleImageChange(e, setPicturePath)} />
                    </label>
                </div>
            </>
        );
        body = {
            userId: profile._id,
            profilePic: profile.profilePicture,
            title: title,
            description: description,
            totalAmount: totalAmount,
            picturePath: picturePath,
        };
    }

    return (
        <>
            <div className="dsr-container">
                <div>
                    <PageTitle icon={icon} title={heading} />
                </div>
                <div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', paddingBottom: '20px', alignItems: 'center', backgroundColor: 'white', borderRadius: '6px', marginTop: '20px', flexDirection: 'column' }}>
                        {extraFields}
                        <div style={{ display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', gap: '2rem' }}>
                            <button style={{ display: 'flex', border: 'none', background: 'inherit', alignItems: 'center', color: '#666', width: '14%', gap: '0.5rem', justifyContent: 'center' }}><Link to={`/${name}s`} style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', color: 'rgb(102, 102, 102)', width: '100%', gap: '0.5rem', justifyContent: 'center' }}><FaArrowLeft /><p style={{ marginBottom: '0rem' }}>Go Back</p></Link></button>
                            <button style={{ color: '#ffffff', backgroundColor: '#174873', borderColor: '#174873', borderRadius: '6px', width: '20%', height: '5vh' }} type="submit">Publish</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default DonSponRequest;