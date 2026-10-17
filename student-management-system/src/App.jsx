import { useEffect, useMemo, useState } from 'react'
import {
  GraduationCap, LayoutDashboard, Users, UserRoundPlus, Search, Plus,
  Pencil, Trash2, Mail, BookOpen, CheckCircle2, Clock3, X, ChevronDown,
  Download, SlidersHorizontal, CircleHelp, Menu
} from 'lucide-react'

const STORAGE_KEY = 'campusdesk-students-v1'
const starterStudents = [
  { id: 'STU-1001', fullName: 'Mpho Thabane', age: 21, email: 'mpho.thabane@example.com', course: 'Information Technology', status: 'Enrolled' },
  { id: 'STU-1002', fullName: 'Lerato Mokoena', age: 22, email: 'lerato.mokoena@example.com', course: 'Business Information Technology', status: 'Enrolled' },
  { id: 'STU-1003', fullName: 'Teboho Ndlovu', age: 20, email: 'teboho.ndlovu@example.com', course: 'Multimedia Design', status: 'Pending' },
  { id: 'STU-1004', fullName: 'Relebohile Khumalo', age: 23, email: 'relebohile.k@example.com', course: 'Information Technology', status: 'Enrolled' },
  { id: 'STU-1005', fullName: 'Ntsoaki Phiri', age: 19, email: 'ntsoaki.phiri@example.com', course: 'Business Information Technology', status: 'Inactive' },
  { id: 'STU-1006', fullName: 'Kabelo Mofokeng', age: 24, email: 'kabelo.mofokeng@example.com', course: 'Multimedia Design', status: 'Enrolled' },
]

const emptyForm = { fullName: '', age: '', email: '', course: 'Information Technology', status: 'Enrolled' }
const courses = ['Information Technology', 'Business Information Technology', 'Multimedia Design', 'Software Engineering', 'Accounting']

function readStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : starterStudents
  } catch {
    return starterStudents
  }
}

function makeStudentId(students) {
  // IDs are strings so their leading letters and zeros remain intact.
  const maxId = students.reduce((max, student) => {
    const number = Number(student.id.replace(/\D/g, ''))
    return Number.isFinite(number) ? Math.max(max, number) : max
  }, 1000)
  return `STU-${maxId + 1}`
}

