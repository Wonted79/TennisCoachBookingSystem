import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Phone, BookOpen, ShieldCheck } from 'lucide-react';
import './Booking.css';

// 예약 상태 상수
const BOOKING_STATUS = {
  AVAILABLE: 'available',      // 흰색 - 예약 가능
  BOOKED: 'booked',           // 빨간색 - 예약 완료
  HELD: 'held',               // 주황색 - 임시 예약
};

function Booking() {
  const navigate = useNavigate();

  // 현재 주의 시작일 (월요일 기준)
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  // 예약 데이터 (서버에서 로드)
  const [bookings, setBookings] = useState({});

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

  const COACH_ADMIN_ID = 3;

  // 주간 예약 데이터 로드
  const loadWeekReservations = useCallback(async () => {
    const startDate = formatDate(weekStartDate);
    const endDate = new Date(weekStartDate);
    endDate.setDate(weekStartDate.getDate() + 6);
    const endDateStr = formatDate(endDate);

    try {
      const res = await fetch(
        `/api/reservation/week?adminId=${COACH_ADMIN_ID}&startDate=${startDate}&endDate=${endDateStr}`
      );
      if (res.ok) {
        const data = await res.json();
        // reservationAt: "YYYY-MM-DDTHH:mm:ss" → { dateKey: { timeKey: status } }
        const mapped = {};
        data.forEach((r) => {
          const dt = r.reservationAt;
          const dateKey = dt.slice(0, 10);
          const timeKey = dt.slice(11, 16);
          if (!mapped[dateKey]) mapped[dateKey] = {};
          mapped[dateKey][timeKey] =
            r.status === 'HELD' ? BOOKING_STATUS.HELD : BOOKING_STATUS.BOOKED;
        });
        setBookings(mapped);
      }
    } catch (err) {
      console.error('예약 데이터 로드 실패:', err);
    }
  }, [weekStartDate]);

  useEffect(() => {
    loadWeekReservations();
  }, [loadWeekReservations]);

  // 예약 상태 가져오기
  const getBookingStatus = (dateInfo, time) => {
    const dateKey = formatDate(dateInfo.fullDate);
    return bookings[dateKey]?.[time] || BOOKING_STATUS.AVAILABLE;
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
    <div className="booking">
      {/* Header */}
      <header className="booking-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 뒤로
        </button>
        <h1>레슨 예약</h1>
      </header>

      {/* Announcement Banner */}
      <div className="announcement-banner">
        <div className="announcement-row">
          <Megaphone size={18} />
          <span className="announcement-text">
            레슨 예약은 최소 하루 전까지 가능합니다. 당일 예약은 전화 문의 바랍니다.
          </span>
        </div>
        <div className="announcement-row inquiry-row">
          <Phone size={16} />
          <span className="inquiry-text">
            레슨 문의: 010-5448-7723
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="booking-nav-buttons">
        <button
          className="booking-nav-button"
          onClick={() => navigate('/programs')}
        >
          <BookOpen size={18} />
          프로그램 안내
        </button>
        <button
          className="booking-nav-button"
          onClick={() => navigate('/rules')}
        >
          <ShieldCheck size={18} />
          레슨 규정
        </button>
      </div>

      {/* Legend */}
      <div className="booking-legend">
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
                  const status = getBookingStatus(dateInfo, time);
                  return (
                    <td
                      key={dayIndex}
                      className={`booking-cell ${status}`}
                    >
                      {status === BOOKING_STATUS.BOOKED && '예약'}
                      {status === BOOKING_STATUS.HELD && '임시'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Booking;
