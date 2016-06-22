# daily dashboard

# Purpose
The purpose of this application was to save me time and keep me focused during my morning routine.  Like many people, I find myself checking my phone when I wake up in the morning to see my calendar, the weather, and a news summary to get a sense of the day.  Unfortunately, I often find myself getting sidetracked by mindless distractions (Facebook, et cetera).  I designed this dashboard to fetch all the information I needed to start my day while presenting a clean modern look that would blend seamlessly into the background when needed.

## About
This was my individual project, part of the curriculum at Prime Digital Academy.  As part of this assignment I was given two weeks to brainstorm an idea, write a scope of work for it, have it approved, develop the application, and present it to a group of my peers.  As such, it functions mostly as a proof of concept, but can be made deployment ready.

Features:
* Google Calendar events pulled from my personal Google account (in the demo this has been replaced by an example set of data)
* Weather - current day's forecast from Weather Underground along with a basic algorithm that suggests attire for the day (e.g. umbrella for rain, shorts if it is hot, et cetera)
* Real-time transit information pulled from the Minneapolis/St. Paul Nextrip API
* Headlines from the New York Times
* Background pictures pulled dynamically from the NASA Astronomy Picture of the Day API
* User customization options: from the interface, the user can customize their settings, including text color, border color, background (either solid color or a selection from the NASA APOD), location (used for weather and transit information), and bus stops

## Demo
See a demo running at https://daily-dashboard.herokuapp.com/ (The initial load may be slow due to heroku hosting policy)  Since this application is designed to run a self-hosted server on a local network, small changes have been made to mock functionality.

This app is also designed to run on a landscape iPad resolution, so it is best viewed here: http://deviceponsive.com/?url=daily-dashboard.herokuapp.com (scroll down to see the landscape iPad view)