function validateForm(form, students, editingId) {
  const errors = {}
  if (!form.fullName.trim()) errors.fullName = 'Enter the student’s full name.'
  if (form.age === '' || !Number.isInteger(Number(form.age)) || Number(form.age) < 16 || Number(form.age) > 100) {
    errors.age = 'Age must be a whole number between 16 and 100.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!form.course) errors.course = 'Choose a course.'
  const duplicate = students.some(student =>
    student.email.toLowerCase() === form.email.trim().toLowerCase() && student.id !== editingId
  )
  if (duplicate) errors.email = 'This email is already assigned to another student.'
  return errors
}

function StatCard({ icon: Icon, label, value, note, tone }) {
  return <article className="stat-card">
    <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
    <div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
  </article>
}

function StatusPill({ status }) {
  const className = status.toLowerCase()
  return <span className={`status-pill ${className}`}><span className="status-dot" />{status}</span>
}

function StudentModal({ mode, student, students, onClose, onSave }) {
  const [form, setForm] = useState(student ? {
    fullName: student.fullName, age: String(student.age), email: student.email,
    course: student.course, status: student.status
  } : emptyForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const handleKey = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const change = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
    setSubmitError('')
  }

  const submit = event => {
    event.preventDefault()
    const nextErrors = validateForm(form, students, student?.id)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const record = {
      id: student?.id || makeStudentId(students),
      fullName: form.fullName.trim(),
      age: Number(form.age),
      email: form.email.trim().toLowerCase(),
      course: form.course,
      status: form.status,
    }
    const result = onSave(record)
    if (result === false) setSubmitError('The student could not be saved. Please try again.')
  }

  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="student-modal-title">
      <div className="modal-heading">
        <div><span className="eyebrow">{mode === 'edit' ? 'UPDATE RECORD' : 'NEW RECORD'}</span>
          <h2 id="student-modal-title">{mode === 'edit' ? 'Edit student' : 'Add a student'}</h2>
          <p>{mode === 'edit' ? 'Make changes to the student details below.' : 'Complete the details to add a student to your directory.'}</p>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={19} /></button>
      </div>
      <form onSubmit={submit} noValidate>
        {mode === 'edit' && <div className="field full"><label>Student ID</label><input value={student.id} disabled /></div>}
        <div className="form-grid">
          <div className="field full"><label htmlFor="fullName">Full name <b>*</b></label>
            <input id="fullName" name="fullName" value={form.fullName} onChange={change} placeholder="e.g. Mpho Thabane" autoFocus />
            {errors.fullName && <small className="field-error">{errors.fullName}</small>}
          </div>
          <div className="field"><label htmlFor="age">Age <b>*</b></label>
            <input id="age" name="age" type="number" min="16" max="100" value={form.age} onChange={change} placeholder="e.g. 21" />
            {errors.age && <small className="field-error">{errors.age}</small>}
          </div>
          <div className="field"><label htmlFor="status">Enrollment status</label>
            <select id="status" name="status" value={form.status} onChange={change}>
              <option>Enrolled</option><option>Pending</option><option>Inactive</option>
            </select>
          </div>
          <div className="field full"><label htmlFor="email">Email address <b>*</b></label>
            <input id="email" name="email" type="email" value={form.email} onChange={change} placeholder="student@example.com" />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </div>
          <div className="field full"><label htmlFor="course">Course of study <b>*</b></label>
            <select id="course" name="course" value={form.course} onChange={change}>
              {courses.map(course => <option key={course}>{course}</option>)}
            </select>
            {errors.course && <small className="field-error">{errors.course}</small>}
          </div>
        </div>
        {submitError && <p className="field-error">{submitError}</p>}
        <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="button button-primary">{mode === 'edit' ? 'Save changes' : 'Add student'}</button></div>
      </form>
    </section>
  </div>
}

function DeleteModal({ student, onClose, onConfirm }) {
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="confirm-icon"><Trash2 size={22} /></div>
      <button className="icon-button close-confirm" onClick={onClose} aria-label="Close confirmation"><X size={18} /></button>
      <h2 id="delete-title">Delete student?</h2>
      <p>You’re about to remove <strong>{student.fullName}</strong> ({student.id}). This action cannot be undone.</p>
      <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>Keep student</button>
        <button className="button button-danger" onClick={onConfirm}>Delete record</button></div>
    </section>
  </div>
}

function App() {
  const [students, setStudents] = useState(readStudents)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [courseFilter, setCourseFilter] = useState('All courses')
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(students)) }, [students])
  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const filteredStudents = useMemo(() => students.filter(student => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [student.id, student.fullName, student.email, student.course].some(value => value.toLowerCase().includes(query))
    return matchesSearch && (statusFilter === 'All statuses' || student.status === statusFilter)
      && (courseFilter === 'All courses' || student.course === courseFilter)
  }), [students, search, statusFilter, courseFilter])

  const enrolled = students.filter(student => student.status === 'Enrolled').length
  const pending = students.filter(student => student.status === 'Pending').length
  const activeRate = students.length ? Math.round((enrolled / students.length) * 100) : 0

  const saveStudent = record => {
    if (modal?.mode === 'edit') {
      setStudents(current => current.map(student => student.id === record.id ? record : student))
      setToast('Student details updated successfully.')
    } else {
      setStudents(current => [record, ...current])
      setToast('New student added successfully.')
    }
    setModal(null)
    return true
  }

  const confirmDelete = () => {
    setStudents(current => current.filter(student => student.id !== deleteTarget.id))
    setToast('Student record deleted.')
    setDeleteTarget(null)
  }

  const exportCsv = () => {
    const headers = ['Student ID', 'Full Name', 'Age', 'Email', 'Course', 'Enrollment Status']
    const rows = filteredStudents.map(student => [student.id, student.fullName, student.age, student.email, student.course, student.status])
    const escape = value => `"${String(value).replace(/"/g, '""')}"`
    const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'campusdesk-students.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    setToast('Student list exported as CSV.')
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={23} /></div><div><strong>CampusDesk</strong><span>STUDENT SERVICES</span></div></div>
      <div className="nav-label">WORKSPACE</div>
      <button className="nav-item active" onClick={() => setMobileNavOpen(false)}><LayoutDashboard size={18} />Dashboard</button>
      <button className="nav-item" onClick={() => { setSearch(''); setStatusFilter('All statuses'); setCourseFilter('All courses'); setMobileNavOpen(false) }}><Users size={18} />Student directory <span className="nav-count">{students.length}</span></button>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={18} /></div><strong>Need a hand?</strong><p>Keep student records organized and up to date.</p><button onClick={() => setToast('Tip: use Search and Filters to quickly find a record.')}>Quick tip <span>↗</span></button></div>
        <div className="profile"><div className="profile-avatar">AD</div><div className="profile-copy"><strong>Administrator</strong><span>Student services</span></div><ChevronDown size={16} /></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle navigation"><Menu size={20} /></button>
        <div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
        <div className="topbar-right"><span className="today-dot" />Student records are up to date <div className="top-avatar">AD</div></div>
      </header>

      <div className="content">
        <section className="page-heading"><div><div className="eyebrow">STUDENT SERVICES / OVERVIEW</div><h1>Student dashboard</h1><p>Manage your student records, track enrollment, and keep everything in one place.</p></div>
          <button className="button button-primary add-top" onClick={() => setModal({ mode: 'add' })}><Plus size={17} /> Add student</button></section>

        <section className="stats-grid">
          <StatCard icon={Users} label="Total students" value={students.length} note="All student records" tone="blue" />
          <StatCard icon={CheckCircle2} label="Currently enrolled" value={enrolled} note={`${activeRate}% of all students`} tone="green" />
          <StatCard icon={Clock3} label="Pending enrollment" value={pending} note="Awaiting confirmation" tone="cream" />
          <StatCard icon={BookOpen} label="Courses represented" value={new Set(students.map(s => s.course)).size} note="Across all records" tone="slate" />
        </section>

        <section className="directory-card">
          <div className="directory-header"><div><h2>Student directory</h2><p>Browse and manage individual student profiles.</p></div>
            <button className="button button-outline export-button" onClick={exportCsv}><Download size={16} /> Export CSV</button></div>
          <div className="toolbar"><div className="search-box"><Search size={17} /><input aria-label="Search students" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name, ID, email or course..." />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}</div>
            <div className="filter-box"><SlidersHorizontal size={16} /><select aria-label="Filter by status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option>All statuses</option><option>Enrolled</option><option>Pending</option><option>Inactive</option></select></div>
            <div className="filter-box course-filter"><select aria-label="Filter by course" value={courseFilter} onChange={event => setCourseFilter(event.target.value)}><option>All courses</option>{courses.map(course => <option key={course}>{course}</option>)}</select></div>
          </div>
          <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>COURSE OF STUDY</th><th>AGE</th><th>STATUS</th><th className="action-heading">ACTIONS</th></tr></thead>
            <tbody>{filteredStudents.map(student => <tr key={student.id}>
              <td><div className="student-cell"><div className="student-avatar">{student.fullName.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="student-details"><strong>{student.fullName}</strong><span><Mail size={12} />{student.email}</span></div></div></td>
              <td><span className="student-id">{student.id}</span></td><td><span className="course-name">{student.course}</span></td><td>{student.age}</td><td><StatusPill status={student.status} /></td>
              <td><div className="row-actions"><button className="icon-button edit-action" onClick={() => setModal({ mode: 'edit', student })} aria-label={`Edit ${student.fullName}`} title="Edit student"><Pencil size={16} /></button><button className="icon-button delete-action" onClick={() => setDeleteTarget(student)} aria-label={`Delete ${student.fullName}`} title="Delete student"><Trash2 size={16} /></button></div></td>
            </tr>)}</tbody></table>
            {filteredStudents.length === 0 && <div className="empty-state"><div className="empty-icon"><Users size={23} /></div><h3>No students found</h3><p>Try changing your search or filters, or add a new student record.</p><button className="button button-primary" onClick={() => setModal({ mode: 'add' })}><Plus size={16} /> Add student</button></div>}
          </div>
          <div className="table-footer"><span>Showing <strong>{filteredStudents.length ? 1 : 0}–{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span><span className="footer-note"><span className="sync-dot" /> Changes save automatically on this device</span></div>
        </section>
        <footer className="page-footer"><span>© 2026 CampusDesk Student Services</span><span>Built for better student administration</span></footer>
      </div>
    </main>
    {modal && <StudentModal key={`${modal.mode}-${modal.student?.id || 'new'}`} mode={modal.mode} student={modal.student} students={students} onClose={() => setModal(null)} onSave={saveStudent} />}
    {deleteTarget && <DeleteModal student={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}<button onClick={() => setToast('')} aria-label="Dismiss message"><X size={15} /></button></div>}
  </div>
}

export default App
