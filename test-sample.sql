USE myschedule;

# R6 Feature 1

# Display a user's friends they have added by their id, first and last names
# Assume userID = 50000000
SELECT friendeeid, first_name, last_name, cid, csub, cnum
FROM student INNER JOIN (
	SELECT DISTINCT friendeeid, C.id AS cid, csub, cnum
	FROM friends, component AS C
	WHERE frienderid = 50000000
		AND C.id IN (SELECT cid FROM attends WHERE sid = frienderid) 
		AND C.id IN (SELECT cid FROM attends WHERE sid = friendeeid)) AS T
ON id = friendeeid

# R7 Feature 2
# Assume user has searched for 'CS 348'

SELECT *
FROM course
INNER JOIN component USING(csub, cnum)
WHERE course.csub = 'CS'
AND course.cnum = 343;

# R8 Feature 3
# Assume user has selected a component that they wish to enroll in
# With id = 6032
# We display all information about that component

SELECT *
FROM component
WHERE id = 6032;

SELECT id
FROM component
WHERE csub = 'CS'
AND cnum = 348
and assocnum = 1;

# R9 Feature 4
# These are only update, delete, and create trigger statements which have no output

# R10 Feature 5

SELECT *
FROM component
WHERE enrolltot < enrollcap
AND csub = 'CS'
AND cnum = 245;

