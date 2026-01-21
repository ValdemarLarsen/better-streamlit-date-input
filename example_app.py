import streamlit as st
from streamlit_date_events import date_input_with_events
from datetime import date, timedelta

st.set_page_config(page_title="Advanced Date Events Demo", page_icon="📅", layout="wide")

st.title("Advanced Streamlit Date Events")
st.markdown("En avanceret date picker med multiple event typer, farver og legend")

# Mode selector
display_mode = st.radio(
    "Display Mode",
    ["inline", "dropdown"],
    horizontal=True,
    help="Inline: Always visible | Dropdown: Click to open"
)

st.divider()

# Sidebar configuration
with st.sidebar:
    st.header("Configuration")
    
    show_legend = st.checkbox("Show Legend", value=True)
    
    st.subheader("Event Type Colors")
    meeting_color = st.color_picker("Meetings", "#FF4B4B")
    deadline_color = st.color_picker("Deadlines", "#FFA500")
    holiday_color = st.color_picker("Holidays", "#00C896")
    reminder_color = st.color_picker("Reminders", "#9D4EDD")

# Generate example dates
today = date.today()

# Example 1: Multiple Event Types
st.header("Multiple Event Types")
st.markdown("Definer forskellige event typer med deres egne farver og labels")

col1, col2 = st.columns([2, 1])

with col1:
    # Create event types
    event_types = {
        'meetings': {
            'dates': [
                today + timedelta(days=2),
                today + timedelta(days=7),
                today + timedelta(days=14),
            ],
            'color': meeting_color,
            'label': 'Team Meetings'
        },
        'deadlines': {
            'dates': [
                today + timedelta(days=5),
                today + timedelta(days=12),
                today + timedelta(days=20),
            ],
            'color': deadline_color,
            'label': 'Project Deadlines'
        },
        'holidays': {
            'dates': [
                today + timedelta(days=10),
                today + timedelta(days=17),
            ],
            'color': holiday_color,
            'label': 'Public Holidays'
        },
        'reminders': {
            'dates': [
                today + timedelta(days=3),
                today + timedelta(days=8),
                today + timedelta(days=15),
            ],
            'color': reminder_color,
            'label': 'Important Reminders'
        }
    }

    selected1 = date_input_with_events(
        label="Select a date to see events",
        value=today,
        event_types=event_types,
        show_legend=show_legend,
        mode=display_mode,
        min_date=today - timedelta(days=7),
        max_date=today + timedelta(days=30),
        key="multi_event"
    )

with col2:
    if selected1:
        st.markdown(f"**Selected:** {selected1.strftime('%d %B %Y')}")
        
        # Show which events are on selected date
        events_on_date = []
        for event_name, event_config in event_types.items():
            if selected1 in event_config['dates']:
                events_on_date.append(event_config['label'])
        
        if events_on_date:
            st.success(f"**Events on this day:**")
            for event in events_on_date:
                st.write(f"• {event}")
        else:
            st.info("No events on this day")

st.divider()

# Example 2: Overlapping Events
st.header("Overlapping Events")
st.markdown("Datoer kan have flere events samtidig - se tooltip ved hover")

overlapping_events = {
    'workshops': {
        'dates': [
            today + timedelta(days=4),
            today + timedelta(days=11),
        ],
        'color': '#3B82F6',
        'label': 'Workshops'
    },
    'reviews': {
        'dates': [
            today + timedelta(days=4),  # Same as workshop
            today + timedelta(days=18),
        ],
        'color': '#EC4899',
        'label': 'Code Reviews'
    },
    'sprints': {
        'dates': [
            today + timedelta(days=4),  # Same day again!
            today + timedelta(days=11),
        ],
        'color': '#10B981',
        'label': 'Sprint Planning'
    }
}

selected2 = date_input_with_events(
    label="Hover over dates with multiple dots",
    value=today,
    event_types=overlapping_events,
    show_legend=True,
    mode=display_mode,
    key="overlapping"
)

