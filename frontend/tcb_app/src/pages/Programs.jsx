import { useNavigate } from 'react-router-dom';
import './Programs.css';

function Programs() {
  const navigate = useNavigate();

  return (
    <div className="programs">
      <header className="programs-header">
        <button className="back-button" onClick={() => navigate('/booking')}>
          ← 뒤로
        </button>
        <h1>프로그램 안내</h1>
      </header>

      <main className="programs-content">
        <section className="program-card">
          <h2 className="program-card-title">개인 레슨</h2>
          <div className="program-card-body">
            <p className="program-desc">
              1:1 맞춤형 레슨으로 개인의 수준과 목표에 맞춰 체계적으로 진행됩니다.
              기본기부터 실전 경기 전략까지 집중적으로 배울 수 있습니다.
            </p>
            <ul className="program-details">
              <li><strong>대상:</strong> 초급 ~ 상급</li>
              <li><strong>시간:</strong> 1회 50분</li>
              <li><strong>정원:</strong> 1명</li>
            </ul>
          </div>
        </section>

        <section className="program-card">
          <h2 className="program-card-title">그룹 레슨</h2>
          <div className="program-card-body">
            <p className="program-desc">
              소규모 그룹으로 진행되며, 비슷한 수준의 회원들과 함께 배우면서
              실전 감각과 경기 운영 능력을 키울 수 있습니다.
            </p>
            <ul className="program-details">
              <li><strong>대상:</strong> 초급 ~ 중급</li>
              <li><strong>시간:</strong> 1회 60분</li>
              <li><strong>정원:</strong> 2~4명</li>
            </ul>
          </div>
        </section>

        <section className="program-card">
          <h2 className="program-card-title">주니어 레슨</h2>
          <div className="program-card-body">
            <p className="program-desc">
              성장기 학생들을 위한 전문 프로그램입니다. 올바른 자세와 기본기를
              중점적으로 지도하며, 체력 향상과 스포츠맨십을 함께 배웁니다.
            </p>
            <ul className="program-details">
              <li><strong>대상:</strong> 초등학생 ~ 고등학생</li>
              <li><strong>시간:</strong> 1회 60분</li>
              <li><strong>정원:</strong> 2~6명</li>
            </ul>
          </div>
        </section>

        <section className="program-card">
          <h2 className="program-card-title">집중 클리닉</h2>
          <div className="program-card-body">
            <p className="program-desc">
              서브, 리턴, 발리 등 특정 기술을 집중적으로 향상시키기 위한
              단기 프로그램입니다. 약점 보완에 효과적입니다.
            </p>
            <ul className="program-details">
              <li><strong>대상:</strong> 중급 ~ 상급</li>
              <li><strong>시간:</strong> 1회 90분</li>
              <li><strong>정원:</strong> 1~2명</li>
            </ul>
          </div>
        </section>

        <div className="programs-booking-wrapper">
          <button
            className="programs-booking-button"
            onClick={() => navigate('/booking')}
          >
            예약하기
          </button>
        </div>
      </main>
    </div>
  );
}

export default Programs;
