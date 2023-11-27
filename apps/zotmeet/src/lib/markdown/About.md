# Introduction

_ZotMeet_ is a scheduling web application for UC Irvine members intended to streamline the process of scheduling events for individuals as well as groups. Students can easily plan events with group partners, indicate availability for club events, view available study rooms, and schedule hangouts for friend groups. For UCI members who want an easy way to navigate the complexity of aligning multiple peoples’ schedules, _ZotMeet_ is the perfect solution.

## Executive Summary

_ZotMeet_ is an efficient and powerful event-scheduling tool for for UCI members. It is designed to help them keep track of when, where, and how they're going to meet. _ZotMeet_ combines ease of use and a visually appealing User Interface with UCI-specific features such as library/study room availability and AntAlmanac integration, making it the best scheduling app for UCI members.

Users can create groups and invite others to them. Attendees can add their availability manually or import their availability from Google Calendar and AntAlmanac, allowing users to quickly communicate schedule conflicts. Additionally, organizers can mark an event as a "Study Room" event, limiting the number of attendees and indicate preferred study room locations.

Users will have the option to use _ZotMeet_ as a guest or a signed-in user with an email-password or Google account, where the functionality of the latter will be more extensive. Guests will be able to create standalone meetings and indicate availability for those meetings, but only signed-in users create or join groups. Signed-in users can access a listing of upcoming meetings across devices whereas guests can only access upcoming meetings via its link.

_ZotMeet_ will the quality of life drastically for UCI students who want anything from a effective scheduling solution to those who need to coordinate meetings for class projects, friend groups, or club events. The user experience will be responsive and efficient while not compromise on features to make a reliable as well as powerful scheduling tool for all UCI members.

## Definitions

| Term                           | Definition                                                                                                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Object Relational Mapper (ORM) | Software that translates data representation between a database and a program.                                                                                                                                      |
| ALP                            | Anteater Learning Pavilion, a teaching and meeting location with rooms available for reservation on [OIT's website](https://scheduler.oit.uci.edu/reserve/Antcaves).                                                |
| CSL                            | Courtyard Study Lounge, an area with study areas and meeting rooms available for reservation on [its website](https://studentcenter.uci.edu/learn-and-enjoy/study/book-a-study-room-online/).                       |
| OIT                            | Office of Information Technology, office responsible for UCI's IT needs including technical support and software development. It manages UCI's IT infrastructure, including library and ALP bookings (but not CSL). |
| Study Room                     | A room available for reservation in a library, the ALP, or the CSL.                                                                                                                                                 |

# General Description

## Product Perspective

_ZotMeet_ shall be used by UCI students and faculty to plan group meetings and events. It will be a more appealing alternative to existing meeting schedulers, namely LettuceMeet and When2Meet because of its efficient user interface, visually pleasing design, and UCI-specific features.

When2Meet has a simple but visually-unappealing interface. It is relatively easy to use, but it is not friendly for a new user. Most importantly, it poorly accommodates mobile devices, a use case that many students will need. _ZotMeet_ shall be more visually-appealing and friendly and prioritize mobile usability.

LettuceMeet has a visually-appealing user interface, but it is inefficient. It requires multiple screens of selections with sparsely-distributed and a wide array of options with no indication of necessity. It is surprisingly unintuitive and inefficient. _ZotMeet_ shall be clear and intuitive as well as efficient to use.

_ZotMeet_ shall also incorporate UCI-specific features such as AntAlmanac integration and study room availability information, a feature that does not exist in any known scheduling app. This is the feature that shall draw users to use _ZotMeet_ instead of general competitors.

## General Constraints

- _ZotMeet_ shall operate on modern web browsers including Chrome, Safari, and Firefox.
- _ZotMeet_ shall be displayed on viewport sizes including desktop/laptop, phone, and tablet.

## Scope

- _ZotMeet_ shall enable users to schedule meetings with each other by communicating availability through a calendar and displaying study room availabilities.
- _ZotMeet_ shall allow users to sign in with a Google account or email/password combination.
- _ZotMeet_ shall allow users to create and manage groups with multiple or repeated meetings.
- _ZotMeet_ shall not interface directly with UCI services on behalf of students.
  - E.g., book study rooms.

## User Characteristics

TBA

# Functional Requirements

## Accounts

- Users shall be able to sign in with their Google account.
- The user’s profile picture shall default to their Google profile picture, if available.
- Users shall be able to sign in with a Username/Password.
- The user shall be asked for their preferred name after signup.
- The user shall be able to change their name.
- The user shall be able to change their profile picture at any time (overriding their Google profile picture).
- The user shall be able to log out.

## Groups

- Users shall be able to form groups. Groups represent users that have regular meetings together.
- Users shall be able to form multiple groups.
- Users shall be able to leave groups they’re in.
- All users of a group shall be able to add or remove users.
  - To be discussed. Maybe admin can lock down?
- Users shall be able to view a list of their active groups.
- All users of a group shall be able to set its name.
  - To be discussed. Maybe admin can lock down?
- All users of a group shall be able to archive a group.
  - To be discussed. Maybe only admin?
- All users of a group shall be able to unarchive a group.
  - To be discussed. Maybe only admin?
- Users shall be able to view a list of their archived groups

## Meetings

- Users shall be able to create a new meeting.
- As user shall be able to associate a meeting with a group.
- Users shall be able to view a list of their future meetings.
- Users shall be able to view a list of their past meetings.
- Guests shall be able to fill out availability for non-group meetings.
- The user shall be able to change a meeting's name.
- The user shall be able to change a meeting's date and time.
  - Maybe only creator can do this?
- Meetings shall have a scheduled action that fixes the finalized meeting time.

## Library Activity / Study Rooms

- Users shall be able to view available study rooms all in one page
  - Langson Library, Science Library, Anteater Learning Pavilion
- Users shall be able to view the locations and times they have booked
- Users shall be able to filter available rooms by location and capacity.
- Users shall be able to see a map of the inside of the building in order to locate the room.

# Non-Functional Requirements

## Technology

- _ZotMeet_ shall be a web application.
- _ZotMeet_ shall be built using Svelte and SvelteKit.
- _ZotMeet_ shall use Prisma as the ORM.
- _ZotMeet_ shall use Lucia as the auth library.

## Design

- _ZotMeet_ shall responsively adapt to different viewport sizes.
- _ZotMeet_ shall be visually appealing.
- _ZotMeet_ shall be intuitive to use.
- _ZotMeet_'s UI shall be have contrast ratios that meet WCAG AA standards.
