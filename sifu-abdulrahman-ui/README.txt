# Sifu - UTM Study Planner Frontend

This folder contains Abdulrahman's frontend pages for the **User Management** and **Academic Tracking** subsystems.

## Module to Frontend Script Mapping

<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="border: 1px solid #999; padding: 8px;">Module</th>
    <th style="border: 1px solid #999; padding: 8px;">Frontend Script</th>
  </tr>
  <tr>
    <td style="border: 1px solid #999; padding: 8px;"><strong>Welcome / Splash Page</strong></td>
    <td style="border: 1px solid #999; padding: 8px;"><a href="index.html">index.html</a></td>
  </tr>
  <tr>
    <td style="border: 1px solid #999; padding: 8px;"><strong>User Registration & Login Module</strong></td>
    <td style="border: 1px solid #999; padding: 8px;">
      <a href="login.html">login.html</a><br>
      <a href="signup.html">signup.html</a><br>
      <a href="profile.html">profile.html</a>
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid #999; padding: 8px;"><strong>Course Management Module</strong></td>
    <td style="border: 1px solid #999; padding: 8px;"><a href="courses.html">courses.html</a></td>
  </tr>
  <tr>
    <td style="border: 1px solid #999; padding: 8px;"><strong>Academic Task & Calendar Module</strong></td>
    <td style="border: 1px solid #999; padding: 8px;">
      <a href="tasks.html">tasks.html</a><br>
      <a href="calendar.html">calendar.html</a><br>
      <a href="schedule.html">schedule.html</a>
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid #999; padding: 8px;"><strong>Shared Frontend Files</strong></td>
    <td style="border: 1px solid #999; padding: 8px;">
      <a href="css/style.css">css/style.css</a><br>
      <a href="js/app.js">js/app.js</a>
    </td>
  </tr>
</table>

## Functional Pages

- `index.html` links to signup and login.
- `login.html` validates UTM email, validates password, shows/hides password, and opens the profile page after success.
- `signup.html` validates required fields, checks matching passwords, saves demo profile data, and opens the profile page.
- `profile.html` displays student profile, academic overview, quick actions, settings demo messages, and logout.
- `courses.html` supports adding, editing, deleting, viewing, and searching courses using browser localStorage.
- `tasks.html` supports adding, editing, deleting, filtering, and marking tasks as completed using browser localStorage.
- `calendar.html` shows upcoming deadlines from current task data.
- `schedule.html` generates a simple study timeline from current pending tasks.
