import streamlit as st
from streamlit_date_events import date_input_with_events
from datetime import date, timedelta

st.set_page_config(
    page_title="Streamlit Date Events - Live Demo",
    page_icon="📅",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Header
st.title("📅 Streamlit Date Events - Interactive Demo")
st.markdown("""
An advanced date picker component for Streamlit with event markers, multiple event types, and flexible display modes.

[![PyPI](https://img.shields.io/pypi/v/streamlit-date-events)](https://pypi.org/project/streamlit-date-events/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/yourusername/streamlit-date-events)
""")

st.divider()

# Sidebar configuration
with st.sidebar:
    st.header("⚙️ Configuration")
    
    display_mode = st.radio(
        "Display Mode",
        ["inline", "dropdown"],
        help="Inline: Always visible | Dropdown: Click to open"
    )
    
    show_legend = st.checkbox("Show Legend", value=True)
    
    st.divider()
    
    st.subheader("🎨 Customize Event Colors")
    meeting_color = st.color_picker("Meetings", "#FF4B4B")
    deadline_color = st.color_picker("Deadlines", "#FFA500")
    holiday_color = st.color_picker("Holidays", "#00C896")
    reminder_color = st.color_picker("Reminders", "#9D4EDD")
    
    st.divider()
    
    st.markdown("""
    ### 📦 Installation
    ```bash
    pip install streamlit-date-events
    ```
    
    ### 💻 Basic Usage
    ```python
    from streamlit_date_events import date_input_with_events
    
    selected = date_input_with_events(
        label="Pick a date",
        event_types={...},
        mode="dropdown"
    )
    ```
    """)

# Main content
today = date.today()

# Tab navigation
tab1, tab2, tab3, tab4 = st.tabs([
    "🎯 Quick Demo",
    "🎨 Multiple Event Types",
    "📊 Project Timeline",
    "💡 Examples & Code"
])

with tab1:
    st.header("Quick Demo")
    st.markdown("Try both inline and dropdown modes with event markers!")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📅 Simple Event List")
        
        simple_events = [
            today + timedelta(days=2),
            today + timedelta(days=5),
            today + timedelta(days=8),
            today + timedelta(days=12),
            today + timedelta(days=15),
        ]
        
        selected1 = date_input_with_events(
            label="Select a date",
            value=today,
            event_dates=simple_events,
            event_color="#FF4B4B",
            mode=display_mode,
            show_legend=False,
            key="simple"
        )
        
        if selected1:
            st.info(f"**Selected:** {selected1.strftime('%B %d, %Y')}")
            if selected1 in simple_events:
                st.success("✅ This date has an event!")
    
    with col2:
        st.subheader("🎨 Multiple Event Types")
        
        multi_events = {
            'important': {
                'dates': [today + timedelta(days=3), today + timedelta(days=10)],
                'color': '#FF4B4B',
                'label': 'Important'
            },
            'normal': {
                'dates': [today + timedelta(days=6), today + timedelta(days=13)],
                'color': '#3B82F6',
                'label': 'Normal'
            }
        }
        
        selected2 = date_input_with_events(
            label="Hover over dots for details",
            value=today,
            event_types=multi_events,
            mode=display_mode,
            show_legend=show_legend,
            key="multi"
        )
        
        if selected2:
            st.info(f"**Selected:** {selected2.strftime('%B %d, %Y')}")

with tab2:
    st.header("Multiple Event Types Demo")
    st.markdown("See how different event types are visualized with custom colors and labels.")
    
    event_types = {
        'meetings': {
            'dates': [
                today + timedelta(days=1),
                today + timedelta(days=8),
                today + timedelta(days=15),
            ],
            'color': meeting_color,
            'label': 'Team Meetings'
        },
        'deadlines': {
            'dates': [
                today + timedelta(days=4),
                today + timedelta(days=11),
                today + timedelta(days=18),
            ],
            'color': deadline_color,
            'label': 'Project Deadlines'
        },
        'holidays': {
            'dates': [
                today + timedelta(days=7),
                today + timedelta(days=14),
            ],
            'color': holiday_color,
            'label': 'Public Holidays'
        },
        'reminders': {
            'dates': [
                today + timedelta(days=2),
                today + timedelta(days=9),
                today + timedelta(days=16),
            ],
            'color': reminder_color,
            'label': 'Important Reminders'
        }
    }
    
    selected3 = date_input_with_events(
        label="Calendar with Multiple Event Types",
        value=today,
        event_types=event_types,
        show_legend=show_legend,
        mode=display_mode,
        min_date=today - timedelta(days=7),
        max_date=today + timedelta(days=30),
        key="multi_type"
    )
    
    if selected3:
        events_on_date = []
        for event_name, event_config in event_types.items():
            if selected3 in event_config['dates']:
                events_on_date.append(event_config['label'])
        
        col1, col2 = st.columns([1, 2])
        with col1:
            st.metric("Selected Date", selected3.strftime('%B %d'))
        with col2:
            if events_on_date:
                st.success(f"**Events:** {', '.join(events_on_date)}")
            else:
                st.info("No events on this day")

with tab3:
    st.header("Project Timeline Example")
    st.markdown("Visualize project milestones, demos, and deliveries.")
    
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
        label="4-Week Project Timeline",
        value=today,
        event_types=project_timeline,
        show_legend=True,
        mode=display_mode,
        min_date=today,
        max_date=today + timedelta(days=30),
        key="timeline"
    )
    
    if selected4:
        days_from_start = (selected4 - today).days
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Project Day", f"Day {days_from_start + 1}")
        with col2:
            week = (days_from_start // 7) + 1
            st.metric("Week", f"Week {week}")
        with col3:
            remaining = (today + timedelta(days=28) - selected4).days
            st.metric("Days to Delivery", remaining if remaining >= 0 else "Completed")

with tab4:
    st.header("Examples & Code Snippets")
    
    st.subheader("1️⃣ Simple Event List")
    st.code('''
from streamlit_date_events import date_input_with_events
from datetime import date, timedelta

today = date.today()
events = [today + timedelta(days=i) for i in [2, 5, 8, 12]]

selected = date_input_with_events(
    label="Select a date",
    event_dates=events,
    event_color="#FF4B4B",
    mode="dropdown"
)
    ''', language='python')
    
    st.divider()
    
    st.subheader("2️⃣ Multiple Event Types")
    st.code('''
event_types = {
    'meetings': {
        'dates': [date(2024, 1, 15), date(2024, 1, 20)],
        'color': '#FF4B4B',
        'label': 'Team Meetings'
    },
    'deadlines': {
        'dates': [date(2024, 1, 18)],
        'color': '#FFA500',
        'label': 'Project Deadlines'
    }
}

selected = date_input_with_events(
    label="Calendar",
    event_types=event_types,
    show_legend=True,
    mode="inline"
)
    ''', language='python')
    
    st.divider()
    
    st.subheader("3️⃣ Booking System Example")
    st.code('''
booked_dates = [date(2024, 1, 15), date(2024, 1, 20)]

booking_date = date_input_with_events(
    label="Select booking date",
    event_dates=booked_dates,
    event_color="#FF0000",
    mode="dropdown"
)

if booking_date:
    if booking_date in booked_dates:
        st.error("❌ Already booked")
    else:
        st.success(f"✅ {booking_date} is available!")
    ''', language='python')

# Footer
st.divider()
st.markdown("""
### 🎯 Key Features
- ✅ Multiple event types with custom colors
- ✅ Legend showing event types
- ✅ Tooltips on hover
- ✅ Overlapping events (multiple dots)
- ✅ Two display modes: inline & dropdown
- ✅ Min/max date restrictions
- ✅ Streamlit native styling
- ✅ Backward compatible

### 📚 Resources
- [PyPI Package](https://pypi.org/project/streamlit-date-events/)
- [GitHub Repository](https://github.com/yourusername/streamlit-date-events)
- [Documentation](https://github.com/yourusername/streamlit-date-events#readme)
""")