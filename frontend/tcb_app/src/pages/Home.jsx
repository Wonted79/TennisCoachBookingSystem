import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const coachId = searchParams.get('coachId');

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetch(`${import.meta.env.VITE_API_URL}/api/public/coaches/${username}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => {
          setCoach(data);
          setLoading(false);
        })
        .catch((err) => { console.error('코치 정보 로드 실패:', err); setLoading(false); });
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/api/public/coaches`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => {
          if (!Array.isArray(data) || data.length === 0) { setLoading(false); return; }
          const found = coachId ? data.find((c) => String(c.id) === String(coachId)) : data[0];
          const target = found ?? data[0];
          setCoach(target);
          setLoading(false);
        })
        .catch((err) => { console.error('코치 정보 로드 실패:', err); setLoading(false); });
    }
  }, [username, coachId]);

  const handleBooking = () => {
    if (!coach) return;
    if (coach.username) navigate(`/${coach.username}/booking`);
    else navigate(`/booking?coachId=${coach.id}`);
  };

  const hasEdu  = coach?.education?.length > 0;
  const hasCert = coach?.certifications?.length > 0;

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
            <li><a href="#rules">레슨 규정</a></li>
            <li>
              <a
                href="#home"
                className="nav-cta"
                onClick={(e) => { e.preventDefault(); handleBooking(); }}
              >
                예약하기
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hcp-bg-gradient"></div>
        <div className="hcp-orb hcp-orb-1"></div>
        <div className="hcp-orb hcp-orb-2"></div>

        {loading && (
          <div className="hcp-loading">
            <div className="hcp-spinner"></div>
          </div>
        )}

        {!loading && !coach && (
          <div className="hcp-empty">코치 정보를 불러올 수 없습니다.</div>
        )}

        {!loading && coach && (
          <div className="hcp-card">

            {/* top row: photo + identity + bio */}
            <div className="hcp-top">
              <div className="hcp-photo-wrap">
                <div className="hcp-photo-ring">
                  {coach.profileImageUrl
                    ? <img
                        className="hcp-photo-img"
                        src={`${import.meta.env.VITE_API_URL}${coach.profileImageUrl}`}
                        alt={coach.name}
                      />
                    : <span className="hcp-initial">{coach.name?.charAt(0) ?? '?'}</span>
                  }
                </div>
                {coach.title && <span className="hcp-title-badge">{coach.title}</span>}
              </div>

              <div className="hcp-identity">
                <p className="hcp-org">123 Tennis Club · 이촌</p>
                <h2 className="hcp-name">{coach.name} 코치</h2>
                {coach.introduction && (
                  <p className="hcp-bio">"{coach.introduction}"</p>
                )}
              </div>
            </div>

            {/* credentials: two columns */}
            {(hasEdu || hasCert) && (
              <div className="hcp-creds">
                {hasEdu && (
                  <div className="hcp-cred-group">
                    <div className="hcp-cred-label">경력 / 학력</div>
                    <ul className="hcp-cred-list">
                      {coach.education.map((edu, i) => <li key={i}>{edu}</li>)}
                    </ul>
                  </div>
                )}
                {hasCert && (
                  <div className="hcp-cred-group">
                    <div className="hcp-cred-label">자격증</div>
                    <ul className="hcp-cred-list">
                      {coach.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <button className="hcp-book-btn" onClick={handleBooking}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              예약 현황 확인하기
            </button>

          </div>
        )}
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
            <li><a href="#rules">레슨 규정</a></li>
          </ul>
        </div>
        <div className="footer-copy">© 2025 123Tennis Club 이촌. All rights reserved.</div>
      </footer>

    </div>
  );
}

export default Home;
