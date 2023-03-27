create database MySchedule;

use MySchedule;

#this is a comment

create table Student
(id char(8) primary key,
first_name varchar(25),
last_name varchar(25),
program varchar(40),
faculty varchar(20),
pword varchar(20));

create table friends
(frienderid char(8),
friendeeid char(8),
primary key (frienderid, friendeeid),
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
foreign key (csub, cnum)
references course (csub, cnum)
on delete cascade,
primary key (sid, csub, cnum));

create table Component
(id varchar(5) primary key,
csub varchar(6),
cnum varchar(5),
foreign key (csub, cnum)
references course (csub, cnum)
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
cid varchar(5),
foreign key (cid)
references Component (id)
on delete cascade,
primary key (sid, cid));

DELIMITER $$
CREATE TRIGGER component_update
BEFORE UPDATE ON Component
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT * FROM Component
        WHERE ((startdate <= NEW.enddate AND enddate >= NEW.startdate) 
        OR startdate IS NULL OR enddate IS NULL OR NEW.startdate IS NULL OR NEW.enddate IS NULL)
        #if date is null, it's assumed to run for full term, so still return true for conflict
        AND (starttime <= NEW.endtime AND endtime >= NEW.starttime)
        #if time is null, it's assumed to be unspecified, so return false for conflict
        AND weekday = NEW.weekday
        AND building = NEW.building
        AND room = NEW.room
        AND id <> OLD.id #can't conflict with old component that got updated
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Update not allowed. Component room conflict exists.';
    END IF;
    
    IF EXISTS (
        SELECT * FROM Component
        WHERE ((startdate <= NEW.enddate AND enddate >= NEW.startdate) 
        OR startdate IS NULL OR enddate IS NULL OR NEW.startdate IS NULL OR NEW.enddate IS NULL)
        #if date is null, it's assumed to run for full term, so still return true for conflict
        AND (starttime <= NEW.endtime AND endtime >= NEW.starttime)
        #if time is null, it's assumed to be unspecified, so return false for conflict
        AND weekday = NEW.weekday
        AND pid = NEW.pid
        AND id <> OLD.id #can't conflict with old component that got updated
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Update not allowed. Component teacher conflict exists.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER component_insert
BEFORE INSERT ON Component
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT * FROM Component
        WHERE ((startdate <= NEW.enddate AND enddate >= NEW.startdate) 
        OR startdate IS NULL OR enddate IS NULL OR NEW.startdate IS NULL OR NEW.enddate IS NULL)
        #if date is null, it's assumed to run for full term, so still return true for conflict
        AND (starttime <= NEW.endtime AND endtime >= NEW.starttime)
        #if time is null, it's assumed to be unspecified, so return false for conflict
        AND weekday = NEW.weekday
        AND building = NEW.building
        AND room = NEW.room
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insert not allowed. Component room conflict exists.';
    END IF;
    
    IF EXISTS (
        SELECT * FROM Component
        WHERE ((startdate <= NEW.enddate AND enddate >= NEW.startdate) 
        OR startdate IS NULL OR enddate IS NULL OR NEW.startdate IS NULL OR NEW.enddate IS NULL)
        #if date is null, it's assumed to run for full term, so still return true for conflict
        AND (starttime <= NEW.endtime AND endtime >= NEW.starttime)
        #if time is null, it's assumed to be unspecified, so return false for conflict
        AND weekday = NEW.weekday
        AND pid = NEW.pid
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insert not allowed. Component teacher conflict exists.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER attends_insert
BEFORE INSERT ON Attends
FOR EACH ROW
BEGIN
	IF EXISTS (
		WITH 
			newComp AS (SELECT * FROM Component WHERE Component.id = NEW.cid),
            curCompIds AS (SELECT * FROM Attends WHERE Attends.sid = NEW.sid),
            curComps AS (SELECT *
						FROM Component
                        JOIN curCompIds ON curCompIds.cid = Component.id)
		SELECT *
        FROM curComps
        WHERE ((curComps.startdate <= newComp.enddate AND curComps.enddate >= newComp.startdate) 
        OR curComps.startdate IS NULL OR curComps.enddate IS NULL OR newComp.startdate IS NULL OR newComp.enddate IS NULL)
        #if date is null, it's assumed to run for full term, so still return true for conflict
        AND (curComps.starttime <= newComp.endtime AND curComps.enddtime >= newComp.starttime)
        #if time is null, it's assumed to be unspecified, so return false for conflict
        AND curComps.weekday = newComp.weekday
	)
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insert not allowed. Attends conflict exists.';
	END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER attends_update
BEFORE UPDATE ON Attends
FOR EACH ROW
BEGIN
	IF EXISTS (
		WITH 
			newComp AS (SELECT * FROM Component WHERE Component.id = NEW.cid),
            curCompIds AS (SELECT * FROM Attends WHERE Attends.sid = NEW.sid),
            curComps AS (SELECT *
						FROM Component
                        JOIN curCompIds ON curCompIds.cid = Component.id)
		SELECT *
        FROM curComps
        WHERE ((curComps.startdate <= newComp.enddate AND curComps.enddate >= newComp.startdate) 
        OR curComps.startdate IS NULL OR curComps.enddate IS NULL OR newComp.startdate IS NULL OR newComp.enddate IS NULL)
        #if date is null, it's assumed to run for full term, so still return true for conflict
        AND (curComps.starttime <= newComp.endtime AND curComps.enddtime >= newComp.starttime)
        #if time is null, it's assumed to be unspecified, so return false for conflict
        AND curComps.weekday = newComp.weekday
        AND curComps.cid <> OLD.cid #can't conflict with old component that got updated
	)
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Update not allowed. Attends conflict exists.';
	END IF;
END$$
DELIMITER ;

