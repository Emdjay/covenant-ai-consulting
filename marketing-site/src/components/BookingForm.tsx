"use client";

import { useState, useCallback, useMemo } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const TEAM_SIZES = [
  "Just me (solo founder)",
  "2-5 people",
  "6-15 people",
  "16-50 people",
  "50+",
] as const;

function generateTimeSlots(): { date: string; display: string; slots: string[] }[] {
  const days: { date: string; display: string; slots: string[] }[] = [];
  const now = new Date();

  for (let d = 1; d <= 14; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);

    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dateStr = date.toISOString().split("T")[0];
    const display = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    days.push({
      date: dateStr,
      display,
      slots: [
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM",
      ],
    });
  }

  return days;
}

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    teamSize: "",
    painPoint: "",
  });

  const days = useMemo(() => generateTimeSlots(), []);

  const selectedDay = days.find((d) => d.date === selectedDate);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-gold/20 bg-white p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          <svg className="h-7 w-7 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="mt-6 font-heading text-2xl font-bold text-navy">
          You&apos;re booked!
        </h2>
        <p className="mt-3 text-navy/60">
          We&apos;ll send a confirmation to <strong>{formData.email}</strong> with
          the call details for{" "}
          <strong>
            {days.find((d) => d.date === selectedDate)?.display} at {selectedTime}
          </strong>
          .
        </p>
        <p className="mt-6 text-sm text-navy/40">
          Check your inbox (and spam folder, just in case).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Info */}
      <div>
        <h2 className="font-heading text-xl font-bold text-navy">
          Your Details
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-navy/70">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-white px-4 py-3 text-navy placeholder:text-navy/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Michael Jones"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy/70">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-white px-4 py-3 text-navy placeholder:text-navy/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="business" className="block text-sm font-medium text-navy/70">
              Business Name *
            </label>
            <input
              id="business"
              name="business"
              type="text"
              required
              value={formData.business}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-white px-4 py-3 text-navy placeholder:text-navy/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium text-navy/70">
              Team Size *
            </label>
            <select
              id="teamSize"
              name="teamSize"
              required
              value={formData.teamSize}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-white px-4 py-3 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="">Select...</option>
              {TEAM_SIZES.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="painPoint" className="block text-sm font-medium text-navy/70">
            What&apos;s your biggest operational pain point? *
          </label>
          <textarea
            id="painPoint"
            name="painPoint"
            required
            rows={3}
            value={formData.painPoint}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-navy/10 bg-white px-4 py-3 text-navy placeholder:text-navy/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            placeholder="e.g., We spend hours every week copying data between our CRM and spreadsheets..."
          />
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <h2 className="font-heading text-xl font-bold text-navy">
          Pick a Date
        </h2>
        <p className="mt-1 text-sm text-navy/50">
          All times are in Eastern Time (ET)
        </p>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day.date}
              type="button"
              onClick={() => {
                setSelectedDate(day.date);
                setSelectedTime("");
              }}
              className={`flex-shrink-0 rounded-lg border px-4 py-3 text-center text-sm font-medium transition-all ${
                selectedDate === day.date
                  ? "border-gold bg-gold/10 text-navy"
                  : "border-navy/10 bg-white text-navy/60 hover:border-navy/20"
              }`}
            >
              {day.display}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDay && (
        <div>
          <h2 className="font-heading text-xl font-bold text-navy">
            Pick a Time
          </h2>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {selectedDay.slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  selectedTime === slot
                    ? "border-gold bg-gold/10 text-navy"
                    : "border-navy/10 bg-white text-navy/60 hover:border-navy/20"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!selectedDate || !selectedTime || status === "submitting"}
        className="w-full rounded-lg bg-navy px-8 py-4 font-semibold text-cream transition-all hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Booking..." : "Confirm Discovery Call"}
      </button>

      <p className="text-center text-xs text-navy/30">
        Free. No obligation. We&apos;ll confirm within 2 hours.
      </p>
    </form>
  );
}
