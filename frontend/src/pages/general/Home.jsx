import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bookmark, Heart, Home as HomeIcon, MessageCircle, Play, Store } from 'lucide-react';
import '../../styles/pages.css';

const API_URL = 'http://localhost:3000/api/food';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [userId, setUserId] = useState(null);
    const [likedItems, setLikedItems] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [activeComments, setActiveComments] = useState(null);
    const videoRefs = useRef({});

    useEffect(() => {
        const fetchSavedItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
                const storedUserId = storedUser?._id || storedUser?.id || storedUser?.userId;
                const response = await axios.post(`${API_URL}/save`, {}, {
                    params: storedUserId ? { userId: storedUserId } : undefined,
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                setSavedItems((response.data.savedFood || []).map((savedItem) => savedItem.food).filter(Boolean));
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error('Error fetching saved food:', error);
                }
            }
        };

        fetchSavedItems();
    }, []);

    // Fetch food videos
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${API_URL}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );

                console.log("API RESPONSE:", res.data);

                // IMPORTANT: foodItems is the array
                setVideos(res.data.foodItems || []);
                setUserId(res.data.userId || null);
                
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };

        fetchVideos();
    }, []);

    // Handle video play/pause while scrolling
    useEffect(() => {
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const videoElement = entry.target;

                    if (!(videoElement instanceof HTMLVideoElement)) {
                        return;
                    }

                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.5
                    ) {
                        videoElement.play().catch(() => {
                            // Autoplay may be blocked by browser
                        });
                    } else {
                        videoElement.pause();
                    }
                });
            },
            {
                threshold: [0.5]
            }
        );

        Object.values(videoRefs.current).forEach((video) => {
            if (video) {
                intersectionObserver.observe(video);
            }
        });

        return () => {
            intersectionObserver.disconnect();
        };
    }, [videos]);

    async function likeVideo(item) {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const storedUserId = storedUser?._id || storedUser?.id || storedUser?.userId;
        const currentUserId = userId || storedUserId;
        if (!currentUserId) {
            console.error('Cannot like food without a logged-in user');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/like`,
                { userId: currentUserId, foodId: item._id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );
            const { like, likeCount } = response.data;

            setLikedItems((current) => like
                ? [...current, item._id]
                : current.filter((itemId) => itemId !== item._id));
            setVideos((prev) => prev.map((video) => video._id === item._id
                ? { ...video, likeCount }
                : video));
        } catch (error) {
            console.error('Error updating food like:', error);
        }
    }

    async function saveVideo(item) {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const storedUserId = storedUser?._id || storedUser?.id || storedUser?.userId;
        const currentUserId = userId || storedUserId;
        if (!currentUserId) {
            console.error('Cannot save food without a logged-in user');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/food`,
                { userId: currentUserId, foodId: item._id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );
            const saved = response.data.saved ?? response.data.isSaved;
            const currentlySaved = savedItems.some((savedItem) => savedItem._id === item._id);
            const nextSaved = saved ?? !currentlySaved;

            setSavedItems((current) => {
                return nextSaved
                    ? [...current.filter((savedItem) => savedItem._id !== item._id), item]
                    : current.filter((savedItem) => savedItem._id !== item._id);
            });
            setVideos((prev) => prev.map((video) => video._id === item._id
                ? { ...video, saveCount: response.data.saveCount }
                : video));
        } catch (error) {
            console.error('Error updating food save:', error.response?.data || error.message);
        }
    }
    const setVideoRef = (id) => (el) => {
        if (!el) {
            delete videoRefs.current[id];
            return;
        }

        videoRefs.current[id] = el;
    };

    return (
        <main className="app-shell">
            <section className="home-container">
                <header className="feed-header">
                    <div className="brand-mark"><span>r</span></div>
                    <div>
                        <p className="eyebrow">discover locally</p>
                        <h1>Reegy</h1>
                    </div>
                    <Link className="store-link" to="/food-partner/login" aria-label="Food partner portal">
                        <Store size={19} />
                    </Link>
                </header>

                <section className="reels-container">

                    {videos.length === 0 && (
                        <div className="empty-feed">
                            <Play size={28} />
                            <h2>No food videos yet</h2>
                            <p>Check back soon for something delicious nearby.</p>
                        </div>
                    )}

                    {videos.map((item) => {
                        const isLiked = likedItems.includes(item._id);
                        const isSaved = savedItems.some((savedItem) => savedItem._id === item._id);
                        return (
                            <article className="reel" key={item._id}>

                                <video
                                    ref={setVideoRef(item._id)}
                                    src={item.video}
                                    className="reel-video"
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    preload="auto"
                                    controls={false}
                                    onError={(event) => {
                                        event.currentTarget.style.display = 'none';
                                    }}
                                />

                                <div className="reel-shade" />
                                <div className="reel-actions" aria-label="Video actions">
                                    <button onClick={() => likeVideo(item)} className={`action-button ${isLiked ? 'is-liked' : ''}`} aria-label="Like video">
                                        <Heart size={25} fill={isLiked ? 'currentColor' : 'none'} />
                                        <span>{item.likeCount ?? 0}</span>
                                    </button>
                                    <button className={`action-button ${isSaved ? 'is-saved' : ''}`} onClick={() => saveVideo(item)} aria-label={isSaved ? 'Remove from saved' : 'Save video'}>
                                        <Bookmark size={25} fill={isSaved ? 'currentColor' : 'none'} />
                                        <span>{item.saveCount ?? 0}</span>
                                    </button>
                                    <button className={`action-button ${activeComments === item._id ? 'is-active' : ''}`} onClick={() => setActiveComments(activeComments === item._id ? null : item._id)} aria-label="Show comments">
                                        <MessageCircle size={25} />
                                        <span>{item.comments ?? 0}</span>
                                    </button>
                                </div>

                                <div className="reel-info">
                                    <p className="reel-description">{item.description || 'A delicious bite from a local food partner.'}</p>
                                    {activeComments === item._id && <div className="comment-popover">Comments are coming soon.</div>}
                                    <Link className="reel-btn" to={`/food-partner/${item.foodPartner}`} aria-label="Visit store">Visit Store</Link>
                                </div>
                            </article>
                        );
                    })}
                </section>
            </section>

            <nav className="bottom-nav" aria-label="Main navigation">
                <Link className="nav-item active" to="/" aria-label="Home"><HomeIcon size={21} /><span>Home</span></Link>
                <Link className="nav-item" to="/saved" aria-label="Saved videos"><Bookmark size={21} /><span>Saved</span></Link>
            </nav>

        </main>
    );
};

export default Home;