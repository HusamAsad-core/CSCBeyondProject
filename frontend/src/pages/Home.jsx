import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar'; // Import the new Navbar

// --- ASSETS (Using your exact paths) ---
import heroGirl from '../assets/images/hero-girl.png';
import bestSellerBox from '../assets/images/icons/best_seller.png';
import orangeCircle from '../assets/images/shapes/orange_circle.png';
import slide1 from '../assets/images/slides/ai_based_course_selector.png';
import slide2 from '../assets/images/slides/ai_based_scenarios.png';
import slide3 from '../assets/images/slides/ai_based_quizs_tests.png';
import slide4 from '../assets/images/slides/ai_based_gamification.png';
import collaborativeImg from '../assets/images/collaborative.png';
import collegeIcon from '../assets/images/icons/Colleges_Universities.png';
import corporateIcon from '../assets/images/icons/Corporates.png';
import professionalIcon from '../assets/images/icons/Idividual_working_professionals.png';
import startupIcon from '../assets/images/icons/startups.png';
import howItWorksImg from '../assets/images/how_it_works.png';
import bordersImg from '../assets/images/borders.png';
import achievementsImg from '../assets/images/our_achievments.png';
import teacherCardImg from '/Users/husam/CSCBeyondProject/frontend/src/assets/images/teacher_card.png';
import personIcon from '/Users/husam/CSCBeyondProject/frontend/src/assets/images/icons/person_icon.png';
import iso9001 from '/Users/husam/CSCBeyondProject/frontend/src/assets/images/certifications/ISO9001.png';
import iso27001 from '/Users/husam/CSCBeyondProject/frontend/src/assets/images/certifications/ISO27001.png';
import iso200001 from '/Users/husam/CSCBeyondProject/frontend/src/assets/images/certifications/ISO200001.png';
import iso29993 from '/Users/husam/CSCBeyondProject/frontend/src/assets/images/certifications/ISO29993.png';
import collaborationsImg from '/Users/husam/CSCBeyondProject/frontend/src/assets/images/collaboration_co.png';

