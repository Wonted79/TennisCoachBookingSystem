import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Booking.css';
import './AdminBooking.css';

function AdminBooking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 로그인하지 않은 사용자는 접근 불가
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

  // 현재 주의 시작일 (월요일 기준)
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  // 예약 데이터 (서버에서 로드)
  const [reservations, setReservations] = useState({});

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    reservationDate: '',
    reservationTime: '',
    name: '',
    phone: '',
    applyDate: '',
    registerDate: '',
    changeDate: '',
    amount: 0,
    repaymentDate: '',
    status: 'BOOKED',
  });

  // 시간 슬롯 생성 (6:00 ~ 21:30, 30분 단위)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 21 || (hour === 21 && slots.length < 32)) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  }, []);

  // 요일 배열
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  // 주간 날짜 생성
  const weekDates = useMemo(() => {
    return days.map((day, index) => {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + index);
      return {
        day,
        date: date.getDate(),
        month: date.getMonth() + 1,
        fullDate: new Date(date),
      };
    });
  }, [weekStartDate]);

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 주간 예약 데이터 로드
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
        // 예약 데이터를 { 'YYYY-MM-DD': { 'HH:mm': reservation } } 형태로 변환
        const mapped = {};
        data.forEach((r) => {
          if (!mapped[r.reservationDate]) {
            mapped[r.reservationDate] = {};
          }
          mapped[r.reservationDate][r.reservationTime] = r;
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

  // 예약 데이터 가져오기
  const getReservation = (dateInfo, time) => {
    const dateKey = formatDate(dateInfo.fullDate);
    return reservations[dateKey]?.[time] || null;
  };

  // 이전 주로 이동
  const goToPreviousWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(weekStartDate.getDate() - 7);
    setWeekStartDate(newDate);
  };

  // 다음 주로 이동
  const goToNextWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(weekStartDate.getDate() + 7);
    setWeekStartDate(newDate);
  };

  // 셀 클릭 → 모달 열기
  const handleCellClick = (dateInfo, time) => {
    const existing = getReservation(dateInfo, time);
    const dateKey = formatDate(dateInfo.fullDate);

    if (existing) {
      // 기존 예약 수정
      setModalData({
        id: existing.id,
        reservationDate: dateKey,
        reservationTime: time,
        name: existing.name || '',
        phone: existing.phone || '',
        applyDate: existing.applyDate || '',
        registerDate: existing.registerDate || '',
        changeDate: existing.changeDate || '',
        amount: existing.amount || 0,
        repaymentDate: existing.repaymentDate || '',
        status: existing.status || 'BOOKED',
      });
    } else {
      // 새 예약
      const today = formatDate(new Date());
      setModalData({
        id: null,
        reservationDate: dateKey,
        reservationTime: time,
        name: '',
        phone: '',
        applyDate: today,
        registerDate: today,
        changeDate: '',
        amount: 0,
        repaymentDate: '',
        status: 'BOOKED',
      });
    }
    setModalOpen(true);
  };

  // 모달 입력 핸들러
  const handleModalChange = (field, value) => {
    setModalData((prev) => ({ ...prev, [field]: value }));
  };

  // 저장 (생성 또는 수정)
  const handleSave = async () => {
    if (!modalData.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    const body = {
      adminId: user.id,
      reservationDate: modalData.reservationDate,
      reservationTime: modalData.reservationTime,
      name: modalData.name,
      phone: modalData.phone || null,
      applyDate: modalData.applyDate || null,
      registerDate: modalData.registerDate || null,
      changeDate: modalData.changeDate || null,
      amount: modalData.amount || 0,
      repaymentDate: modalData.repaymentDate || null,
      status: modalData.status,
    };

    try {
      let res;
      if (modalData.id) {
        // 수정
        res = await fetch(`/api/reservation/${modalData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        // 생성
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

  // 삭제
  const handleDelete = async () => {
    if (!modalData.id) return;
    if (!window.confirm('이 예약을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/reservation/${modalData.id}`, {
        method: 'DELETE',
      });
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

  // 현재 표시 중인 주 텍스트
  const weekRangeText = useMemo(() => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(weekStartDate.getDate() + 6);
    const startMonth = weekStartDate.getMonth() + 1;
    const startDay = weekStartDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    return `${startMonth}월 ${startDay}일 ~ ${endMonth}월 ${endDay}일`;
  }, [weekStartDate]);

  return (
    <div className="booking admin-booking">
      {/* Header */}
      <header className="booking-header admin-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 뒤로
        </button>
        <h1>예약 관리 (관리자)</h1>
        <span className="admin-badge">관리자 모드</span>
      </header>

      {/* Legend */}
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

      {/* Week Navigation */}
      <div className="week-navigation">
        <button className="nav-button" onClick={goToPreviousWeek}>
          ◀ 이전 주
        </button>
        <span className="week-range">{weekRangeText}</span>
        <button className="nav-button" onClick={goToNextWeek}>
          다음 주 ▶
        </button>
      </div>

      {/* Booking Table */}
      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th className="time-header">시간</th>
              {weekDates.map((dateInfo, index) => (
                <th key={index} className="day-header">
                  <div className="day-name">{dateInfo.day}</div>
                  <div className="day-date">
                    {dateInfo.month}/{dateInfo.date}
                  </div>
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
                  const hasReservation = !!reservation;
                  const cellStatus = hasReservation
                    ? reservation.status === 'HELD'
                      ? 'held'
                      : 'booked'
                    : 'available';

                  return (
                    <td
                      key={dayIndex}
                      className={`booking-cell admin-cell ${cellStatus}`}
                      onClick={() => handleCellClick(dateInfo, time)}
                    >
                      {hasReservation && (
                        <span className="cell-name">{reservation.name}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 예약 입력 모달 */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalData.id ? '예약 수정' : '새 예약 등록'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-info">
              <span>
                {modalData.reservationDate} {modalData.reservationTime}
              </span>
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
                <label>이름 *</label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => handleModalChange('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>전화번호</label>
                <input
                  type="tel"
                  value={modalData.phone}
                  onChange={(e) => handleModalChange('phone', e.target.value)}
                  placeholder="010-0000-0000"
                />
              </div>

              <div className="form-group">
                <label>신청일</label>
                <input
                  type="date"
                  value={modalData.applyDate}
                  onChange={(e) => handleModalChange('applyDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>등록날짜</label>
                <input
                  type="date"
                  value={modalData.registerDate}
                  onChange={(e) => handleModalChange('registerDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>바뀐날짜</label>
                <input
                  type="date"
                  value={modalData.changeDate}
                  onChange={(e) => handleModalChange('changeDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>금액</label>
                <input
                  type="number"
                  value={modalData.amount}
                  onChange={(e) =>
                    handleModalChange('amount', parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>재결제날짜</label>
                <input
                  type="date"
                  value={modalData.repaymentDate}
                  onChange={(e) => handleModalChange('repaymentDate', e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-save" onClick={handleSave}>
                {modalData.id ? '수정' : '저장'}
              </button>
              {modalData.id && (
                <button className="btn-delete" onClick={handleDelete}>
                  삭제
                </button>
              )}
              <button className="btn-cancel" onClick={() => setModalOpen(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBooking;
