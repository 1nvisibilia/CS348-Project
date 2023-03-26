import bs4 as bs
import requests
import re

courseCodes = [ "AFM", "ACTSC", "ASL", "ANTH", "APPLS", "AMATH", "ARABIC", "AE", "ARCH", "ARTS", "ARBUS", "AVIA",
"BIOL", "BME", "BLKST", "BASE", "BUS", "BET", "CDNST", "CHE", "CHEM", "CHINA", "CMW", "CIVE", "CLAS", "COGSCI", "CO", 
"COMM", "COMMST", "CS", "CFM", "COOP ", "CROAT", "CI", "DAC", "DUTCH", "EARTH", "EASIA", "ECON", "ECE", "ENGL", "EMLS", 
"ENVS", "ENBUS", "ERS", "ENVE", "FINE", "FR", "GSJ", "GENE", "GEOG", "GEOE", "GER", "GERON", "GBDA", "GRK", "HEALTH", 
"HHUM", "HIST", "HRM", "HRTS", "HUMSC", "INDENT", "INDG", "INDEV", "INTST", "ITAL", "ITALST", "JAPAN", "JS", "KIN", "INTEG", 
"KOREA", "LAT", "LS", "MGMT", "MSCI", "MNS", "MATBUS", "MATH", "MTHEL", "ME", "MTE", "MEDVL", "MENN", "MOHAWK", "MUSIC", "NE",
"OPTOM", "PACS", "PHARM", "PHIL", "PHYS", "PLAN", "PSCI", "PORT", "PD", "PDARCH", "PDPHRM", "PSYCH", "HLTH", "PMATH", "REC", 
"RS", "RUSS", "REES", "SCI", "SCBUS", "SMF", "SDS", "SOCWK", "SWREN", "STV", "SOC", "SE", "SPAN", "STAT", "SI", "SFM", 
"SYDE", "THPERF", "UNIV", "VCULT", "WKRPT"]

#courseCodes=["BUS"]

teachers=set()
teachPairs=set()
teachIdCounter=10000000

compCodeSet=set()

compIdCounter=10000

