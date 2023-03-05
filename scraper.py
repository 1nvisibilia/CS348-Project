import bs4 as bs
import requests

#THIS SCRIPT DOES NOT DIRECTLY GENERATE INSERT_DATA.SQL, ITS OUTPUT SHOULD BE FURTHER CLEANED BY HAND

coursenums = ["100",  "105",  "106",  "114",  "115",  "116",  "135",  "136",  "136L",  "138",  "146",  "200",  "230",  "240",  "240E",  "241",  "245",  "246",  "251",  "330",  "335",  "338",  "341",  "343",  "346", 
 "348",  "349",  "350",  "360",  "365",  "370",  "371",  "430",  "431",  "436",  "442",  "444",  "445",  "446",  "447",  "448",  "450",  "451",  "452",  "454",  "456",  "458",  "467",  "476",  "479",  
"480",  "482",  "484",  "486",  "487",  "488",  "489",  "490",  "492",  "494",  "497",  "499R",  "499T"]
#coursenums=["348"]

teachers=set()
teachPairs=set()
counter=10000000

for num in coursenums:
    URL = "https://classes.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl?sess=1231&level=under&subject=CS&cournum="+num
    url_link = requests.get(URL)

    file = bs.BeautifulSoup(url_link.text, "lxml")

    find_table = file.find('table')
    rows = find_table.find_all('tr')
    
    courseInfo = []
    components=[]

    for i in rows:
        table_data = i.find_all('td')
        data = [j.text for j in table_data]
        if len(data) > 0 and data[0].strip()=="CS":
            courseInfo = [k.strip() for k in data]
            #for k in data:
            #    print(k.strip(), end=" ")
            #print("\n")
        
        if len(data) > 0 and len(data[0])>0 and "123456789".find(data[0][0]) != -1:
            curComponet = [k.strip() for k in data]
            components.append(curComponet)
        #print(data)
    
    print("insert into course values (", end=" ")#does insert into course table
    for i in range(0,4):
        print("\'"+courseInfo[i]+"\'", end=" ")
        if i != 3:
            print(",", end=" ")
        else:
            print(");")
    
    for comp in components:
        #setting up teacher
        teachid = 0
        if len(comp) >= 13 and comp[12] != "":
            if comp[12] not in teachers:
                teachers.add(comp[12])
                teachid = counter
                counter+=1
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
        print("NULL, ", end=" ")#startdate
        print("NULL, ", end=" ")#enddate

        if comp[10]=="":
            print("NULL, ", end=" ")#starttime
            print("NULL, ", end=" ")#endtime
            print("NULL, ", end=" ")#weekday
        else:
            timestart = comp[10][0:5]
            print("\""+timestart+"\", ", end=" ")#starttime
            timeend = comp[10][6:11]
            print("\""+timestart+"\", ", end=" ")#endtime

            #only parsing one day for multidays
            weekday = comp[10][11]
            if len(comp[10])>=13 and comp[10][12]=='h':
                weekday+=comp[10][12]
            print("\""+weekday+"\", ", end=" ")#weekday
        
        if comp[11] == "":
            print("NULL, ", end=" ")#building
            print("NULL, ", end=" ")#room
        else:
            buildingInfo = comp[11].split()
            print("\""+campusInfo[0]+"\", ", end=" ")#building
            print("\""+campusInfo[1][0]+"\", ", end=" ")#roomnum
        
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