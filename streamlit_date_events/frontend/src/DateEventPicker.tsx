import React, { useEffect, useState, useRef, useMemo } from "react"
import {
  Streamlit,
  withStreamlitConnection,
} from "streamlit-component-lib"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"

//Ikoner
import { ArrowBigLeft, ArrowBigRight, ChevronDown } from "lucide-react"


interface EventType {
  dates: string[]
  color: string
  label: string
}


//Hent af theme fra streamlit
interface StreamlitTheme {
  base: "light" | "dark"
  primaryColor: string
  backgroundColor: string
  secondaryBackgroundColor: string
  textColor: string
  font: string
}


interface EventTypes {
  [key: string]: EventType
}

interface DayInfo {
  date: string
  events: { color: string; label: string }[]
}

const DateEventPicker: React.FC<ComponentProps> = (props) => {
  const args = props.args ?? {}

  useEffect(() => {
    Streamlit.setComponentReady()
  }, [])

  const [selectedDate, setSelectedDate] = useState<string>(args.defaultValue || "")
  const [currentMonth, setCurrentMonth] = useState<Date>(
    args.defaultValue ? new Date(args.defaultValue) : new Date()
  )
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const mode = args.mode || "inline"
  const theme = props.theme as StreamlitTheme | undefined
  const showLegend = args.showLegend !== false
  const eventTypes: EventTypes = useMemo(() => args.eventTypes || {}, [args.eventTypes])

  const colors = {
    primary: theme?.primaryColor ?? "#ff4b4b",
    bg: theme?.backgroundColor ?? "#ffffff",
    bgSecondary: theme?.secondaryBackgroundColor ?? "#f6f8fa",
    text: theme?.textColor ?? "#31333f",
    muted: theme?.base === "dark" ? "#9aa0a6" : "#838c97",
    border: theme?.base === "dark" ? "#3a3a3a" : "#e2e8f0",
  }

  const monthButtonStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: colors.text,
    border: `1px solid ${colors.border}`,
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  }

  useEffect(() => {
    if (mode === "inline") {
      const legendHeight = showLegend && Object.keys(eventTypes).length > 0 ? 80 : 0
      Streamlit.setFrameHeight(380 + legendHeight)
    } else {
      Streamlit.setFrameHeight(isOpen ? 500 : 80)
    }
  }, [isOpen, mode, showLegend, eventTypes])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (mode === "dropdown" && isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, mode])

  const handleDateClick = (date: string) => {
    const clickedDate = new Date(date)

    if (args.minDate && clickedDate < new Date(args.minDate)) return
    if (args.maxDate && clickedDate > new Date(args.maxDate)) return

    setSelectedDate(date)
    setCurrentMonth(new Date(date))
    Streamlit.setComponentValue(date)

    if (mode === "dropdown") {
      setIsOpen(false)
    }
  }

  const getEventsForDate = (dateStr: string): { color: string; label: string }[] => {
    const eventTypes: EventTypes = args.eventTypes || {}
    const events: { color: string; label: string }[] = []

    Object.keys(eventTypes).forEach((key) => {
      const eventType = eventTypes[key]
      if (eventType.dates && eventType.dates.includes(dateStr)) {
        events.push({
          color: eventType.color,
          label: eventType.label
        })
      }
    })

    return events
  }

  const getDaysInMonth = (date: Date): DayInfo[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: DayInfo[] = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: "", events: [] })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      days.push({
        date: dateStr,
        events: getEventsForDate(dateStr),
      })
    }

    return days
  }

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + offset)
    setCurrentMonth(newMonth)
  }

  const isDateDisabled = (dateStr: string): boolean => {
    if (!dateStr) return true
    const date = new Date(dateStr)
    if (args.minDate && date < new Date(args.minDate)) return true
    if (args.maxDate && date > new Date(args.maxDate)) return true
    return false
  }

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return "Select a date"
    const date = new Date(dateStr)
    const day = date.getDate()
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const days = getDaysInMonth(currentMonth)
  const label = args.label || "Select a date"
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const CalendarContent = () => (
    <div style={{
      border: `1px solid ${colors.border}`,
      borderRadius: "8px",
      padding: "12px",
      backgroundColor: colors.bg,
      width: "100%",
    }}>
      {/* Legend */}
      {showLegend && Object.keys(eventTypes).length > 0 && (
        <div style={{
          marginBottom: "12px",
          padding: "10px",
          backgroundColor: colors.bgSecondary,
          borderRadius: "6px",
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            fontSize: "11px",
            fontWeight: 600,
            color: colors.muted,
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Events
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "8px"
          }}>
            {Object.keys(eventTypes).map((key) => {
              const eventType = eventTypes[key]
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px"
                  }}
                >
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: eventType.color,
                    display: "inline-block",
                    flexShrink: 0
                  }} />
                  <span style={{
                    color: colors.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {eventType.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Month Navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px"
      }}>
        <button
          onClick={() => changeMonth(-1)}
          style={monthButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgSecondary
            e.currentTarget.style.borderColor = colors.muted
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent"
            e.currentTarget.style.borderColor = colors.border
          }}
        >
          <ArrowBigLeft size={18} />
        </button>
        <div style={{
          fontSize: "14px",
          fontWeight: 600,
          color: colors.text,
          letterSpacing: "0.3px"
        }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          onClick={() => changeMonth(1)}
          style={monthButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgSecondary
            e.currentTarget.style.borderColor = colors.muted
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent"
            e.currentTarget.style.borderColor = colors.border
          }}
        >
          <ArrowBigRight size={18} />
        </button>
      </div>

      {/* Day Headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
        marginBottom: "8px"
      }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 600,
              color: colors.muted,
              padding: "8px 0",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px"
      }}>
        {days.map((day, index) => {
          const isSelected = day.date === selectedDate
          const isDisabled = isDateDisabled(day.date)
          const isHovered = day.date === hoveredDate
          const isToday = day.date === new Date().toISOString().split('T')[0]

          return (
            <div key={index} style={{ position: "relative" }}>
              <button
                onClick={() => day.date && handleDateClick(day.date)}
                onMouseEnter={() => day.date && setHoveredDate(day.date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!day.date || isDisabled}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  border: isToday && !isSelected ? `2px solid ${colors.primary}` : "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: day.date && !isDisabled ? "pointer" : "default",
                  backgroundColor: isSelected
                    ? colors.primary
                    : isHovered && !isDisabled
                      ? colors.bgSecondary
                      : "transparent",
                  color: isSelected
                    ? "white"
                    : isDisabled
                      ? colors.muted
                      : colors.text,
                  fontWeight: isSelected || isToday ? 600 : 400,
                  transition: "all 0.2s ease",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: day.events.length > 0 ? "6px" : "0",
                  opacity: isDisabled ? 0.4 : 1
                }}
              >
                {day.date ? new Date(day.date).getDate() : ""}

                {/* Event Markers */}
                {day.events.length > 0 && (
                  <div style={{
                    position: "absolute",
                    bottom: "4px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "3px",
                    justifyContent: "center"
                  }}>
                    {day.events.slice(0, 3).map((event, i) => (
                      <span
                        key={i}
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: isSelected ? "rgba(255,255,255,0.9)" : event.color,
                          display: "inline-block"
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>

              {/* Tooltip on hover */}
              {isHovered && day.events.length > 0 && (
                <div style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: theme?.base === "dark" ? "#1e1e1e" : "#2d2d2d",
                  color: "white",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  zIndex: 1000,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  pointerEvents: "none"
                }}>
                  {day.events.map((event, i) => (
                    <div key={i} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "6px",
                      marginBottom: i < day.events.length - 1 ? "4px" : "0"
                    }}>
                      <span style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: event.color,
                        display: "inline-block"
                      }} />
                      {event.label}
                    </div>
                  ))}
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: theme?.base === "dark" ? "5px solid #1e1e1e" : "5px solid #2d2d2d"
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  if (mode === "dropdown") {
    return (
      <div ref={dropdownRef} style={{ 
        fontFamily: theme?.font || '"Source Sans Pro", sans-serif', 
        padding: "0", 
        position: "relative",
        width: "100%",
        maxWidth: "300px",
        zIndex: 9999,
        isolation: "isolate"
      }}>
        <label style={{
          display: "block",
          fontSize: "14px",
          fontWeight: 400,
          marginBottom: "6px",
          color: colors.text
        }}>
          {label}
        </label>

        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
          width: "100%",
          padding: "10px 14px",
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          fontSize: "14px",
          color: colors.text,
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.muted
            e.currentTarget.style.backgroundColor = colors.bgSecondary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.border
            e.currentTarget.style.backgroundColor = colors.bg
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <span>📅</span>
            <span>{formatDisplayDate(selectedDate)}</span>
            {selectedEvents.length > 0 && (
              <div style={{ display: "flex", gap: "4px", marginLeft: "auto", marginRight: "8px" }}>
                {selectedEvents.slice(0, 3).map((event, i) => (
                  <span
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: event.color,
                      display: "inline-block"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <span style={{
            fontSize: "10px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            color: colors.muted
          }}>
            <ChevronDown size={16} />
          </span>
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            zIndex: 1001,
            backgroundColor: colors.bg,
            borderRadius: "8px",
            boxShadow: theme?.base === "dark" 
              ? "0 10px 25px rgba(0, 0, 0, 0.5)" 
              : "0 10px 25px rgba(0, 0, 0, 0.1)"
          }}>
            <CalendarContent />
          </div>
        )}
      </div>
    )
  }

  // Inline mode
  return (
    <div style={{ 
      fontFamily: theme?.font || '"Source Sans Pro", sans-serif', 
      padding: "0",
      width: "100%",
      maxWidth: "300px"
    }}>
      <label style={{
        display: "block",
        fontSize: "14px",
        fontWeight: 400,
        marginBottom: "8px",
        color: colors.text
      }}>
        {label}
      </label>
      <CalendarContent />
    </div>
  )
}

export default withStreamlitConnection(DateEventPicker)