import React from 'react'
import './forum.css'
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import { MdForum } from 'react-icons/md';
import { useState, useEffect } from 'react';


const Forum = () => {
  const [totalForums, setTotalForums] = useState('');
  const [forumData, setForumData] = useState([]);
  const [loading, setLoading] = useState();
  const icon = <MdForum style={{ color: 'rgb(233, 172, 138)' }} />;
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/forums')
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        console.log('data', data)
        setForumData(data.forums);
        setTotalForums(data.totalForums);
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching forum data:', error);
      });
  }, []);


  return (
    <>
      <div className='forum' style={{ paddingTop: '20px' }}>
        <div>
          <PageTitle title='Forums' icon={icon} />
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '25px', paddingBottom: '25px', alignItems: 'end' }}>
            <p style={{ margin: '0px', fontSize: '18px', fontWeight: '600', color: '#9c9b95' }}>Total Forums:  {loading ? 0 : totalForums}</p>
            <div >
              <FaSearch style={{ position: 'relative', left: 30, bottom: 3, color: '#9c9b95' }} /><input type='text' name='name' id='name' placeholder='Search topics' />
            </div>
            <div>
              <Link to="/forums/create"><button>Start New Forum</button></Link>
            </div>

          </div>
        </div>
        <div className='table' style={{ width: '100%' }}>
          <table id='tb' style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>TITLE</th>
                <th>DESCRIPTION</th>
                <th>TOTAL TOPICS</th>
                {/* <th>FRESHNESS</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <div>Loading...</div>
              ) : forumData.length ? (forumData.map((forum) => (
                <tr key={forum.id}>
                  <td>
                    <div>
                      <Link to={`/forums/${forum._id}`} style={{ textDecoration: 'none' }}>
                        <h4 style={{ color: 'black', fontSize: '15px' }}>{forum.title}</h4>
                      </Link>

                    </div>
                  </td>
                  <td>
                    <div>
                      <p style={{ color: 'black', fontSize: '15px', marginBottom: '0px' }} dangerouslySetInnerHTML={{ __html: forum.description.replace(/<figure.*?<\/figure>/g, '') }}></p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <h4 style={{ color: 'black', fontSize: '15px' }}>{forum.totalTopics}</h4>
                    </div>
                  </td>
                  {/* <td>
                      <div>
                        <h4>{forum.freshness}</h4>
                        <p>{forum.freshness}</p>
                      </div>
                    </td> */}
                </tr>
              ))) : (
                <div>No forums posted</div>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default Forum
