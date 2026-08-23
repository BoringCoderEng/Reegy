import { Bookmark, Home as HomeIcon, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../../styles/pages.css';

const API_URL = 'http://localhost:3000/api/food';

const Saved = () => {
    const [savedItems, setSavedItems] = useState([]);

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
                if (error.response?.status === 404) {
                    setSavedItems([]);
                    return;
                }
                console.error('Error fetching saved food:', error);
            }
        };

        fetchSavedItems();
    }, []);

    const removeSavedItem = async (id) => {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const storedUserId = storedUser?._id || storedUser?.id || storedUser?.userId;
        if (!storedUserId) {
            console.error('Cannot remove saved food without a logged-in user');
            return;
        }

        try {
            await axios.post(
                `${API_URL}/food`,
                { userId: storedUserId, foodId: id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );
            setSavedItems((current) => current.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Error removing saved food:', error);
        }
    };

    return (
        <main className="app-shell saved-shell">
            <section className="saved-page">
                <header className="saved-header">
                    <div>
                        <p className="eyebrow">your collection</p>
                        <h1>Saved bites</h1>
                    </div>
                    <Bookmark size={25} />
                </header>

                {savedItems.length === 0 ? (
                    <div className="empty-feed saved-empty">
                        <Bookmark size={30} />
                        <h2>Your saves will live here</h2>
                        <p>Tap the bookmark on a food video to keep it close.</p>
                        <Link className="reel-btn" to="/">Explore videos</Link>
                    </div>
                ) : (
                    <div className="saved-grid">
                        {savedItems.map((item) => (
                            <article className="saved-card" key={item._id}>
                                <video src={item.video} muted loop playsInline preload="metadata" />
                                <div className="saved-card-content">
                                    <p>{item.description || 'A delicious local bite.'}</p>
                                    <div className="saved-card-actions">
                                        <Link to={`/food-partner/${item.foodPartner}`}>Visit store</Link>
                                        <button onClick={() => removeSavedItem(item._id)} aria-label="Remove saved video"><Trash2 size={17} /></button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <nav className="bottom-nav" aria-label="Main navigation">
                <Link className="nav-item" to="/" aria-label="Home"><HomeIcon size={21} /><span>Home</span></Link>
                <Link className="nav-item active" to="/saved" aria-label="Saved videos"><Bookmark size={21} /><span>Saved</span></Link>
            </nav>
        </main>
    );
};

export default Saved;
