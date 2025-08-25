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
const timeList = each30m("00:00", "23:30");

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
    initialValue ? timeISO(new Date(initialValue)) : ""
  );

  /* popovers */
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  /* propagate combined value */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (selectedTime && selectedDates.start) {
      onChange(new Date(`${dateISO(selectedDates.start)} ${selectedTime}`));
    }
  }, [selectedDates, selectedTime, onChange]);

  /* handlers */
  const handleDateSelect = useCallback((value) => {
    setSelectedDates(value);
    setDateOpen(false);
  }, []);

  const handleTimeSelect = useCallback((time) => {
    setSelectedTime(time);
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

  const timeActivator = (
    <TextField
      label={timeLabel}
      value={selectedTime}
      readOnly
      prefix={<Icon source={ClockIcon} />}
      onFocus={() => setTimeOpen(true)}
      autoComplete="off"
    />
  );

  /* time list for ActionList */
  const timeActions = timeList.map((time) => ({
    content: time,
    onAction: () => handleTimeSelect(time),
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
        <ActionList items={timeActions} />
      </Popover>
    </InlineStack>
  );
}
