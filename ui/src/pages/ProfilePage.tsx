import React, {useEffect, useState} from 'react'
import { userGetLogin } from '../api/UserController'


interface UserData {
  email: string;
  userName: string;
  userAccount: string;
}
const ProfilePage = () => {

  const [userData, setUserData] = useState<UserData>({
    email: '',
    userName: '',
    userAccount: ''
  });
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const userData = await userGetLogin()
      console.log('User data:', userData)
      setUserData(userData)
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1>Profile Page</h1>
      <p>This is the profile page where users can view and edit their information.</p>
      {
        userData ? (
          <div>
            <p><strong>Username:</strong> {userData.userName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Account:</strong> {userData.userAccount}</p>
          </div>
        ) : (
          <p>Loading...</p>
        ) 
      }
    </div>
  )
}

export default ProfilePage
