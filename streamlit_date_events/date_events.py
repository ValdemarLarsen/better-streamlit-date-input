import os
import streamlit.components.v1 as components
from datetime import date, datetime
from typing import List, Optional, Union, Dict

_RELEASE = True  # Set to True for production

if not _RELEASE:
    _component_func = components.declare_component(
        "date_events",
        url="http://localhost:3000",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("date_events", path=build_dir)


def date_input_with_events(
    label: str = "Select a date",
    value: Optional[Union[date, datetime]] = None,
    event_dates: Optional[List[Union[date, datetime, str]]] = None,
    event_types: Optional[Dict[str, Dict]] = None,
    min_date: Optional[Union[date, datetime]] = None,
    max_date: Optional[Union[date, datetime]] = None,
    event_color: str = "#FF4B4B",
    show_legend: bool = True,
    mode: str = "inline",
    key: Optional[str] = None,
) -> Optional[date]:
    """
    Create a date input component with event markers.
    
    Parameters
    ----------
    label : str
        The label for the date input
    value : date, datetime, or None
        The initial/default value
    event_dates : list of dates, datetimes, or ISO strings (DEPRECATED)
        Simple list of dates with single color (use event_types instead)
    event_types : dict of event type definitions
        Dictionary where keys are event type names and values are dicts with:
        - 'dates': list of dates for this event type
        - 'color': hex color for the marker (e.g., '#FF4B4B')
        - 'label': display name in legend (optional, defaults to key)
        Example:
        {
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
    min_date : date, datetime, or None
        Minimum selectable date
    max_date : date, datetime, or None
        Maximum selectable date
    event_color : str
        Default color for simple event_dates (ignored if event_types is used)
    show_legend : bool
        Whether to show the legend above the calendar
    mode : str
        Display mode: "inline" (always visible) or "dropdown" (click to open)
    key : str or None
        Unique key for the component
        
    Returns
    -------
    date or None
        The selected date, or None if no date is selected
    """
    
    # Convert dates to ISO strings for JavaScript
    def to_iso(d):
        if d is None:
            return None
        if isinstance(d, datetime):
            return d.date().isoformat()
        if isinstance(d, date):
            return d.isoformat()
        return str(d)
    
    default_value = to_iso(value) if value else to_iso(date.today())
    
    # Handle event types
    processed_event_types = {}
    
    if event_types:
        # New advanced mode with multiple event types
        for event_key, event_config in event_types.items():
            dates_list = event_config.get('dates', [])
            processed_event_types[event_key] = {
                'dates': [to_iso(d) for d in dates_list if d is not None],
                'color': event_config.get('color', '#FF4B4B'),
                'label': event_config.get('label', event_key)
            }
    elif event_dates:
        # Backwards compatible simple mode
        processed_event_types['default'] = {
            'dates': [to_iso(d) for d in event_dates if d is not None],
            'color': event_color,
            'label': 'Events'
        }
    
    min_date_iso = to_iso(min_date)
    max_date_iso = to_iso(max_date)
    
    component_value = _component_func(
        label=label,
        defaultValue=default_value,
        eventTypes=processed_event_types,
        minDate=min_date_iso,
        maxDate=max_date_iso,
        showLegend=show_legend,
        mode=mode,
        key=key,
        default=default_value,
    )
    
    # Convert result back to Python date
    if component_value:
        try:
            return datetime.fromisoformat(component_value).date()
        except (ValueError, TypeError):
            return None
    
    return None