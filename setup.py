from setuptools import setup, find_packages
from pathlib import Path

this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding='utf-8')

setup(
    name="streamlit-date-events",
    version="0.1.3",
    author="Valdemar",
    author_email="valdemarlarsen0608@gmail.com",
    description="A Streamlit date input component with event markers",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/valdemarlarsen/better-streamlit-date-input",
    packages=find_packages(),
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
    install_requires=[
        "streamlit>=1.0.0",
    ],
    package_data={
        "streamlit_date_events": ["frontend/build/*", "frontend/build/**/*"],
    },
)