for subject in courseCodes:

    #coursenums = ["100",  "105",  "106",  "114",  "115",  "116",  "135",  "136", "136L",  "138",  "146",  "200",  "230",  "240",  "240E",  "241",  "245",  "246",  "251",  "330",  "335",  "338",  "341",  "343",  "346", 
    #"348",  "349",  "350",  "360",  "365",  "370",  "371",  "430",  "431",  "436",  "442",  "444",  "445",  "446",  "447",  "448",  "450",  "451",  "452",  "454",  "456",  "458",  "467",  "476",  "479",  
    #"480",  "482",  "484",  "486",  "487",  "488",  "489",  "490",  "492",  "494",  "497",  "499R",  "499T"]
    coursenums=[]
    URL = "https://classes.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl?sess=1231&level=under&subject="+subject+"&cournum="
    url_link = requests.get(URL)
    file = bs.BeautifulSoup(url_link.text, "lxml")
    find_table = file.find('table')
    if find_table is None:
        continue
    #if no courses are offered for this subject, move on to next subject
    rows = find_table.find_all('tr')
    for i in rows:
        table_data = i.find_all('td')
        data = [j.text for j in table_data]
        if len(data) > 0 and data[0].strip()==subject:
            coursenums.append(data[1].strip())
            #print(data[1].strip())
    #coursenums=["136", "136L"]
    #ensures the all 136L type courses come first, since 136 query will also return 136L results
    #coursenums=["121W"]
    coursenums.sort(key=len, reverse=True)

    for num in coursenums:
        URL = "https://classes.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl?sess=1231&level=under&subject="+subject+"&cournum="+num
        url_link = requests.get(URL)

        file = bs.BeautifulSoup(url_link.text, "lxml")

        find_table = file.find('table')
        rows = find_table.find_all('tr')
        
        courseInfo = []
        components=[]

        courseInfoFound = False

        for i in rows:
            table_data = i.find_all('td')
            data = [j.text for j in table_data]
            if len(data) > 0 and data[0].strip()==subject and not courseInfoFound:
                courseInfo = [k.strip() for k in data]
                courseInfoFound = True
                #only gets the first course, fixes 136-136L issue

                #for k in data:
                #    print(k.strip(), end=" ")
                #print("\n")
            
            if len(data) > 0 and len(data[0])>0 and "123456789".find(data[0][0]) != -1:
                curComponet = [k.strip() for k in data]
                components.append(curComponet)
            #print(data)
        
        print("insert into course values (", end=" ")#does insert into course table
        for i in range(0,4):
            print("\'"+courseInfo[i].replace("\'","")+"\'", end=" ")
            if i != 3:
                print(",", end=" ")
            else:
                print(");")
        
        for comp in components:
            #testing if comp code is unique, if not skip
            if comp[0] in compCodeSet:
                continue
                #just skip this component, it's already inserted
            else:
                compCodeSet.add(comp[0])

            #setting up teacher
            teachid = 0
            if len(comp) >= 13 and comp[12] != "":
                if comp[12] not in teachers:
                    teachers.add(comp[12])
                    teachid = teachIdCounter
                    teachIdCounter+=1
                    teachPairs.add((comp[12], teachid))
                    print("insert into professor values (", end=" ")
                    print("\""+str(teachid)+"\", ", end=" ") #id
                    print("\""+comp[12].split(",")[1]+"\", ", end=" ") #firstname
                    print("\""+comp[12].split(",")[0]+"\", ", end=" ") #lastname
                    print( "0,", end=" ") #onbreak bit
                    print( "NULL);") #pword
                        
                else:
                    for p in teachPairs:
                        if p[0] == comp[12]:
                            teachid = p[1]

            print("insert into component values (", end=" ")

            print(comp[0]+", ", end=" ")#id
            print("\""+courseInfo[0]+"\", ", end=" ")#csub
            print("\""+courseInfo[1]+"\", ", end=" ")#cnum
            compInfo = comp[1].split()
            print("\""+compInfo[0]+"\", ", end=" ")#ctype
            print("\""+compInfo[1]+"\", ", end=" ")#secnum
            campusInfo = comp[2].split()
            print("\""+campusInfo[0]+"\", ", end=" ")#campoff
            print("\""+campusInfo[1][0]+"\", ", end=" ")#camploc
            print(comp[3]+", ", end=" ")#assocnum
            print(comp[6]+", ", end=" ")#enrollcap
            print(comp[7]+", ", end=" ")#enrolltot

            #not parsing start and end date for now
            #dates format:03/06-03/06
            dates = re.findall(r'[0123][0123456789]/[0123][0123456789]',comp[10])
            if len(dates) == 2:
                print("\'2023-"+dates[0][0:2]+"-"+dates[0][3:5]+"\', ", end=" ")#startdate
                print("\'2023-"+dates[1][0:2]+"-"+dates[1][3:5]+"\', ", end=" ")#enddate
            else:
                print("NULL, ", end=" ")#startdate
                print("NULL, ", end=" ")#enddate

            if comp[10]=="":
                print("NULL, ", end=" ")#starttime
                print("NULL, ", end=" ")#endtime
                print("NULL, ", end=" ")#weekday
                weekdayList=[]
            else:
                #start time end time format:02:30-05:20
                #only ever have one start time and one end time, no need to duplicate
                timesList = re.findall(r'[012][0123456789]:[012345][0123456789]',comp[10])
                if len(timesList) == 2:
                    print("\""+timesList[0]+"\", ", end=" ")#starttime
                    print("\""+timesList[1]+"\", ", end=" ")#endtime
                else:
                    print("NULL, ", end=" ")#starttime
                    print("NULL, ", end=" ")#endtime

                #only parsing one day for multidays
                #use regex to parse all weekdays
                #weekday = comp[10][11]
                #if len(comp[10])>=13 and comp[10][12]=='h':
                #    weekday+=comp[10][12]
                #print("\""+weekday+"\", ", end=" ")#weekday

                #for original course code, just have first weekday
                #later on, create duplicate components with same info and unique id
                #for all the other days of the week
                weekdayList = re.findall(r'Th|T|M|W|F|S|U',comp[10])
                if len(weekdayList) > 0:
                    weekday=weekdayList[0]
                    print("\""+weekday+"\", ", end=" ")#weekday
                else:
                    print("NULL, ", end=" ")#weekday
            
            if comp[11] == "":
                print("NULL, ", end=" ")#building
                print("NULL, ", end=" ")#room
            else:
                buildingInfo = comp[11].split()
                print("\""+buildingInfo[0]+"\", ", end=" ")#building
                if len(buildingInfo) > 1:
                    print("\""+buildingInfo[1]+"\", ", end=" ")#roomnum
                else: 
                    print("NULL,", end=" ")#roomnum

            if len(comp) < 13 or comp[12] == "":
                print("NULL", end=" ")#pid
            else:
                print(teachid, end=" ")#pid

            print(");")

            if len(weekdayList) > 1:
                for i in range(1, len(weekdayList)):
                    print("insert into component values (", end=" ")

                    print(str(compIdCounter)+", ", end=" ")#id
                    compIdCounter += 1
                    print("\""+courseInfo[0]+"\", ", end=" ")#csub
                    print("\""+courseInfo[1]+"\", ", end=" ")#cnum
                    compInfo = comp[1].split()
                    print("\""+compInfo[0]+"\", ", end=" ")#ctype
                    print("\""+compInfo[1]+"\", ", end=" ")#secnum
                    campusInfo = comp[2].split()
                    print("\""+campusInfo[0]+"\", ", end=" ")#campoff
                    print("\""+campusInfo[1][0]+"\", ", end=" ")#camploc
                    print(comp[3]+", ", end=" ")#assocnum
                    print(comp[6]+", ", end=" ")#enrollcap
                    print(comp[7]+", ", end=" ")#enrolltot

                    #not parsing start and end date for now
                    #dates format:03/06-03/06
                    dates = re.findall(r'[0123][0123456789]/[0123][0123456789]',comp[10])
                    if len(dates) == 2:
                        print("\'2023-"+dates[0][0:2]+"-"+dates[0][3:5]+"\', ", end=" ")#startdate
                        print("\'2023-"+dates[1][0:2]+"-"+dates[1][3:5]+"\', ", end=" ")#enddate
                    else:
                        print("NULL, ", end=" ")#startdate
                        print("NULL, ", end=" ")#enddate

                    if comp[10]=="":
                        print("NULL, ", end=" ")#starttime
                        print("NULL, ", end=" ")#endtime
                        print("NULL, ", end=" ")#weekday
                    else:
                        #start time end time format:02:30-05:20
                        #only ever have one start time and one end time, no need to duplicate
                        timesList = re.findall(r'[012][0123456789]:[012345][0123456789]',comp[10])
                        if len(timesList) == 2:
                            print("\""+timesList[0]+"\", ", end=" ")#starttime
                            print("\""+timesList[1]+"\", ", end=" ")#endtime
                        else:
                            print("NULL, ", end=" ")#starttime
                            print("NULL, ", end=" ")#endtime

                        #only parsing one day for multidays
                        #use regex to parse all weekdays
                        #weekday = comp[10][11]
                        #if len(comp[10])>=13 and comp[10][12]=='h':
                        #    weekday+=comp[10][12]
                        #print("\""+weekday+"\", ", end=" ")#weekday

                        #for original course code, just have first weekday
                        #later on, create duplicate components with same info and unique id
                        #for all the other days of the week
                        weekday=weekdayList[i]
                        print("\""+weekday+"\", ", end=" ")#weekday
                    
                    if comp[11] == "":
                        print("NULL, ", end=" ")#building
                        print("NULL, ", end=" ")#room
                    else:
                        buildingInfo = comp[11].split()
                        print("\""+buildingInfo[0]+"\", ", end=" ")#building
                        if len(buildingInfo) > 1:
                            print("\""+buildingInfo[1]+"\", ", end=" ")#roomnum
                        else: 
                            print("NULL,", end=" ")#roomnum

                    if len(comp) < 13 or comp[12] == "":
                        print("NULL", end=" ")#pid
                    else:
                        print(teachid, end=" ")#pid

                    print(");")


            
    ##print(page.text)
    #soup = BeautifulSoup(page.content, "html.parser")

    #results = soup.find(id="ResultsContainer")
    ##print(results.prettify())

    #job_elements = results.find_all("div", class_="card-content")
    #for job_element in job_elements:
    #    title_element = job_element.find("h2", class_="title")
    #    company_element = job_element.find("h3", class_="company")
    #    location_element = job_element.find("p", class_="location")
    #    print(title_element.text.strip())
    #    print(company_element.text.strip())
    #    print(location_element.text.strip())
    #    print()