if selected2:
    # Count events on selected date
    event_count = sum(
        1 for config in overlapping_events.values() 
        if selected2 in config['dates']
    )
    if event_count > 1:
        st.balloons()
        st.success(f"🎉 Busy day! {event_count} events scheduled!")

st.divider()

# Example 3: Dynamic Event Management
st.header("Dynamic Event Management")
st.markdown("Tilføj og fjern events dynamisk")

col1, col2 = st.columns(2)

# Initialize session state
if 'custom_events' not in st.session_state:
    st.session_state.custom_events = {
        'custom': {
            'dates': [today + timedelta(days=1)],
            'color': '#FF4B4B',
            'label': 'My Events'
        }
    }

with col1:
    st.subheader("Add New Event")
    new_date = st.date_input("Pick a date", value=today, key="new_event_date")
    new_color = st.color_picker("Event color", "#6366F1")
    
    if st.button("➕ Add Event"):
        if new_date not in st.session_state.custom_events['custom']['dates']:
            st.session_state.custom_events['custom']['dates'].append(new_date)
            st.session_state.custom_events['custom']['color'] = new_color
            st.success(f"Added event for {new_date}")
            st.rerun()

with col2:
    st.subheader("Current Events")
    if st.session_state.custom_events['custom']['dates']:
        for evt_date in sorted(st.session_state.custom_events['custom']['dates']):
            col_a, col_b = st.columns([3, 1])
            with col_a:
                st.write(f"📅 {evt_date.strftime('%d %b %Y')}")
            with col_b:
                if st.button("🗑️", key=f"del_{evt_date}"):
                    st.session_state.custom_events['custom']['dates'].remove(evt_date)
                    st.rerun()
    else:
        st.info("No events added yet")

selected3 = date_input_with_events(
    label="Your custom calendar",
    value=today,
    event_types=st.session_state.custom_events,
    show_legend=True,
    mode=display_mode,
    key="dynamic"
)

st.divider()

# Example 4: Real-world Use Case - Project Timeline
st.header("Project Timeline Example")

project_timeline = {
    'kickoff': {
        'dates': [today],
        'color': '#8B5CF6',
        'label': 'Kickoff Meeting'
    },
    'milestones': {
        'dates': [
            today + timedelta(days=7),
            today + timedelta(days=14),
            today + timedelta(days=21),
        ],
        'color': '#F59E0B',
        'label': 'Milestones'
    },
    'demos': {
        'dates': [
            today + timedelta(days=6),
            today + timedelta(days=13),
            today + timedelta(days=20),
        ],
        'color': '#3B82F6',
        'label': 'Client Demos'
    },
    'deliveries': {
        'dates': [
            today + timedelta(days=28),
        ],
        'color': '#EF4444',
        'label': 'Final Delivery'
    }
}

selected4 = date_input_with_events(
    label="Project Timeline (4 weeks)",
    value=today,
    event_types=project_timeline,
    show_legend=True,
    mode=display_mode,
    min_date=today,
    max_date=today + timedelta(days=30),
    key="timeline"
)

if selected4:
    # Show project info for selected date
    days_from_start = (selected4 - today).days
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Day in Project", f"Day {days_from_start + 1}")
    with col2:
        week = (days_from_start // 7) + 1
        st.metric("Week", f"Week {week}")
    with col3:
        remaining = (today + timedelta(days=28) - selected4).days
        st.metric("Days Until Delivery", remaining)

st.divider()

# Example 5: Backward Compatible Simple Mode
st.header("Simple Mode (Backward Compatible)")

simple_dates = [
    today + timedelta(days=i) 
    for i in range(1, 20, 3)
]

selected5 = date_input_with_events(
    label="Simple event list",
    value=today,
    event_dates=simple_dates,  # Old simple way
    event_color="#FF4B4B",
    show_legend=False,
    key="simple"
)

# Footer
st.divider()
st.markdown("""
### Features
- Multiple event types med custom farver
- Legend der viser event types
- Tooltip ved hover over events
- Overlapping events (flere prikker)
- **Dropdown mode** - Klik for at åbne/lukke
- **Inline mode** - Altid synlig
- Dynamisk event management
""")