const Home = () => {
  const slides = [
    { img: slide1, title: "AI Based Course Selector" },
    { img: slide2, title: "AI Based Scenarios" },
    { img: slide3, title: "AI Based Quizes/Tests" },
    { img: slide4, title: "AI Based Gamification" }
  ];

  const mentors = [
    {
      name: "Sandeep",
      field: ".Net & Azure",
      description: "Sandeep is a Software Developer and expert in .NET & Azure. He has 14+ years of training 500+ students to accomplish their goals & dreams."
    },
    {
      name: "Sudhansu",
      field: "Cloud & Cyber Security, Forensic",
      description: "Sudhansu is a Software Developer expert in cloud security, Cyber Security, Data Center & Forensics for more than 15 years."
    },
    {
      name: "Ruchika Tuteja",
      field: "UI/UX Trainer",
      description: "I have 8 years of experience in Fullstack development. I have worked on multiple projects... provide real-time simulation of various development."
    }
  ];

  return (
    <>
      
      <div className="home-wrapper">
        {/* HERO SECTION */}
        <section className="hero-container">
          <div className="hero-left">
            <h1 className="hero-title">
              Skill Your Way <br />
              Up To <span className="text-highlight">Success</span> <br />
              With Us
            </h1>
            <p className="hero-subtitle">Get the skills you need for the future of work.</p>
            <div className="hero-search-wrapper">
              <input type="text" placeholder="Search the course you want" className="hero-search-input" />
              <button className="hero-search-btn">Search</button>
            </div>
            <div className="hero-keywords">
              <span className="keyword-tag orange-tag">Cloud Computing</span>
              <span className="keyword-tag">Cyber Security</span>
              <span className="keyword-tag">DevOps</span>
              <span className="keyword-tag">Data Science</span>
              <span className="keyword-tag">Software Testing</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-relative">
              <img src={orangeCircle} alt="" className="hero-bg-shape" />
              <img src={heroGirl} alt="Hero" className="main-hero-img" />
              <img src={bestSellerBox} alt="Best Seller" className="best-seller-overlay-large" />
            </div>
          </div>
        </section>

        <img src={bordersImg} alt="" className="section-divider" />

        {/* AI PLATFORM */}
        <section className="platform-intro">
          <h2 className="platform-title">
            World's First <span className="text-orange">AI Based</span> <br />
            Online Learning Platform
          </h2>
          <div className="ai-slides-row">
            {slides.map((slide, index) => (
              <div key={index} className="ai-slide-card">
                <img src={slide.img} alt={slide.title} />
              </div>
            ))}
          </div>
        </section>

        <img src={bordersImg} alt="" className="section-divider" />

        {/* WHO CAN JOIN */}
        <section className="who-join-section">
          <div className="who-join-content">
            <div className="who-join-left">
              <h4 className="section-tag-orange">WHO CAN JOIN</h4>
              <h2 className="who-join-title">Skill Development <br /> Schemes For All</h2>
              <div className="who-join-grid">
                <div className="join-card">
                  <img src={collegeIcon} alt="Colleges" />
                  <div className="join-info"><span className="join-number">01</span><p>Colleges/Universities</p></div>
                </div>
                <div className="join-card">
                  <img src={professionalIcon} alt="Professionals" />
                  <div className="join-info"><span className="join-number">02</span><p>Individual/Working Professionals</p></div>
                </div>
                <div className="join-card">
                  <img src={startupIcon} alt="Startups" />
                  <div className="join-info"><span className="join-number">03</span><p>Startups</p></div>
                </div>
                <div className="join-card">
                  <img src={corporateIcon} alt="Corporates" />
                  <div className="join-info"><span className="join-number">04</span><p>Corporates</p></div>
                </div>
              </div>
            </div>
            <div className="who-join-right">
              <img src={collaborativeImg} alt="Collaborative" className="collaborative-img" />
            </div>
          </div>
        </section>

        <img src={bordersImg} alt="" className="section-divider" />

        {/* HOW IT WORKS */}
        <section className="how-works-outer">
          <div className="how-works-container">
            <div className="how-works-pill">How It Works</div>
            <div className="how-works-blue-box">
              <img src={howItWorksImg} alt="Process Flow" className="how-works-main-img" />
            </div>
            <img src={orangeCircle} alt="" className="how-works-circle-decor" />
          </div>
        </section>

        <img src={bordersImg} alt="" className="section-divider" />

        {/* POPULAR COURSES */}
        <section className="popular-courses-section">
          <h2 className="popular-title">Popular <span className="text-orange">Courses</span></h2>
          <div className="courses-placeholder"></div>
          <div className="view-all-container">
            <button className="view-all-btn">View All Courses</button>
          </div>
        </section>

        <img src={bordersImg} alt="" className="section-divider" />

        {/* ACHIEVEMENTS */}
        <section className="achievements-section">
          <h2 className="achievements-title">Our <span className="text-orange">Achievements</span></h2>
          <div className="achievements-container">
            <div className="achievements-left">
              <img src={achievementsImg} alt="Achievements" className="achievements-main-img" />
            </div>
            <div className="achievements-right">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <h3 className="stat-number">100</h3>
                    <p className="stat-label">Students <br /> Trained</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <h3 className="stat-number">50</h3>
                    <p className="stat-label">Courses <br /> Available</p>
                  </div>
                </div>
                <div className="stat-card stat-card-full">
                  <div className="stat-header">
                    <h3 className="stat-number text-blue">70%</h3>
                    <p className="stat-label">Students Secured <br /> Jobs in Level 1 Companies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <img src={bordersImg} alt="" className="section-divider" />

        {/* MENTORS (INFINITY CARDS) */}
        <section className="mentors-section">
          <h2 className="mentors-title">Meet Our Professional <br /><span className="text-orange">Mentors & Trainers</span></h2>
          <div className="mentors-container">
            <div className="mentors-slider">
              {mentors.map((mentor, index) => (
                <div key={index} className="mentor-card">
                  <div className="mentor-card-header">
                    <img src={teacherCardImg} alt={mentor.name} className="mentor-img" />
                    <div className="mentor-header-info">
                      <h4 className="mentor-name">{mentor.name}</h4>
                      <p className="mentor-field">{mentor.field}</p>
                    </div>
                  </div>
                  <hr className="mentor-divider" />
                  <p className="mentor-desc">{mentor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section className="certifications-section">
          <h2 className="cert-title">Our <span className="text-orange">Certifications</span></h2>
          <div className="cert-logos-row">
            <img src={iso27001} alt="ISO 27001" />
            <img src={iso9001} alt="ISO 9001" />
            <img src={iso200001} alt="ISO 200001" />
            <img src={iso29993} alt="ISO 29993" />
          </div>
        </section>

        {/* COLLABORATIONS */}
        <section className="collaborations-section">
          <h2 className="collab-title">Our <span className="text-orange">Collaborations</span></h2>
          <div className="collab-img-container">
            <img src={collaborationsImg} alt="Our Collaborations" className="collab-main-img" />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;