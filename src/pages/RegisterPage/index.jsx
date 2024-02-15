import React, { useState } from 'react';
import axios from 'axios';
import "./registerpage.css";
import backgroundPic from "../../images/imgb.jpg";
import pic from "../../images/bhuUni.jpg";
import logo from "../../images/bhu.png";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const RegisterPage = () => {
    const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '', 
    accept: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('formData', formData);
      const response = await axios.post('http://localhost:5000/alumni/register', formData);
      
      console.log('Registration successful!', response.data);
      toast.success("User Registered successfully!");
      navigateTo('/login');
      
      
    } catch (error) {
      console.error('Registration failed!', error.response.data);
      toast.error(error.response.data.error);
      
    }
  };

  return (
    <>
      <div className='main'>
        <div className='left'>
          <div style={{backgroundColor: '#174873',height: '100%'}}>
            <div className='content'>
              <img src={logo} style={{width:'250px',height:'70px',marginTop:'85px'}} alt="Logo" />
              <h1 style={{marginTop:'100px',color:'white'}}>Connect with friends!</h1>
              <p style={{margin:'20px 0px 50px 0px',color:'white'}}>Share what's new and life moments with your friends.</p>
              <div style={{border: '16px solid rgb(255 255 255 / 64%)',borderRadius: '40px 40px 40px 40px',borderBottom: '0'}}>
                <img src={pic} style={{width:'100%',height:'56vh',borderRadius: '20px 20px 20px 20px',aspectRatio: '1',objectFit: 'cover'}} alt="Cover" />
              </div>
            </div>    
          </div>  
        </div>
        <div className='right'>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '30px'}}>
            <form id='register' onSubmit={handleSubmit} method='post' style={{width: '70%'}}>
              <p style={{fontSize:'44px',fontWeight:'700',color:'#174873'}}>BHU Alumni Association</p>
              <p style={{fontSize:'44px',fontWeight:'600',color:'#174873'}}>Register</p>
              <p style={{fontSize:'16px'}}>Create your Alumni Portal Account!</p>
              <div className='form-fields'>
                <label>First Name</label><br/>
                <input type='text' name='firstName' id='firstName' onChange={handleChange}/>
              </div>
              <div className='form-fields'>
                <label>Last Name</label><br/>
                <input type='text' name='lastName' id='lastName' onChange={handleChange}/>
              </div>
              <div className='form-fields'>
                <label>E-mail address</label><br/>
                <input type='text' name='email' id='email' onChange={handleChange}/>
              </div>
              <div className='form-fields'>
                <label>Password</label><br/>
                <input type='password' name='password' id='password' onChange={handleChange}/>
              </div>
              <div className='form-fields'>
                <label>Confirm Password</label><br/>
                <input type='password' name='confirmPassword' id='confirmPassword' onChange={handleChange}/>
              </div>
              <div className='form-fields'>
                <label>Gender</label><br/>
                <select name='gender' id='gender' onChange={handleChange}>
                  <option value='0'>Gender</option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select>
              </div>
              <div className='form-fields'>
                <label>Department</label><br/>
                <select name='department' id='department' onChange={handleChange}>
                  <option value='0'>Department</option>
                  <option value='Agricultural Engineering'>Agricultural Engineering</option>
                  <option value='Gastroenterology'>Gastroenterology</option>
                  <option value='Indian languages'>Indian languages</option>
                  <option value='Neurosurgery'>Neurosurgery</option>
                  <option value='Vocal Music'>Vocal Music</option>
                </select>
              </div>
              <div className='form-fields'>
                <label>Batch</label><br/>
                <select name='batch' id='batch' onChange={handleChange}>
                  <option value='0'>Batch</option>
                  <option value='2018-2019'>2018-2019</option>
                  <option value='2019-2020'>2019-2020</option>
                  <option value='2020-2021'>2020-2021</option>
                  <option value='2021-2022'>2021-2022</option>
                  <option value='2022-2023'>2022-2023</option>
                </select>
              </div>
              <div className='check'>
                <input type='checkbox' name='accept' id='accept' onChange={handleChange}/>
                <p style={{marginBottom: '0px'}}> By creating your account, you agree to our Privacy Policy</p>
              </div>
              <div className='button'>
                <div className='login-btn'>
                  <button type='submit' id='btn' name='btn'>Let`s Go!</button>
                </div>
                <div>
                  <p>Already have an account? <a href='/login' style={{textDecoration: 'none', color: '#174873'}}>Login</a></p>
                </div>
              </div>
            </form>
          </div>    
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
