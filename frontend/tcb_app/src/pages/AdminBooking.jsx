import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Booking.css';
import './AdminBooking.css';

function AdminBooking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="booking">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>로그인 후 이용할 수 있는 페이지입니다.</p>
          <button onClick={() => navigate('/login')}>로그인하기</button>
        </div>
      </div>
    );
  }

  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  // { 'YYYY-MM-DD': { 'HH:mm': reservation } }
  const [reservations, setReservations] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    reservationAt: '',  // ISO string: "YYYY-MM-DDTHH:mm:00"
    content: '',
    status: 'BOOKED',
  });

  // 6:00 ~ 21:30, 30분 단위
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 21) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const weekDates = useMemo(() => {
    return days.map((day, index) => {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + index);
      return { day, date: date.getDate(), month: date.getMonth() + 1, fullDate: new Date(date) };
    });
  }, [weekStartDate]);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const loadWeekReservations = useCallback(async () => {
    const startDate = formatDate(weekStartDate);
    const endDate = new Date(weekStartDate);
    endDate.setDate(weekStartDate.getDate() + 6);
    const endDateStr = formatDate(endDate);

    try {
      const res = await fetch(
        `/api/reservation/week?adminId=${user.id}&startDate=${startDate}&endDate=${endDateStr}`
      );
      if (res.ok) {
        const data = await res.json();
        // reservationAt: "2024-01-15T09:00:00" → dateKey + timeKey
        const mapped = {};
        data.forEach((r) => {
          const dt = r.reservationAt; // "YYYY-MM-DDTHH:mm:ss"
          const dateKey = dt.slice(0, 10);
          const timeKey = dt.slice(11, 16);
          if (!mapped[dateKey]) mapped[dateKey] = {};
          mapped[dateKey][timeKey] = r;
        });
        setReservations(mapped);
      }
    } catch (err) {
      console.error('예약 데이터 로드 실패:', err);
    }
  }, [weekStartDate, user.id]);

  useEffect(() => {
    loadWeekReservations();
  }, [loadWeekReservations]);

  const getReservation = (dateInfo, time) => {
    const dateKey = formatDate(dateInfo.fullDate);
    return reservations[dateKey]?.[time] || null;
  };

  const goToPreviousWeek = () => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() - 7);
    setWeekStartDate(d);
  };

  const goToNextWeek = () => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + 7);
    setWeekStartDate(d);
  };

  const handleCellClick = (dateInfo, time) => {
    const existing = getReservation(dateInfo, time);
    const reservationAt = `${formatDate(dateInfo.fullDate)}T${time}:00`;

    if (existing) {
      setModalData({
        id: existing.id,
        reservationAt,
        content: existing.content || '',
        status: existing.status || 'BOOKED',
      });
    } else {
      setModalData({
        id: null,
        reservationAt,
        content: '',
        status: 'BOOKED',
      });
    }
    setModalOpen(true);
  };

  const handleModalChange = (field, value) => {
    setModalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const body = {
      adminId: user.id,
      reservationAt: modalData.reservationAt,
      content: modalData.content || null,
      status: modalData.status,
    };

    try {
      let res;
      if (modalData.id) {
        res = await fetch(`/api/reservation/${modalData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/reservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        loadWeekReservations();
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('저장 실패:', err);
      alert('서버 연결에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!modalData.id) return;
    if (!window.confirm('이 예약을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/reservation/${modalData.id}`, { method: 'DELETE' });
      if (res.ok) {
        setModalOpen(false);
        loadWeekReservations();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('서버 연결에 실패했습니다.');
    }
  };

  const weekRangeText = useMemo(() => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(weekStartDate.getDate() + 6);
    return `${weekStartDate.getMonth() + 1}월 ${weekStartDate.getDate()}일 ~ ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;
  }, [weekStartDate]);

  // 모달 날짜/시간 표시용
  const modalDisplayTime = modalData.reservationAt
    ? `${modalData.reservationAt.slice(0, 10)} ${modalData.reservationAt.slice(11, 16)}`
    : '';

  // 셀 미리보기: content 첫 줄
  const getCellPreview = (reservation) => {
    if (!reservation?.content) return '';
    return reservation.content.split('\n')[0].slice(0, 10);
  };

  return (
    <div className="booking admin-booking">
      <header className="booking-header admin-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 뒤로
        </button>
        <h1>예약 관리 (관리자)</h1>
        <span className="admin-badge">관리자 모드</span>
      </header>

      <div className="booking-legend admin-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>예약 가능</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked"></span>
          <span>예약 완료</span>
        </div>
        <div className="legend-item">
          <span className="legend-color held"></span>
          <span>임시 예약</span>
        </div>
        <div className="legend-instruction">
          <span>셀을 클릭하여 예약 정보를 입력하세요</span>
        </div>
      </div>

      <div className="week-navigation">
        <button className="nav-button" onClick={goToPreviousWeek}>◀ 이전 주</button>
        <span className="week-range">{weekRangeText}</span>
        <button className="nav-button" onClick={goToNextWeek}>다음 주 ▶</button>
      </div>

      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th className="time-header">시간</th>
              {weekDates.map((dateInfo, index) => (
                <th key={index} className="day-header">
                  <div className="day-name">{dateInfo.day}</div>
                  <div className="day-date">{dateInfo.month}/{dateInfo.date}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="time-cell">{time}</td>
                {weekDates.map((dateInfo, dayIndex) => {
                  const reservation = getReservation(dateInfo, time);
                  const cellStatus = reservation
                    ? reservation.status === 'HELD' ? 'held' : 'booked'
                    : 'available';

                  return (
                    <td
                      key={dayIndex}
                      className={`booking-cell admin-cell ${cellStatus}`}
                      onClick={() => handleCellClick(dateInfo, time)}
                    >
                      {reservation && (
                        <span className="cell-name">{getCellPreview(reservation)}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalData.id ? '예약 수정' : '새 예약 등록'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="modal-info">
              <span>{modalDisplayTime}</span>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>예약 상태</label>
                <div className="status-toggle">
                  <button
                    type="button"
                    className={`toggle-btn toggle-booked ${modalData.status === 'BOOKED' ? 'active' : ''}`}
                    onClick={() => handleModalChange('status', 'BOOKED')}
                  >
                    예약 완료
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn toggle-held ${modalData.status === 'HELD' ? 'active' : ''}`}
                    onClick={() => handleModalChange('status', 'HELD')}
                  >
                    임시 예약
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>내용 (이름, 메모 등)</label>
                <textarea
                  value={modalData.content}
                  onChange={(e) => handleModalChange('content', e.target.value)}
                  placeholder="예약자 이름, 연락처 등 메모를 자유롭게 입력하세요"
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-save" onClick={handleSave}>
                {modalData.id ? '수정' : '저장'}
              </button>
              {modalData.id && (
                <button className="btn-delete" onClick={handleDelete}>삭제</button>
              )}
              <button className="btn-cancel" onClick={() => setModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBooking;
