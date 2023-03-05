create database MySchedule;

use MySchedule;

#this is a comment

create table Student
(id char(8) primary key,
first_name varchar(20),
last_name varchar(20),
program varchar(20),
faculty varchar(20),
pword varchar(20));

create table friends
(frienderid char(8),
friendeeid char(8),
foreign key (frienderid)
references Student (id)
on delete cascade,
foreign key (friendeeid)
references student (id)
on delete cascade);

create table Course
(csub varchar(6),
cnum varchar(4),
credit numeric(3,2),
title varchar(30),
index num_ind (cnum),
index sub_ind (csub),
primary key (csub, cnum));

create table Professor
(id char(8) primary key,
first_name varchar(20),
last_name varchar(20),
on_break bit,
pword varchar(20));

create table Likes
(sid char(8),
csub varchar(6),
cnum varchar(4),
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
(id varchar(4) primary key,
csub varchar(6),
cnum varchar(4),
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
building varchar(4),
room varchar(4),
pid char(8),
foreign key (pid)
references professor (id)
on delete cascade);

create table Attends
(sid char(8) primary key,
foreign key (sid)
references student (id)
on delete cascade,
cid char(4),
csub varchar(6),
cnum varchar(4),
foreign key (csub)
references Component (csub)
on delete cascade,
foreign key (cnum)
references Component (cnum)
on delete cascade,
foreign key (cid)
references Component (id)
on delete cascade);



