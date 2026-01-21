# Streamlit Date Events

An enhanced date input component for Streamlit with event markers and multiple display modes.

## Features

- 📅 Calendar-based date picker with Streamlit styling
- 🔴 Event markers (small dots) under specific dates
- 🎨 Multiple event types with custom colors and labels
- 📊 Legend showing event types
- 💡 Tooltips on hover showing event details
- 🎯 Two display modes: inline (always visible) or dropdown (click to open)
- ⚙️ Min/max date restrictions
- 🎨 Customizable event colors
- 🔄 Backward compatible with simple event lists

## Installation

```bash
pip install streamlit-date-events
```

## Quick Start

### Simple Mode (Single Event Type)

```python
import streamlit as st
from streamlit_date_events import date_input_with_events
from datetime import date, timedelta

# Define some event dates
today = date.today()
events = [
    today,
    today + timedelta(days=3),
    today + timedelta(days=7),
    today + timedelta(days=14),
]

# Use the component
selected_date = date_input_with_events(
    label="Select a date",
    value=today,
    event_dates=events,
    event_color="#FF4B4B",  # Streamlit red
)

if selected_date:
    st.write(f"You selected: {selected_date}")
    if selected_date in events:
        st.success("This date has an event! 🎉")
```

### Advanced Mode (Multiple Event Types)

```python
import streamlit as st
from streamlit_date_events import date_input_with_events
from datetime import date, timedelta

today = date.today()

# Define multiple event types
event_types = {
    'meetings': {
        'dates': [today + timedelta(days=2), today + timedelta(days=7)],
        'color': '#FF4B4B',
        'label': 'Team Meetings'
    },
    'deadlines': {
        'dates': [today + timedelta(days=5), today + timedelta(days=12)],
        'color': '#FFA500',
        'label': 'Project Deadlines'
    },
    'holidays': {
        'dates': [today + timedelta(days=10)],
        'color': '#00C896',
        'label': 'Public Holidays'
    }
}

selected_date = date_input_with_events(
    label="Select a date",
    value=today,
    event_types=event_types,
    show_legend=True,
    mode="dropdown",  # or "inline"
)

if selected_date:
    st.write(f"Selected: {selected_date}")
```

## Display Modes

### Inline Mode (Default)
Calendar is always visible - best for single-purpose pages.

```python
selected = date_input_with_events(
    label="Pick a date",
    mode="inline"
)
```

### Dropdown Mode
Calendar opens on click - saves space on the page.

```python
selected = date_input_with_events(
    label="Pick a date",
    mode="dropdown"
)
```

## Parameters

### `date_input_with_events()`

- **label** (str): Label text for the component
- **value** (date/datetime): Default selected date
- **event_dates** (list): Simple list of dates with events (backward compatible)
- **event_types** (dict): Advanced event configuration with multiple types:
  ```python
  {
      'event_key': {
          'dates': [list of dates],
          'color': '#HEX_COLOR',
          'label': 'Display Name'
      }
  }
  ```
- **min_date** (date/datetime): Minimum selectable date
- **max_date** (date/datetime): Maximum selectable date
- **event_color** (str): Default color for simple event_dates mode
- **show_legend** (bool): Whether to show the legend (default: True)
- **mode** (str): Display mode - "inline" or "dropdown" (default: "inline")
- **key** (str): Unique key for the component

## Examples

### Booking System

```python
import streamlit as st
from streamlit_date_events import date_input_with_events
from datetime import date

# Booked dates
booked_dates = [
    date(2024, 1, 15),
    date(2024, 1, 20),
    date(2024, 1, 25),
]

booking_date = date_input_with_events(
    label="Select booking date",
    value=date.today(),
    event_dates=booked_dates,
    event_color="#FF0000",
    mode="dropdown",
)

if booking_date:
    if booking_date in booked_dates:
        st.error("❌ This date is already booked")
    else:
        st.success(f"✅ {booking_date} is available!")
```

### Project Timeline

```python
project_timeline = {
    'milestones': {
        'dates': [date(2024, 1, 7), date(2024, 1, 14), date(2024, 1, 21)],
        'color': '#F59E0B',
        'label': 'Milestones'
    },
    'demos': {
        'dates': [date(2024, 1, 6), date(2024, 1, 13), date(2024, 1, 20)],
        'color': '#3B82F6',
        'label': 'Client Demos'
    },
    'deliveries': {
        'dates': [date(2024, 1, 28)],
        'color': '#EF4444',
        'label': 'Final Delivery'
    }
}

selected = date_input_with_events(
    label="Project Timeline",
    event_types=project_timeline,
    show_legend=True,
)
```

### Overlapping Events

Dates can have multiple events - they'll show as multiple colored dots with a tooltip on hover.

```python
overlapping = {
    'type1': {
        'dates': [date(2024, 1, 15)],  # Same date
        'color': '#FF4B4B',
        'label': 'Event Type 1'
    },
    'type2': {
        'dates': [date(2024, 1, 15)],  # Same date
        'color': '#00C896',
        'label': 'Event Type 2'
    }
}

selected = date_input_with_events(
    label="Hover to see multiple events",
    event_types=overlapping,
)
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/streamlit-date-events.git
cd streamlit-date-events

# Install frontend dependencies
cd streamlit_date_events/frontend
npm install

# Install package in development mode
cd ../..
pip install -e .
```

### Run Development Server

```bash
# Terminal 1: Run frontend
cd streamlit_date_events/frontend
npm start  # Runs on http://localhost:3000

# Terminal 2: Run Streamlit app
# Set _RELEASE = False in date_events.py first
streamlit run example_app.py
```

### Build for Production

```bash
# Build frontend
cd streamlit_date_events/frontend
npm run build

# Set _RELEASE = True in date_events.py

# Build package
cd ../..
python -m build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/valdemarlarsen/better-streamlit-date-input/issues) on GitHub.