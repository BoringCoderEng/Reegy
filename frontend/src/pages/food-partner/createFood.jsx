import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './createFood.css';

const CreateFood = () => {
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/food/add',
        formData,
        { withCredentials: true }
      );

      const partnerId = response.data.food.foodPartner;
      navigate(`/food-partner/${partnerId}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to create this food item.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-food-page">
      <section className="create-food-panel" aria-labelledby="create-food-title">
        <div className="create-food-heading">
          <p className="create-food-eyebrow">Partner kitchen</p>
          <h1 id="create-food-title">Add a food reel</h1>
          <p>Share a dish with your customers through a short video.</p>
        </div>

        <form className="create-food-form" onSubmit={handleSubmit}>
          <div className="create-food-field">
            <span>Food video</span>
            <label className={`video-upload ${video ? 'video-upload-selected' : ''}`} htmlFor="video">
              <input
                id="video"
                name="video"
                type="file"
                accept="video/*"
                required
                onChange={(event) => setVideo(event.target.files[0] || null)}
              />
              <span className="video-upload-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
                  <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
                </svg>
              </span>
              <span className="video-upload-copy">
                <strong>{video ? video.name : 'Choose a food video'}</strong>
                <small>{video ? 'Video ready to publish' : 'Tap to browse · MP4, WebM or MOV'}</small>
              </span>
              <span className="video-upload-action">Browse</span>
            </label>
            {video && (
              <button
                className="video-upload-remove"
                type="button"
                onClick={() => {
                  setVideo(null);
                  document.getElementById('video').value = '';
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                Remove selected video
              </button>
            )}
          </div>

          <label className="create-food-field" htmlFor="name">
            <span>Food name</span>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Spicy paneer wrap"
              maxLength="80"
              required
            />
          </label>

          <label className="create-food-field" htmlFor="description">
            <span>Description</span>
            <textarea
              id="description"
              name="description"
              placeholder="Tell customers what makes this dish special"
              rows="5"
              maxLength="300"
              required
            />
          </label>

          {error && <p className="create-food-error" role="alert">{error}</p>}

          <button className="create-food-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Publish food'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateFood;