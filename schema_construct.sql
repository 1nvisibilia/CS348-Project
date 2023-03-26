create database MySchedule;

use MySchedule;

#this is a comment

create table Student
(id char(8) primary key,
first_name varchar(25),
last_name varchar(25),
program varchar(20),
faculty varchar(20),
pword varchar(20));

create table friends
(frienderid char(8),
friendeeid char(8),
unique key (frienderid, friendeeid)
foreign key (frienderid)
references Student (id)
on delete cascade,
foreign key (friendeeid)
references student (id)
on delete cascade);

create table Course
(csub varchar(6),
cnum varchar(5),
credit numeric(3,2),
title varchar(30),
index num_ind (cnum),
index sub_ind (csub),
primary key (csub, cnum));

create table Professor
(id char(8) primary key,
first_name varchar(25),
last_name varchar(25),
on_break bit,
pword varchar(20));

create table Likes
(sid char(8),
csub varchar(6),
cnum varchar(5),
foreign key (sid) 
references student (id) 
on delete cascade,
foreign key (csub)
references course (csub)
on delete cascade,
foreign key (cnum)
references course (cnum)
on delete cascade,
primary key (sid, csub, cnum));

create table Component
(id varchar(5) primary key,
csub varchar(6),
cnum varchar(5),
foreign key (csub)
references course (csub)
on delete cascade,
foreign key (cnum)
references course (cnum)
on delete cascade,
ctype char(3),
secnum char(3),
campoff varchar(5),
camploc char(1),
assocnum varchar(4),
enrollcap numeric(4,0),
enrolltot numeric(4,0),
startdate date,
enddate date,
starttime time,
endtime time,
weekday varchar(2),
building varchar(6),
room varchar(5),
pid char(8),
foreign key (pid)
references professor (id)
on delete cascade);

create table Attends
(sid char(8),
foreign key (sid)
references student (id)
on delete cascade,
cid char(4),
foreign key (cid)
references Component (id)
on delete cascade,
primary key (sid, cid));

DELIMITER $$
CREATE TRIGGER component_update
AFTER UPDATE ON Component
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT * FROM Component
        WHERE starttime <= NEW.endtime
        AND endtime >= NEW.starttime
        AND building = NEW.building
        AND room = NEW.room
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Update not allowed. Component conflict exists.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER attends_insert
BEFORE INSERT ON Attends
FOR EACH ROW
BEGIN
	IF EXISTS (
		SELECT *
        FROM Component c
        JOIN Attends a ON c.id = a.cid
        WHERE a.sid = NEW.sid
        AND c.starttime <= ( SELECT endtime FROM Component c2 WHERE NEW.cid = c2.id)
        AND c.endtime >= ( SELECT starttime FROM Component c3 WHERE NEW.cid = c3.id)
        AND c.weekday = ( SELECT weekday FROM Component c4 WHERE NEW.cid = c4.id)
	)
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insert not allowed. Attends conflict exists.';
	END IF;
END$$
DELIMITER ;

