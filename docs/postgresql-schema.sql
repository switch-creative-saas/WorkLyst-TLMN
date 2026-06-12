-- TLMN DOHRMP PostgreSQL schema starter.
-- Laravel migrations should be generated from this contract.

create table departments (
  id uuid primary key,
  name varchar(120) not null unique,
  code varchar(40) not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table staff_profiles (
  id uuid primary key,
  user_id uuid not null unique,
  employee_id varchar(40) not null unique,
  first_name varchar(120) not null,
  last_name varchar(120) not null,
  designation varchar(160),
  station varchar(160),
  department_id uuid references departments(id),
  supervisor_id uuid references staff_profiles(id),
  employment_status varchar(60) not null default 'active',
  force_password_change boolean not null default true,
  deactivated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table thematics (
  id uuid primary key,
  name varchar(160) not null unique,
  description text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key,
  thematic_id uuid not null references thematics(id),
  name varchar(200) not null,
  code varchar(60) not null unique,
  donor varchar(180),
  budget numeric(16,2) not null default 0,
  start_date date,
  end_date date,
  status varchar(40) not null default 'planning',
  project_manager_id uuid references staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_staff (
  project_id uuid not null references projects(id) on delete cascade,
  staff_profile_id uuid not null references staff_profiles(id) on delete cascade,
  role varchar(120),
  primary key (project_id, staff_profile_id)
);

create table attendance_qr_codes (
  id uuid primary key,
  staff_profile_id uuid not null references staff_profiles(id),
  token_hash varchar(255) not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table attendance_records (
  id uuid primary key,
  staff_profile_id uuid not null references staff_profiles(id),
  attendance_date date not null,
  check_in_at timestamptz not null,
  check_out_at timestamptz,
  status varchar(40) not null,
  location varchar(180),
  created_at timestamptz not null default now()
);

create table workflow_definitions (
  id uuid primary key,
  entity_type varchar(100) not null,
  name varchar(160) not null,
  steps jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table workflow_instances (
  id uuid primary key,
  workflow_definition_id uuid not null references workflow_definitions(id),
  entity_type varchar(100) not null,
  entity_id uuid not null,
  status varchar(60) not null default 'submitted',
  current_step integer not null default 1,
  submitted_by uuid not null references staff_profiles(id),
  submitted_at timestamptz not null default now(),
  completed_at timestamptz
);

create table approvals (
  id uuid primary key,
  workflow_instance_id uuid not null references workflow_instances(id) on delete cascade,
  step_number integer not null,
  approver_id uuid references staff_profiles(id),
  role_name varchar(120) not null,
  action varchar(40) not null default 'pending',
  comments text,
  signature_path varchar(500),
  acted_at timestamptz
);

create table payment_requests (
  id uuid primary key,
  requester_id uuid not null references staff_profiles(id),
  funding_source varchar(120) not null,
  purpose text not null,
  total_amount numeric(16,2) not null default 0,
  amount_in_words text,
  status varchar(60) not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_request_items (
  id uuid primary key,
  payment_request_id uuid not null references payment_requests(id) on delete cascade,
  details text not null,
  amount numeric(16,2) not null
);

create table concept_notes (
  id uuid primary key,
  officer_id uuid not null references staff_profiles(id),
  project_id uuid references projects(id),
  activity_title varchar(220) not null,
  background text,
  problem_statement text,
  objectives text,
  target_beneficiaries text,
  location varchar(180),
  expected_outcomes text,
  risk_assessment text,
  budget_summary jsonb,
  monitoring_plan text,
  status varchar(60) not null default 'draft',
  created_activity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table beneficiaries (
  id uuid primary key,
  beneficiary_id varchar(80) not null unique,
  name varchar(180) not null,
  gender varchar(40),
  age integer,
  phone varchar(60),
  community varchar(160),
  lga varchar(160),
  state varchar(160),
  disability_type varchar(160),
  created_at timestamptz not null default now()
);

create table documents (
  id uuid primary key,
  title varchar(220) not null,
  category varchar(120) not null,
  owner_id uuid references staff_profiles(id),
  current_version integer not null default 1,
  permission_scope varchar(80) not null default 'department',
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key,
  user_id uuid,
  action varchar(160) not null,
  entity_type varchar(120) not null,
  entity_id uuid,
  previous_value jsonb,
  new_value jsonb,
  ip_address inet,
  device text,
  created_at timestamptz not null default now()
);

create index idx_staff_department on staff_profiles(department_id);
create index idx_attendance_staff_date on attendance_records(staff_profile_id, attendance_date);
create index idx_workflow_entity on workflow_instances(entity_type, entity_id);
create index idx_approvals_pending_role on approvals(role_name, action);
create index idx_payment_requests_status on payment_requests(status);
create index idx_concept_notes_status on concept_notes(status);
create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
