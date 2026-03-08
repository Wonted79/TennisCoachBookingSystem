import { useNavigate } from 'react-router-dom';
import './Rules.css';

function Rules() {
  const navigate = useNavigate();

  return (
    <div className="rules">
      <header className="rules-header">
        <button className="back-button" onClick={() => navigate('/booking')}>
          ← 뒤로
        </button>
        <h1>레슨 규정</h1>
      </header>

      <main className="rules-content">
        <section className="rules-card">
          <h2 className="rules-card-title">예약 및 취소 규정</h2>
          <div className="rules-card-body">
            <ul className="rules-list">
              <li>레슨 예약은 최소 <strong>1일 전</strong>까지 가능합니다.</li>
              <li>예약 취소는 레슨 시작 <strong>24시간 전</strong>까지 가능합니다.</li>
              <li>24시간 이내 취소 시 해당 레슨은 <strong>소진 처리</strong>됩니다.</li>
              <li>당일 예약은 전화 문의를 통해서만 가능합니다.</li>
              <li>노쇼(No-Show) 시 해당 레슨은 소진 처리됩니다.</li>
            </ul>
          </div>
        </section>

        <section className="rules-card">
          <h2 className="rules-card-title">레슨 진행 규정</h2>
          <div className="rules-card-body">
            <ul className="rules-list">
              <li>레슨 시작 <strong>5분 전</strong>까지 도착해 주세요.</li>
              <li>10분 이상 지각 시 레슨 시간이 단축될 수 있습니다.</li>
              <li>레슨 시 운동에 적합한 복장과 테니스화를 착용해 주세요.</li>
              <li>라켓은 개인 지참을 원칙으로 합니다. (대여 가능)</li>
              <li>부상 방지를 위해 충분한 준비 운동을 권장합니다.</li>
            </ul>
          </div>
        </section>

        <section className="rules-card">
          <h2 className="rules-card-title">코트 이용 규정</h2>
          <div className="rules-card-body">
            <ul className="rules-list">
              <li>레슨 시간 외 코트 사용은 사전 허가가 필요합니다.</li>
              <li>코트 내 음식물 반입은 금지되며, 물은 허용됩니다.</li>
              <li>사용 후 코트 정리에 협조해 주세요.</li>
              <li>우천 시 실외 레슨은 취소되며, 별도 보충 일정이 안내됩니다.</li>
            </ul>
          </div>
        </section>

        <section className="rules-card">
          <h2 className="rules-card-title">환불 규정</h2>
          <div className="rules-card-body">
            <ul className="rules-list">
              <li>레슨 시작 전 전액 환불이 가능합니다.</li>
              <li>레슨 진행 후에는 잔여 횟수에 대해 환불 가능합니다.</li>
              <li>환불 요청은 코치에게 직접 문의해 주세요.</li>
            </ul>
          </div>
        </section>

        <div className="rules-booking-wrapper">
          <button
            className="rules-booking-button"
            onClick={() => navigate('/booking')}
          >
            예약하기
          </button>
        </div>
      </main>
    </div>
  );
}

export default Rules;
