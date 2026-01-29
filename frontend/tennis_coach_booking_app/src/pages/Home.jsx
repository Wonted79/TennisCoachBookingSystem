import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import coachProfile from '../assets/coach_profile.jpg';

function Home() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const coachInfo = {
    name: '이교헌',
    title: '프로',
    education: [
      '수원북중 87년 졸업',
      '삼일공고 90년 졸업',
      '성균관대학교 94년 졸업',
    ],
    achievements: [
      '83년 교보생명컵 테니스대회 초등부 단식 우승',
      '85년 소강배 테니스대회 중등부 단체전 우승',
      '85년 전국종별 테니스대회 중등부 복식 준우승',
      '89년 대통령기 테니스대회 고등부 단체 준우승',
      '92년 전한국 테니스대회 대학부 복식 3위',
    ],
    introduction: `안녕하세요, 이교헌 프로입니다. 30년 이상의 테니스 경력과 다수의 대회 수상 경험을 바탕으로
    초보자부터 상급자까지 맞춤형 레슨을 제공합니다. 기본기부터 탄탄하게, 즐거운 테니스를 함께 배워보세요.
    체계적인 커리큘럼과 개인별 피드백으로 여러분의 실력 향상을 도와드리겠습니다.`,
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <span className="logo-number">123</span>
            </div>
            <h1>잠원 123테니스</h1>
          </div>
          <div className="header-right">
            {user ? (
              <div className="user-menu">
                <span className="user-name">{user.name}님</span>
                {isAdmin() && (
                  <button
                    className="admin-button"
                    onClick={() => navigate('/admin/booking')}
                  >
                    예약 관리
                  </button>
                )}
                <button className="logout-button" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                className="login-button-header"
                onClick={() => navigate('/login')}
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="section-title">
          <h2>강사진 소개</h2>
          <div className="title-underline"></div>
        </section>

        {/* Coach Card */}
        <div className="coach-card">
          <div className="card-top">
            <div className="coach-photo-wrapper">
              <div className="coach-photo">
                <img src={coachProfile} alt={`${coachInfo.name} 코치`} />
              </div>
            </div>
            <div className="coach-credentials">
              <h3 className="coach-name">
                {coachInfo.name} <span className="coach-title">{coachInfo.title}</span>
              </h3>
              <div className="credentials-divider"></div>
              <ul className="credentials-list">
                <li className="credentials-section-title">학력</li>
                {coachInfo.education.map((edu, index) => (
                  <li key={`edu-${index}`}>{edu}</li>
                ))}
                <li className="credentials-section-title">수상 경력</li>
                {coachInfo.achievements.map((achievement, index) => (
                  <li key={`achievement-${index}`}>{achievement}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card-bottom">
            <h4>코치 소개</h4>
            <p>{coachInfo.introduction}</p>
          </div>
        </div>

        {/* Booking Button */}
        <div className="booking-button-wrapper">
          <button
            className="booking-button"
            onClick={() => navigate('/booking')}
          >
            예약하기
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <span>123 테니스 클럽</span>
          <span className="footer-divider">|</span>
          <span>서울시 서초구 잠원동</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
