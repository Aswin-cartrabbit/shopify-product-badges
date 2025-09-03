import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  DatePicker,
  TextField,
  Icon,
  Popover,
  InlineStack, // ← new layout component
  ActionList, // ← replaces ResourceList for simple menus
} from "@shopify/polaris";
import { CalendarIcon, ClockIcon } from "@shopify/polaris-icons";

/* ---------- small time-helper utilities ---------- */
const toInt = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 2 + m / 30;
};
const toTime = (n) => [Math.floor(n / 2), n % 2 ? "30" : "00"].join(":");
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const each30m = (t1: string, t2: string) =>
  range(...([t1, t2].map(toInt) as [number, number])).map(toTime);
// Create more comprehensive time options including AM/PM format
const createTimeList = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour < 12 ? 'AM' : 'PM';
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
      times.push({ value: time24, display: time12 });
    }
  }
  return times;
};

const timeList = createTimeList();

const offsetDate = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4);
const dateISO = (d) => offsetDate(d).toISOString().split("T")[0];
const timeISO = (d) => offsetDate(d).toISOString().split("T")[1].slice(0, 5);

const today = new Date();

/* ---------- component ---------- */
export function DateTimePicker({
  initialValue = Date.now(),
  dateLabel = "Date",
  timeLabel = "Time",
  onChange = (value: any) => {},
}) {
  const firstRender = useRef(true);

  /* calendar state */
  const [{ month, year }, setCalendar] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState(
    initialValue
      ? { start: new Date(initialValue), end: new Date(initialValue) }
      : { start: new Date(), end: new Date() }
  );

  /* time state */
  const [selectedTime, setSelectedTime] = useState(
    initialValue ? timeISO(new Date(initialValue)) : "11:31"
  );

  /* popovers */
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const lastEmittedValue = useRef(null);
  /* propagate combined value */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (selectedTime && selectedDates.start) {
      const newValue = new Date(
        `${dateISO(selectedDates.start)} ${selectedTime}`
      );
      const newTimestamp = newValue.getTime();

      // Only call onChange if the value actually changed
      if (lastEmittedValue.current !== newTimestamp) {
        lastEmittedValue.current = newTimestamp;
        onChange(newTimestamp); // Send timestamp instead of Date object for better consistency
      }
    }
  }, [selectedDates, selectedTime, onChange]);

  /* handlers */
  const handleDateSelect = useCallback((value) => {
    setSelectedDates(value);
    setDateOpen(false);
  }, []);

  const handleTimeSelect = useCallback((timeValue) => {
    setSelectedTime(timeValue);
    setTimeOpen(false);
  }, []);

  const handleMonthChange = useCallback(
    (month, year) => setCalendar({ month, year }),
    []
  );

  /* activators */
  const dateActivator = (
    <TextField
      label={dateLabel}
      value={dateISO(selectedDates.start)}
      readOnly
      prefix={<Icon source={CalendarIcon} />}
      onFocus={() => setDateOpen(true)}
      autoComplete="off"
    />
  );

  // Convert 24-hour time to 12-hour format for display
  const getDisplayTime = (time24) => {
    if (!time24) return "";
    const timeObj = timeList.find(t => t.value === time24);
    return timeObj ? timeObj.display : time24;
  };

  const timeActivator = (
    <TextField
      label={timeLabel}
      value={getDisplayTime(selectedTime)}
      readOnly
      prefix={<Icon source={ClockIcon} />}
      onFocus={() => setTimeOpen(true)}
      autoComplete="off"
    />
  );

  /* time list for ActionList */
  const timeActions = timeList.map((time) => ({
    content: time.display,
    onAction: () => handleTimeSelect(time.value),
  }));

  return (
    <InlineStack gap="200" align="space-between" direction={"row"} wrap={false}>
      {" "}
      {/* horizontal layout */}
      {/* --- Date popover --- */}
      <Popover
        active={dateOpen}
        preferredPosition="above"
        activator={dateActivator}
        onClose={() => setDateOpen(false)}
      >
        <div style={{ padding: 16 }}>
          <DatePicker
            month={month}
            year={year}
            onChange={handleDateSelect}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
          />
        </div>
      </Popover>
      {/* --- Time popover --- */}
      <Popover
        active={timeOpen}
        preferredPosition="above"
        activator={timeActivator}
        onClose={() => setTimeOpen(false)}
      >
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          padding: '4px 0'
        }}>
          <ActionList items={timeActions} />
        </div>
      </Popover>
    </InlineStack>
  );
}
