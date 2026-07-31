from fastapi import FastAPI
import pymysql
 
app = FastAPI()


app.get('/employees')
def get_employees():
    connection = pymysql.connect(
        host="your-host",
        user="your-username",
        password="your-password",
        database="your-database"
    )
    try:
        cursor = connection.cursor()
        cursor.execute("""
            SELECT employee.id, employee.name, SUM(assignment.total_hours) AS total_hours
            FROM employee
            LEFT JOIN assignment ON employee.id = assignment.employee_id
            GROUP BY employee.id, employee.name
        """)
        rows = cursor.fetchall()
        employees = []
        for row in rows:
            employees.append({
                "id": row[0],
                "name": row[1],
                "total_hours": row[2] if row[2] is not None else 0
            })
        return employees
    finally:
        cursor.close()