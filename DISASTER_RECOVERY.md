# Disaster Recovery Guide

This document outlines the steps to recover your SkillConnect system in the event of data loss, corruption, or a security breach.

---

## 1. Supabase Database Backups

### **Automated Backups**
- Supabase provides daily automated backups for paid projects.
- Access backups via the Supabase Dashboard: **Project > Database > Backups**.

### **Manual Backups**
- Regularly export your database using the SQL editor or `pg_dump`.
- Store backups securely (offsite/cloud storage).

#### **Restore Steps:**
1. Go to Supabase Dashboard > Database > Backups.
2. Select the desired backup and click **Restore**.
3. Confirm and monitor the restore process.
4. Test the application to ensure data integrity.

---

## 2. Supabase Storage Backups

### **Manual Backups**
- Download important files/buckets from the Supabase Storage dashboard.
- For automated backups, use the [Supabase Storage API](https://supabase.com/docs/reference/javascript/storage-from-download) to periodically download and archive files.

#### **Restore Steps:**
1. Upload files back to the appropriate storage buckets via the dashboard or API.
2. Verify file permissions and access policies.

---

## 3. Recommendations
- **Backup Frequency:**
  - Database: Daily (automated), Weekly (manual export)
  - Storage: Weekly or after major uploads
- **Test Restores:**
  - Perform a test restore at least quarterly to ensure backups are valid.
- **Access Control:**
  - Restrict backup/restore permissions to trusted admins only.
- **Incident Response:**
  - Document and report any incidents. Review logs and audit trails for suspicious activity.

---

## 4. Additional Resources
- [Supabase Backups Documentation](https://supabase.com/docs/guides/platform/backups)
- [Supabase Storage API](https://supabase.com/docs/reference/javascript/storage-from-download)

---

**Keep this document up to date as your infrastructure evolves.** 