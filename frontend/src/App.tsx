// App.jsx
import './App.css'
import { useEffect, useState, useMemo, lazy, Suspense } from 'react'
import axios from 'axios'

const AssignmentForm = lazy(() => import('./assignmentForm'))
interface Employee {
  id : number, 
  name : string, 
  total_hours : number
}

function App() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const getEmployees = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8000/employees')
      setEmployees(response.data)
    } catch (e) {
      console.log('Error getting employees', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEmployees()
  }, [])

  const overloadedCount = useMemo(
    () => employees.filter((emp : Employee) => emp.total_hours > 35).length,
    [employees]
  )

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
   
      <header className="bg-slate-900 text-white px-8 py-5 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Staffing Tracker</h1>
          <p className="text-slate-400 text-sm">Employee workload overview</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-slate-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-200 transition"
        >
          {showForm ? 'Close' : '+ Add assignment'}
        </button>
      </header>


      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
      
        <div className="flex gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg px-5 py-4 flex-1">
            <p className="text-slate-500 text-xs uppercase tracking-wide">Employees</p>
            <p className="text-2xl font-semibold text-slate-900">{employees.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg px-5 py-4 flex-1">
            <p className="text-slate-500 text-xs uppercase tracking-wide">Overloaded (&gt;35h)</p>
            <p className={`text-2xl font-semibold ${overloadedCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {overloadedCount}
            </p>
          </div>
        </div>

    
        {showForm && (
          <Suspense fallback={<p className="text-slate-400 text-sm mb-6">Loading form...</p>}>
            <AssignmentForm onCreated={getEmployees} />
          </Suspense>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-left uppercase text-xs tracking-wide">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Total hours</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-slate-400">
                    Loading employees...
                  </td>
                </tr>
              )}

              {!loading && employees.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-slate-400">
                    No employees found.
                  </td>
                </tr>
              )}

              {!loading &&
                employees.map((emp : Employee) => (
                  <tr key={emp.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 text-slate-800 font-medium">{emp.id}</td>
                    <td className="px-5 py-3 text-slate-800 font-medium">{emp.name}</td>
                    <td className="px-5 py-3 text-slate-600">{emp.total_hours}h</td>
                    <td className="px-5 py-3">
                      {emp.total_hours > 35 ? (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium">
                          Overloaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-8 py-4 text-center text-slate-400 text-xs">
        Staffing Tracker — practice project
      </footer>
    </div>
  )
}

export default App