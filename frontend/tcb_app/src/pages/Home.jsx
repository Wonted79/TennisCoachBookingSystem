import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

/* 카드 인덱스별 색상 변형 - HTML 파일과 동일 */
const CARD_VARIANTS = [
  { headerBg: 'linear-gradient(145deg,var(--g50) 0%,var(--y50) 100%)', ringColor: 'var(--g500)', ringGlow: 'rgba(82,183,136,.15)', initialColor: 'var(--g700)' },
  { headerBg: 'linear-gradient(145deg,var(--y50) 0%,var(--g50) 100%)', ringColor: 'var(--y400)', ringGlow: 'rgba(200,217,106,.15)', initialColor: 'var(--y400)' },
  { headerBg: 'linear-gradient(145deg,var(--n50) 0%,var(--g50) 100%)',  ringColor: 'var(--g300)', ringGlow: 'rgba(149,213,178,.15)', initialColor: 'var(--g500)' },
  { headerBg: 'linear-gradient(145deg,#f7f7f7 0%,var(--g50) 100%)',    ringColor: 'var(--n300)', ringGlow: 'rgba(176,176,176,.12)', initialColor: 'var(--n300)' },
];

function CoachCard({ coach, onBooking, index }) {
  const hasEdu  = coach.education?.length > 0;
  const hasCert = coach.certifications?.length > 0;
  const [activeTab, setActiveTab] = useState(hasEdu ? 'edu' : 'cert');

  const v       = CARD_VARIANTS[index % CARD_VARIANTS.length];
  const initial = coach.name?.charAt(0) ?? '?';

  return (
    <div className="coach-card">
      {/* ── HEADER ── */}
      <div className="coach-card-header" style={{ background: v.headerBg }}>
        {coach.title && <span className="coach-badge">{coach.title}</span>}
        <div
          className="coach-photo-ring"
          style={{ borderColor: v.ringColor, boxShadow: `0 0 0 6px ${v.ringGlow}` }}
        >
          {coach.profileImageUrl
            ? <img className="coach-photo-img" src={`${import.meta.env.VITE_API_URL}${coach.profileImageUrl}`} alt={coach.name} />
            : <span className="coach-initial" style={{ color: v.initialColor }}>{initial}</span>
          }
        </div>
        <div className="coach-header-info">
          <div className="coach-name">{coach.name}</div>
          <div className="coach-role">{coach.title}</div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="coach-card-body">
        {coach.introduction && <p className="coach-bio">{coach.introduction}</p>}

        {(hasEdu || hasCert) && (
          <>
            <div className="coach-tabs">
              {hasEdu && (
                <button
                  className={`tab-btn${activeTab === 'edu' ? ' active' : ''}`}
                  onClick={() => setActiveTab('edu')}
                >
                  경력/학력
                </button>
              )}
              {hasCert && (
                <button
                  className={`tab-btn${activeTab === 'cert' ? ' active' : ''}`}
                  onClick={() => setActiveTab('cert')}
                >
                  자격증
                </button>
              )}
            </div>

            {hasEdu && (
              <div className={`tab-panel${activeTab === 'edu' ? ' active' : ''}`}>
                <ul className="cred-list">
                  {coach.education.map((edu, i) => <li key={i}>{edu}</li>)}
                </ul>
              </div>
            )}

            {hasCert && (
              <div className={`tab-panel${activeTab === 'cert' ? ' active' : ''}`}>
                <ul className="cred-list">
                  {coach.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="coach-card-footer">
        <div className="coach-footer-top">
          <div className="sns-row">
            <a href="#" className="sns-btn instagram" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="sns-btn youtube" aria-label="YouTube">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="sns-btn" aria-label="Blog">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </a>
          </div>
        </div>
        <button className="book-btn" onClick={() => onBooking(coach.id)}>
          예약 현황 확인하기
        </button>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const trackRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/public/coaches`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => { if (Array.isArray(data)) setCoaches(data); })
      .catch((err) => console.error('코치 목록 로드 실패:', err));
  }, []);

  const handleBooking = (coachId) => {
    navigate(`/booking?coachId=${coachId}`);
  };

  const scrollCoaches = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-wrap">

      {/* NAV */}
      <nav className="home-nav">
        <div className="nav-inner">
          <a href="#home" className="nav-logo">
            123<span className="nav-logo-dot"></span>Tennis
          </a>
          <ul>
            <li><a href="#programs">프로그램</a></li>
            <li><a href="#coaches">코치진</a></li>
            <li><a href="#rules">레슨 규정</a></li>
            <li><a href="#coaches" className="nav-cta">예약하기</a></li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-left">
          <div className="hero-eyebrow">123 Tennis Club · 이촌</div>
          <h1>
            PLAY<br />
            LIKE A<em>CHAMPION.</em>
          </h1>
          <p className="hero-desc">
            전문 코치진과 함께 당신의 테니스를 완성하세요.<br />
            실력에 맞춘 맞춤형 레슨, 체계적인 커리큘럼.
          </p>
          <div className="hero-btns">
            <a href="#coaches" className="btn-primary">코치 예약하기</a>
            <a href="#programs" className="btn-outline">프로그램 보기</a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-court-bg"></div>
          <div className="court-svg-wrap">
            <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="40" y="40" width="420" height="520" stroke="#2d6a4f" strokeWidth="4"/>
              <line x1="40" y1="300" x2="460" y2="300" stroke="#2d6a4f" strokeWidth="4"/>
              <line x1="250" y1="40" x2="250" y2="560" stroke="#2d6a4f" strokeWidth="3"/>
              <rect x="100" y="40" width="300" height="180" stroke="#2d6a4f" strokeWidth="2.5"/>
              <rect x="100" y="380" width="300" height="180" stroke="#2d6a4f" strokeWidth="2.5"/>
              <circle cx="250" cy="300" r="7" fill="#2d6a4f"/>
            </svg>
          </div>
          <div className="hero-blob"></div>
          <div className="hero-ball"></div>
        </div>
      </section>

      {/* COACHES */}
      <section id="coaches">
        <div className="container">
          <div className="coaches-header">
            <div>
              <div className="sec-eyebrow">Our Coaches</div>
              <h2 className="sec-title">전문 코치진</h2>
              <p className="sec-sub">각 분야 최고의 전문가들이 여러분의 테니스를 책임집니다.</p>
            </div>
            <div className="scroll-arrows">
              <button className="arrow-btn" onClick={() => scrollCoaches(-1)} aria-label="이전">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button className="arrow-btn" onClick={() => scrollCoaches(1)} aria-label="다음">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="coaches-track" ref={trackRef}>
            {coaches.map((coach, i) => (
              <CoachCard key={coach.id} coach={coach} onBooking={handleBooking} index={i} />
            ))}
            {coaches.length === 0 && (
              <p className="no-coaches">코치 정보를 불러오는 중입니다...</p>
            )}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs">
        <div className="container">
          <div className="sec-eyebrow">Lesson Fee</div>
          <h2 className="sec-title">프로그램 안내</h2>
          <p className="sec-sub">123테니스 이촌 레슨 프로그램 요금표입니다.</p>

          <div className="fee-table-wrap">
            <table className="fee-table">
              <thead>
                <tr>
                  <th className="fee-th-type"></th>
                  <th className="fee-th-time">30분</th>
                  <th className="fee-th-time">60분</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fee-label">1:1 레슨</td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">주1회(월4회)</span><span className="fee-price">26만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주2회(월8회)</span><span className="fee-price">40만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주3회(월12회)</span><span className="fee-price">57만원</span></div>
                  </td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">주1회(월4회)</span><span className="fee-price">40만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주2회(월8회)</span><span className="fee-price">76만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주3회(월12회)</span><span className="fee-price">108만원</span></div>
                  </td>
                </tr>
                <tr>
                  <td className="fee-label">2:1 레슨</td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">주1회(월4회)</span><span className="fee-price">40만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주2회(월8회)</span><span className="fee-price">54만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주3회(월12회)</span><span className="fee-price">78만원</span></div>
                  </td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">주1회(월4회)</span><span className="fee-price">54만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주2회(월8회)</span><span className="fee-price">96만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주3회(월12회)</span><span className="fee-price">132만원</span></div>
                  </td>
                </tr>
                <tr>
                  <td className="fee-label">3:1 레슨</td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">주1회(월4회)</span><span className="fee-price">51만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주2회(월8회)</span><span className="fee-price">69만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주3회(월12회)</span><span className="fee-price">99만원</span></div>
                  </td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">주1회(월4회)</span><span className="fee-price">69만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주2회(월8회)</span><span className="fee-price">123만원</span></div>
                    <div className="fee-row"><span className="fee-freq">주3회(월12회)</span><span className="fee-price">159만원</span></div>
                  </td>
                </tr>
                <tr>
                  <td className="fee-label">일일 레슨</td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">1:1 레슨</span><span className="fee-price">8만원</span></div>
                    <div className="fee-row"><span className="fee-freq">2:1 레슨</span><span className="fee-price">14만원</span></div>
                    <div className="fee-row"><span className="fee-freq">3:1 레슨</span><span className="fee-price">18만원</span></div>
                  </td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">1:1 레슨</span><span className="fee-price">14만원</span></div>
                    <div className="fee-row"><span className="fee-freq">2:1 레슨</span><span className="fee-price">24만원</span></div>
                    <div className="fee-row"><span className="fee-freq">3:1 레슨</span><span className="fee-price">33만원</span></div>
                  </td>
                </tr>
                <tr>
                  <td className="fee-label">히팅 레슨</td>
                  <td className="fee-cell">
                    <div className="fee-row"><span className="fee-freq">60분</span><span className="fee-price">17만원</span></div>
                  </td>
                  <td className="fee-cell fee-cell-hitting">
                    <div className="fee-row"><span className="fee-freq">120분</span><span className="fee-price">32만원</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul className="fee-notes">
            <li>사용기간 4주를 원칙으로 합니다 (우천 시 사용 가능)</li>
            <li>당일 취소시 차감 (레슨 시간 24시간 기준)</li>
            <li>레슨 마지막 회차 재등록 부탁드립니다</li>
            <li>계좌번호 &nbsp;<strong>농협 302-1782-8867-11 &nbsp;최민주</strong></li>
          </ul>
        </div>
      </section>

      {/* RULES */}
      <section id="rules">
        <div className="container">
          <div className="sec-eyebrow">Guidelines</div>
          <h2 className="sec-title">레슨 규정</h2>
          <p className="sec-sub">레슨비 입금 후 스케줄이 확정됩니다.</p>

          <p className="rule-court-note">레슨 코트는 세로로 반코트 레슨 진행합니다.</p>

          <div className="rules-grid">
            <div className="rule-card">
              <div className="rule-card-hdr">
                <span className="rule-card-title">레슨 규정</span>
              </div>
              <ol className="rule-list rule-ol">
                <li>사용기간 : <strong>4주</strong> (우천 시 보충)</li>
                <li>정해진 시간에 레슨 하는 걸 원칙으로 합니다.</li>
                <li>당일 취소 시 <strong>1회 차감</strong> (24시간 기준)</li>
                <li>스케줄 변경 시 담당 선생님과 조율 후 보충</li>
              </ol>
            </div>

            <div className="rule-card">
              <div className="rule-card-hdr">
                <span className="rule-card-title">환불 규정</span>
              </div>
              <ol className="rule-list rule-ol">
                <li>레슨 시작 전 환불 시 등록금액에서 <strong>10% 차감 후 환불</strong></li>
                <li>레슨 시작 후 <strong>환불 불가</strong></li>
                <li>
                  골절상 또는 근육 파열 등 레슨을 받을 수 없는 몸의 상태 시
                  병원 진단서 제출할 경우 등록금액의 <strong>10% 차감 후 환불</strong> 가능
                  <span className="rule-sub-note">(잔여 레슨이 1, 2회 남았을 시 환불 불가)</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="rule-notice">
            레슨 마지막 회차때 재등록 입금 부탁드립니다.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">123<span>Tennis</span></div>
            <div className="footer-addr">서울시 용산구 이촌동 &nbsp;·&nbsp; 이 주형 원장</div>
          </div>
          <ul className="footer-links">
            <li><a href="#programs">프로그램</a></li>
            <li><a href="#coaches">코치진</a></li>
            <li><a href="#rules">레슨 규정</a></li>
          </ul>
        </div>
        <div className="footer-copy">© 2025 123Tennis Club 이촌. All rights reserved.</div>
      </footer>

    </div>
  );
}

export default Home;
