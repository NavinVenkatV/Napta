from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class type_check(BaseModel):
        project_id  : int
        employee_id : int
        total_hours : int

import pymysql
 
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174","http://localhost:5173" ],
    allow_methods=["*"],
    allow_headers=["*"],
)

def getConnection():
    return pymysql.connect(
         host="SG-famous-lyric-7914-14246-mysql-master.servers.mongodirector.com",
            port=3306,
            user="sgroot",
            password="dRnPAF893B2.xbuk",
            database="staffing",
            ssl={"ssl": {}}
    )


@app.get("/employees") #-> getting all the employees
def get_employees():
    connection = getConnection()
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


@app.post('/assignments') #-> just assigning the project to the employee with working hours
def assignments(assignment_ids : type_check):
    connection = getConnection()
    try:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO assignment (employee_id, project_id, total_hours) VALUES (%s, %s, %s)", 
            (assignment_ids.employee_id, 
             assignment_ids.project_id,
             assignment_ids.total_hours))
        connection.commit()
    except pymysql.err.IntegrityError:
        raise HTTPException(status_code=400, detail="employee_id or project_id does not exist")

    finally:
        cursor.close()