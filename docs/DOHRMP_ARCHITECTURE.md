# TLMN DOHRMP Enterprise Architecture

## Product

TLMN Digital Operations & Human Resource Management Platform (DOHRMP) is the enterprise platform for The Leprosy Mission Nigeria. OrangeHRM is a UX reference only; all visible identity, colors, workflow labels, dashboards, charts, emails, and reports must use TLMN branding.

## Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, ShadCN UI, TanStack Query, React Hook Form, Zod, Zustand.
- Backend target: Laravel 12, Sanctum, Spatie Permission, Queues, Scheduler.
- Database: PostgreSQL.
- Storage: local disk for development, S3-compatible storage for production.

## Laravel Structure

```text
app/
  Domain/
    Access/
    Staff/
    Attendance/
    Timesheets/
    Requests/
    ConceptNotes/
    ActivityReports/
    Projects/
    Thematics/
    Beneficiaries/
    Finance/
    Procurement/
    Documents/
    Notifications/
    Audit/
  Http/
    Controllers/Api/V1/
    Requests/
    Resources/
  Policies/
  Jobs/
  Events/
  Listeners/
  Services/
  Repositories/
database/
  migrations/
  seeders/
routes/
  api.php
```

## Roles

Super Admin, National Director, HR Manager, HR Officer, Finance Manager, Finance Officer, Internal Auditor, Program Manager, M&E Officer, Department Head, Supervisor, Staff.

Use Spatie roles and permissions. Branding and UI settings must never grant permissions or bypass policies.

## Core Tables

- users, roles, permissions, model_has_roles, model_has_permissions
- departments, staff_profiles, staff_assignments, employee_credentials
- thematics, projects, project_staff
- attendance_qr_codes, attendance_records
- timesheets, timesheet_entries
- payment_requests, payment_request_items
- concept_notes, concept_note_budgets
- activities, activity_reports, activity_report_attendance, activity_report_disaggregation
- beneficiaries, beneficiary_project
- procurement_requests, quotations, vendors, purchase_orders, goods_received_notes
- documents, document_versions, document_permissions
- workflow_definitions, workflow_instances, workflow_steps, approvals
- notifications, notification_deliveries
- audit_logs

## Workflow Pattern

Every approval module uses the same workflow engine:

1. Create draft record.
2. Submit to workflow.
3. Resolve next approver from workflow definition and role assignments.
4. Allow approve, reject, return, comment, attach document, digital signature.
5. Persist every action to audit_logs.
6. Notify next actor by in-app notification and queued email.

## API Prefix

All APIs use `/api/v1`.

Required endpoint groups:

- `/auth/login`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/change-password`, `/auth/2fa/*`
- `/staff`, `/staff/{staff}/assignments`, `/staff/{staff}/credentials`
- `/attendance/qr`, `/attendance/scan`, `/attendance/history`, `/attendance/reports`
- `/timesheets`, `/timesheets/{timesheet}/submit`, `/timesheets/{timesheet}/approve`
- `/requests/payment`, `/requests/{request}/workflow`
- `/concept-notes`, `/concept-notes/{conceptNote}/approve`
- `/activity-reports`, `/activity-reports/{report}/pdf`
- `/thematics`, `/projects`, `/beneficiaries`
- `/finance/*`, `/procurement/*`, `/documents/*`
- `/dashboards/national-director`, `/dashboards/staff`
- `/notifications`, `/audit-logs`

## Implementation Phases

1. Authentication, roles, permissions, staff management.
2. Attendance, QR attendance, timesheets.
3. Requests, concept notes, approvals.
4. Activity reports, beneficiaries, projects.
5. Finance, procurement, documents.
6. Executive dashboard, analytics, notifications.
7. Optimization, tests, deployment hardening.

## Production Standards

- Use FormRequest validation and Zod schemas for shared frontend validation behavior.
- Use policies for every protected model.
- Use repositories for persistence and services for workflow/business logic.
- Queue mail, PDF generation, notification fan-out, and document processing.
- Use PostgreSQL indexes on tenant, status, workflow, approver, date, and foreign key columns.
- Use soft deletes for operational records where audit history matters.
- Store uploaded files through Laravel disks with S3-compatible support.
- Add Pest/PHPUnit backend tests and React component/integration tests for critical workflows.
