# 🎫 Ticket 1: Create Cloudflare D1 Database Schema

**Type:** Feature / Database Infrastructure
**Priority:** High
**Assignee:** Backend Developer

---

# Objective

Design and implement the initial **Cloudflare D1** database schema required to replace the application's current `localStorage` persistence layer.

The schema must accurately model the existing application data while maintaining referential integrity, scalability, and compatibility with future backend APIs.

---

# Scope

This ticket includes only the database layer.

### In Scope

* Analyze the existing data stored in `localStorage`.
* Identify all entities currently persisted by the application.
* Design a normalized SQLite schema for Cloudflare D1.
* Create all required tables.
* Define primary keys.
* Define foreign key relationships.
* Create appropriate indexes for lookup performance.
* Configure default values where appropriate.
* Create migration files.
* Ensure the schema is compatible with future API development.

### Out of Scope

* API endpoints
* Authentication
* Business logic
* Frontend changes
* Data migration from `localStorage`
* Deployment
* Testing application features

---

# Technical Requirements

* Use **Cloudflare D1 (SQLite)**.
* Follow SQLite best practices.
* Enforce referential integrity using foreign keys.
* Avoid duplicated data through normalization where practical.
* Use appropriate SQLite data types.
* Add indexes for frequently queried columns.
* Keep the schema compatible with the current TypeScript models where reasonable.

---

# Deliverables

* Database schema definition.
* SQL migration file(s).
* Entity Relationship Diagram (ERD) or equivalent schema documentation.
* Brief documentation explaining:

  * Tables
  * Relationships
  * Primary keys
  * Foreign keys
  * Indexes

---

# Acceptance Criteria

* ✅ All application entities are represented in the database schema.
* ✅ All required tables are created.
* ✅ Primary keys are defined.
* ✅ Foreign key constraints are implemented where applicable.
* ✅ Appropriate indexes are created.
* ✅ Migration executes successfully on a clean Cloudflare D1 database.
* ✅ Schema documentation is provided.
* ✅ No application code outside the database schema is modified.
* ✅ The schema is ready for use by future backend API tickets.
