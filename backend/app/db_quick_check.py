import psycopg2

# Establish a connection to the database
conn = psycopg2.connect("dbname=thinkforward_db user=postgres")
cur = conn.cursor()

# Execute a query to retrieve the table schema
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_profiles'")

# Fetch and print the results
columns = cur.fetchall()
for col in columns:
    print(f"Column: {col[0]}, Type: {col[1]}")

# Close communication with the database
cur.close()
conn.close()
