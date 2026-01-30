import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';

// 예약 상태 상수
const BOOKING_STATUS = {
  AVAILABLE: 'available',      // 흰색 - 예약 가능
  BOOKED: 'booked',           // 빨간색 - 다른 사람이 예약
  HELD: 'held',               // 주황색 - 코치가 임시 예약
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

  // 샘플 예약 데이터 (실제로는 API에서 가져옴)
  const [bookings] = useState(() => {
    const sampleBookings = {};
    // 샘플 데이터: 일부 시간대를 예약됨/임시예약으로 설정
    weekDates.forEach((dateInfo, dayIndex) => {
      const dateKey = dateInfo.fullDate.toISOString().split('T')[0];
      sampleBookings[dateKey] = {};

      // 샘플 예약 데이터 추가
      if (dayIndex === 0) { // 월요일
        sampleBookings[dateKey]['09:00'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['09:30'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['14:00'] = BOOKING_STATUS.HELD;
      }
      if (dayIndex === 2) { // 수요일
        sampleBookings[dateKey]['10:00'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['10:30'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['11:00'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['16:00'] = BOOKING_STATUS.HELD;
        sampleBookings[dateKey]['16:30'] = BOOKING_STATUS.HELD;
      }
      if (dayIndex === 4) { // 금요일
        sampleBookings[dateKey]['08:00'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['08:30'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['15:00'] = BOOKING_STATUS.HELD;
      }
      if (dayIndex === 5) { // 토요일
        sampleBookings[dateKey]['09:00'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['09:30'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['10:00'] = BOOKING_STATUS.BOOKED;
        sampleBookings[dateKey]['10:30'] = BOOKING_STATUS.BOOKED;
      }
    });
    return sampleBookings;
  });

  // 예약 상태 가져오기
  const getBookingStatus = (dateInfo, time) => {
    const dateKey = dateInfo.fullDate.toISOString().split('T')[0];
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

  // 셀 클릭 핸들러
  const handleCellClick = (dateInfo, time, status) => {
    if (status === BOOKING_STATUS.AVAILABLE) {
      const dateStr = `${dateInfo.month}월 ${dateInfo.date}일 (${dateInfo.day})`;
      alert(`${dateStr} ${time} 예약을 진행하시겠습니까?`);
      // 실제로는 예약 모달 또는 예약 확인 페이지로 이동
    } else if (status === BOOKING_STATUS.BOOKED) {
      alert('이미 예약된 시간입니다.');
    } else if (status === BOOKING_STATUS.HELD) {
      alert('코치가 임시로 예약한 시간입니다. 문의해 주세요.');
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
    <div className="booking">
      {/* Header */}
      <header className="booking-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 뒤로
        </button>
        <h1>레슨 예약</h1>
      </header>

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
                      onClick={() => handleCellClick(dateInfo, time, status)}
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
