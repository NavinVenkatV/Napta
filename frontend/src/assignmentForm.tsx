// AssignmentForm.jsx
import React, { useState } from 'react'
import axios from 'axios'

function AssignmentForm({ onCreated } : any) {
  const [form, setForm] = useState({ employee_id: '', project_id: '', total_hours: '' })
  const [error, setError] = useState('')

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e : React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post('http://localhost:8000/assignments', {
        employee_id: form.employee_id,
        project_id: form.project_id,
        total_hours: form.total_hours,
      })
      console.log('xxxxxxxxxxxxxxxxxxxxxxxx', response)
      setForm({ employee_id: '', project_id: '', total_hours: '' })
      onCreated()
    } catch (err : any) {
      setError(err.response?.data?.detail || 'Something went wrong')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-lg p-5 mb-6 flex flex-wrap items-end gap-4"
    >
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Employee ID</label>
        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Project ID</label>
        <input
          name="project_id"
          value={form.project_id}
          onChange={handleChange}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Hours</label>
        <input
          name="total_hours"
          value={form.total_hours}
          onChange={handleChange}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>
      <button
        type="submit"
        className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition"
      >
        Save
      </button>
      {error && <p className="text-red-600 text-xs w-full">{error}</p>}
    </form>
  )
}

export default AssignmentForm