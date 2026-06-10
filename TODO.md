# TODO — T SQUARED HUB / Dream Space site

- [ ] Fix booking flow JavaScript issues (notably Step 3 validation bug and any missing element IDs like sidebar summary rows).
- [ ] Harden EmailJS integration:
  - [ ] Correctly gate on EMAILJS_CONFIGURED and prevent runtime errors when templates/service ID are missing.
  - [ ] Ensure contact form uses proper template/service IDs or clean fallback.
  - [ ] Improve booking email sending status UI.
- [ ] UX polish for booking SPA:
  - [ ] Ensure all “Next” buttons enable/disable consistently based on step completion.
  - [ ] Validate calendar/time selection flows and make “availability dots/slots” consistent.
  - [ ] Improve panel transitions and reset logic.
- [ ] Cleanup performance/quality:
  - [ ] Remove duplicated CSS blocks for booking system integration.
  - [ ] Remove duplicated/unused JS sections and add small safety guards.
- [ ] Decide whether to split into a separate `booking.html`.
  - [ ] If keeping SPA, ensure CTA buttons behave consistently.
  - [ ] If splitting, create `booking.html` and move booking flow assets accordingly.

