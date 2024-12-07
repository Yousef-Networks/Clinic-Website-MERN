import { useState, useEffect } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { FaRegClock } from 'react-icons/fa';

const Notifications = () => {
  const { user } = useAuthContext();
  const { username } = useParams();
  const [Notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      console.log("usern" + username);
      console.log("roleee " + user.role);
      if (user.role === 'patient') {
        console.log("imhere");
        try {
          const notifications = await axios.get(`http://localhost:4000/getPatientNotifications/${username}`);
          if (notifications.status === 200) {
            setNotifications(notifications.data.notifications);
            console.log("p", notifications.data.notifications);
          }
        } catch (error) {
          // Handle API request errors more gracefully
          console.error('Error fetching patient data:', error);
        }
        finally {
          setLoading(false);
        }
      }

      else if (user.role === 'doctor') {
        try {
          const notifications = await axios.get(`http://localhost:4000/getDoctorNotifications/${username}`);
          if (notifications.status === 200) {
            setNotifications(notifications.data.notifications);
          }
        } catch (error) {
          // Handle API request errors more gracefully
          console.error('Error fetching patient data:', error);
        }
        finally {
          setLoading(false);
        }
      }
    };
    fetchNotifications();
  }, [username, user.role]);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JS
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} at ${hours}:${minutes}`;
  }

  return (
    <div className="notifications">
      <h2>NOTIFICATIONS</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="notifications-box">
          {Notifications.length > 0 ? (
            <ul>
              {Notifications.map((notification) => (
                <li className="notification-item" key={notification._id}>
                  {notification.message.includes('reserved') &&
                    <span style={{ color: '#14967f', fontWeight: 'bold' }}>Reservation</span>
                  }
                  {notification.message.includes('cancelled') &&
                    <span style={{ color: 'red', fontWeight: 'bold' }}>Canellation</span>
                  }
                  {notification.message.includes('rescheduled') &&
                    <span style={{ color: '#095d7e', fontWeight: 'bold' }}>Rescheduled</span>
                  }
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="message-text">{notification.message}</span>

                    <span className="date-text">
                      <FaRegClock />
                      {formatDate(notification.date)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications</p>
          )}
        </div>
      )}
    </div>
  );

};

export default Notifications;
