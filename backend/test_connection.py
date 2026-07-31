import pymysql

connection = pymysql.connect(
    host="SG-famous-lyric-7914-14246-mysql-master.servers.mongodirector.com",
    port=3306,
    user="sgroot",
    password="dRnPAF893B2.xbuk",
    database="staffing",
    ssl={"ssl": {}}
)

try:
    cursor = connection.cursor()
    cursor.execute("""
        SELECT * FROM assignment;
    """)
    employees = cursor.fetchall()
    print('Connected!! Emplyees found')
    for row in employees:
        print(row)
finally:
    connection.close()