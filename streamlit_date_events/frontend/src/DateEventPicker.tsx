import React, { useEffect, useState, useRef } from "react"
import {
  Streamlit,
  withStreamlitConnection,
} from "streamlit-component-lib"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"

interface EventType {
  dates: string[]
  color: string
  label: string
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

  useEffect(() => {
    if (mode === "inline") {
      Streamlit.setFrameHeight(500)
    } else {
      Streamlit.setFrameHeight(isOpen ? 520 : 80)
    }
  }, [isOpen, mode])

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
  const showLegend = args.showLegend !== false
  const eventTypes: EventTypes = args.eventTypes || {}
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const CalendarContent = () => (
    <>
      {/* Legend */}
      {showLegend && Object.keys(eventTypes).length > 0 && (
        <div style={{
          marginBottom: "0.75rem",
          padding: "0.75rem",
          backgroundColor: "rgb(246, 248, 250)",
          borderRadius: "0.375rem",
          border: "1px solid rgb(226, 232, 240)"
        }}>
          <div style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "rgb(49, 51, 63)",
            marginBottom: "0.5rem"
          }}>
            Event Types
          </div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}>
            {Object.keys(eventTypes).map((key) => {
              const eventType = eventTypes[key]
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem"
                  }}
                >
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: eventType.color,
                    display: "inline-block"
                  }} />
                  <span style={{
                    fontSize: "12px",
                    color: "rgb(49, 51, 63)"
                  }}>
                    {eventType.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      <div style={{
        border: "1px solid rgb(226, 232, 240)",
        borderRadius: "0.5rem",
        padding: "1rem",
        backgroundColor: "white",
        width: "280px",
        position: "relative"
      }}>
        {/* Month Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem"
        }}>
          <button
            onClick={() => changeMonth(-1)}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
              color: "rgb(49, 51, 63)"
            }}
          >
            ‹
          </button>
          <div style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "rgb(49, 51, 63)"
          }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button
            onClick={() => changeMonth(1)}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
              color: "rgb(49, 51, 63)"
            }}
          >
            ›
          </button>
        </div>

        {/* Day Headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.25rem",
          marginBottom: "0.5rem"
        }}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 600,
                color: "rgb(131, 140, 151)",
                padding: "0.25rem"
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
          gap: "0.25rem"
        }}>
          {days.map((day, index) => {
            const isSelected = day.date === selectedDate
            const isDisabled = isDateDisabled(day.date)
            const isHovered = day.date === hoveredDate
            
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
                    border: "none",
                    borderRadius: "0.25rem",
                    fontSize: "13px",
                    cursor: day.date && !isDisabled ? "pointer" : "default",
                    backgroundColor: isSelected
                      ? "rgb(255, 75, 75)"
                      : isHovered && !isDisabled
                      ? "rgb(246, 248, 250)"
                      : "transparent",
                    color: isSelected
                      ? "white"
                      : isDisabled
                      ? "rgb(226, 232, 240)"
                      : "rgb(49, 51, 63)",
                    fontWeight: isSelected ? 600 : 400,
                    transition: "all 0.15s ease",
                    position: "relative",
                    paddingBottom: day.events.length > 0 ? "8px" : "0"
                  }}
                >
                  {day.date ? new Date(day.date).getDate() : ""}
                  
                  {/* Event Markers */}
                  {day.events.length > 0 && (
                    <div style={{
                      position: "absolute",
                      bottom: "2px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "2px",
                      justifyContent: "center"
                    }}>
                      {day.events.slice(0, 3).map((event, i) => (
                        <span
                          key={i}
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            backgroundColor: isSelected ? "white" : event.color,
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
                    bottom: "calc(100% + 4px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgb(49, 51, 63)",
                    color: "white",
                    padding: "0.375rem 0.5rem",
                    borderRadius: "0.25rem",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    pointerEvents: "none"
                  }}>
                    {day.events.map((event, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
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
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: "4px solid rgb(49, 51, 63)"
                    }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )

  if (mode === "dropdown") {
    return (
      <div ref={dropdownRef} style={{ fontFamily: '"Source Sans Pro", sans-serif', padding: "0", position: "relative" }}>
        <label style={{
          display: "block",
          fontSize: "14px",
          fontWeight: 400,
          marginBottom: "0.25rem",
          color: "rgb(49, 51, 63)"
        }}>
          {label}
        </label>
        
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "280px",
            padding: "0.5rem 0.75rem",
            backgroundColor: "white",
            border: "1px solid rgb(226, 232, 240)",
            borderRadius: "0.5rem",
            fontSize: "14px",
            color: "rgb(49, 51, 63)",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgb(200, 208, 218)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgb(226, 232, 240)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
            <span>📅</span>
            <span>{formatDisplayDate(selectedDate)}</span>
            {selectedEvents.length > 0 && (
              <div style={{ display: "flex", gap: "3px", marginLeft: "auto" }}>
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
            fontSize: "12px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease"
          }}>
            ▼
          </span>
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            left: 0,
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid rgb(226, 232, 240)",
            borderRadius: "0.5rem",
            padding: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}>
            <CalendarContent />
          </div>
        )}
      </div>
    )
  }

  // Inline mode
  return (
    <div style={{ fontFamily: '"Source Sans Pro", sans-serif', padding: "0" }}>
      <label style={{
        display: "block",
        fontSize: "14px",
        fontWeight: 400,
        marginBottom: "0.5rem",
        color: "rgb(49, 51, 63)"
      }}>
        {label}
      </label>
      <CalendarContent />
    </div>
  )
}

export default withStreamlitConnection(DateEventPicker)