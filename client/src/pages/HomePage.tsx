import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, getEvents, getRegistrations } from '../lib/mockData'

export default function HomePage() {
  const currentUser = getCurrentUser()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const events = getEvents()
  const registrations = getRegistrations()

  const categories = ['All', 'Music', 'Comedy', 'Food', 'Workshops', 'Tech', 'Festivals']

  const trendingEvents = [
    {
      title: 'Sunset Live',
      city: 'Bengaluru',
      date: '12 Aug',
      price: '₹899',
      category: 'Music',
      image:
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Food Carnival',
      city: 'Hyderabad',
      date: '16 Aug',
      price: '₹699',
      category: 'Food',
      image:
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Creator Meetup',
      city: 'Mumbai',
      date: '19 Aug',
      price: '₹499',
      category: 'Tech',
      image:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Comedy Nights',
      city: 'Delhi',
      date: '21 Aug',
      price: '₹799',
      category: 'Comedy',
      image:
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Wellness Workshop',
      city: 'Pune',
      date: '24 Aug',
      price: '₹599',
      category: 'Workshops',
      image:
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Festival Bash',
      city: 'Goa',
      date: '28 Aug',
      price: '₹999',
      category: 'Festivals',
      image:
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    },
  ]

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') {
      return trendingEvents
    }

    return trendingEvents.filter((event) => event.category === selectedCategory)
  }, [selectedCategory])

  const managementStats = useMemo(() => {
    const upcoming = events.filter((event) => new Date(event.date).getTime() >= Date.now()).length
    const seats = events.reduce((total, event) => total + event.capacity, 0)
    const organizers = new Set(events.map((event) => event.organizerId)).size

    return {
      upcoming,
      registrations: registrations.length,
      seats,
      organizers,
    }
  }, [events, registrations])

  const managementFeatures = [
    {
      title: 'Fast booking',
      stat: `${managementStats.registrations}+ tickets`,
      text: 'Quick ticket flow and instant confirmation.',
    },
    {
      title: 'Smart management',
      stat: `${managementStats.upcoming} live events`,
      text: 'Track registrations, seats, and attendance in real time.',
    },
    {
      title: 'Promote easily',
      stat: `${managementStats.organizers} organizers`,
      text: 'Reach the right audience with clean event listings.',
    },
  ]

  return (
    <div className="booking-shell">
      <main className="site-shell">
        <section className="top-bar">
          <div className="brand-wrap">
            <div className="brand-mark">E</div>
            <div>
              <p className="mini-label">Event hub</p>
              <h2>BookMyEvent</h2>
            </div>
          </div>

          <div className="search-box">
            <span>Search events, city, or venue</span>
          </div>

          <div className="top-actions">
            <button className="ghost-btn">Offers</button>
            <Link to={currentUser ? '/dashboard' : '/login'} className="brand-btn">
              {currentUser ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </section>

        <section className="hero-banner">
          <div className="hero-copy">
            <p className="eyebrow">Live events • Book now</p>
            <h1>Find your next big moment.</h1>
            <p className="subtitle">Music, food, tech, and community experiences in one place.</p>

            <div className="cta-row">
              <Link to="/events" className="primary-btn">Explore Events</Link>
              <Link to="/register" className="secondary-btn">Host Event</Link>
            </div>

            <div className="badge-row">
              {['Music', 'Food', 'Comedy', 'Festivals'].map((tag) => (
                <span key={tag} className="pill">{tag}</span>
              ))}
            </div>
          </div>

          <div className="poster-card">
            <div className="poster-top">
              <span className="live-tag">LIVE</span>
              <span className="rating">4.9 ★</span>
            </div>
            <div className="poster-image" />
            <div className="poster-bottom">
              <div>
                <p className="poster-title">Sunset Live</p>
                <p className="poster-meta">12 Aug • Bengaluru</p>
              </div>
              <div className="ticket-box">₹899</div>
            </div>
          </div>
        </section>

        <section className="category-wrap">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`category-chip ${selectedCategory === item ? 'active' : ''}`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </button>
          ))}
        </section>

        <section className="section-block">
          <div className="section-head">
            <div>
              <p className="eyebrow accent">Trending now</p>
              <h3>{selectedCategory === 'All' ? 'Popular events in your city' : `${selectedCategory} events`}</h3>
            </div>
            <Link to="/events" className="link-text">View all</Link>
          </div>

          <div className="event-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <article key={event.title} className="event-card">
                  <img src={event.image} alt={event.title} />
                  <div className="event-body">
                    <div className="event-topline">
                      <span>{event.city}</span>
                      <span>{event.date}</span>
                    </div>
                    <h4>{event.title}</h4>
                    <div className="event-footer">
                      <p>{event.price}</p>
                      <button type="button">Book</button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">No events found for this genre.</div>
            )}
          </div>
        </section>

        <section className="section-block management-block">
          <div className="section-head">
            <div>
              <p className="eyebrow accent">Event management</p>
              <h3>Built for organizers and guests</h3>
            </div>
          </div>

          <div className="management-grid">
            {managementFeatures.map((feature, index) => (
              <div key={feature.title} className={`info-card color-${index + 1}`}>
                <div className="icon-box" />
                <div className="info-stat">{feature.stat}</div>
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-banner">
          <div>
            <p className="eyebrow light">Host with us</p>
            <h3>Turn your event into an experience.</h3>
          </div>
          <Link to="/register" className="cta-btn">Get Started</Link>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <p className="footer-logo">EVENT HUB</p>
            <p className="footer-copy">Event discovery and management for modern audiences.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>hello@eventhub.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
