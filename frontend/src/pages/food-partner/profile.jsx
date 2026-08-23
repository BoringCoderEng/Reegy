import '../../styles/pages.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const Profile = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState('');
 
  useEffect(() => { 
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/food-partner/${id}`,
          { withCredentials: true }
        );

        setPartner(response.data.foodPartner);
        setFoodItems(response.data.foodItems || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || 'Unable to load this profile.'
        );
      }
    };

    fetchProfile();
  }, [id]);

  if (error) {
    return <main className="partner-profile">{error}</main>;
  }

  if (!partner) {
    return <main className="partner-profile">Loading profile...</main>;
  }

  return (
    <main className="partner-profile">
      <section className="partner-header">
        <div className="partner-avatar">
          <span>{partner.name.charAt(0).toUpperCase()}</span>
        </div>

        <div className="partner-details">
          <h1>{partner.name}</h1>
          <p className="partner-address">{partner.Address}</p>
        </div>
      </section>

      <section className="partner-stats">
        <div>
          <strong>{foodItems.length}</strong>
          <span>Total Meals</span>
        </div>
      </section>

      <section className="partner-videos">
        {foodItems.map((item) => (
          <div className="partner-video-card" key={item._id}>
            <video src={item.video} controls muted />
            <span>{item.name}</span>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Profile;